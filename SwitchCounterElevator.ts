// switchcounterelevator.ts (simple controller)
import { Component, PropTypes, Entity, NetworkEvent, Vec3, World } from 'horizon/core';

// Minimal controller with intuitive props:
// - totalTargets: how many switches must report in
// - currentCount: increments when switches send SwitchCounter_Increment
// - elevator: the platform entity to move (defaults to this entity)
// - travelAxis/travelDistance/speed: simple motion once activated; ping-pongs
export class SwitchCounterElevator extends Component<typeof SwitchCounterElevator> {
  static propsDefinition = {
    totalTargets:  { type: PropTypes.Number,  default: 1 },
    currentCount:  { type: PropTypes.Number,  default: 0 },
    activated:     { type: PropTypes.Boolean, default: false },

    elevator:      { type: PropTypes.Entity,  default: null },
    travelAxis:    { type: PropTypes.Vec3,    default: new Vec3(0, 1, 0) },
    travelDistance:{ type: PropTypes.Number,  default: 4 },
    speed:         { type: PropTypes.Number,  default: 1 },

    debug:         { type: PropTypes.Boolean, default: false },
  };

  private basePos: Vec3 | null = null;
  private dir = 1;

  override start() {
    // Listen for increment events on this entity
    const incEvt = new NetworkEvent<{ by: number }>('SwitchCounter_Increment');
    (this as any).connectNetworkEvent?.(this.entity, incEvt, (p: { by: number }) => this.onIncrement(p));

    // Cache start position
    const elev = (this.props.elevator as Entity) || this.entity;
    try { this.basePos = ((elev as any).worldPosition?.get?.() || (elev as any).position?.get?.()); } catch {}
    if (!this.basePos) this.basePos = new Vec3(0, 0, 0);

    // Drive motion when activated
    this.connectLocalBroadcastEvent(World.onUpdate, (d: { deltaTime: number }) => this.tick(d.deltaTime));
  }

  public reset() {
    (this.props as any).currentCount = 0;
    (this.props as any).activated = false;
    this.dir = 1;
    // snap back to base
    const elev = (this.props.elevator as Entity) || this.entity;
    try {
      if ((elev as any).worldPosition?.set) (elev as any).worldPosition.set(this.basePos);
      else if ((elev as any).position?.set) (elev as any).position.set(this.basePos);
    } catch {}
  }

  private onIncrement(p: { by: number }) {
    const by = Math.max(1, Number(p?.by) || 1);
    (this.props as any).currentCount = ((this.props as any).currentCount | 0) + by;
    const total = Math.max(1, (this.props.totalTargets | 0));
    if (!this.props.activated && (this.props as any).currentCount >= total) {
      (this.props as any).activated = true;
      if (this.props.debug) console.log('[SwitchCounterElevator] Activated');
    }
    if (this.props.debug) console.log(`[SwitchCounterElevator] Count ${ (this.props as any).currentCount } / ${ total }`);
  }

  private tick(dt: number) {
    if (!this.props.activated) return;
    const elev = (this.props.elevator as Entity) || this.entity;
    if (!elev || !this.basePos) return;

    const axis = this.normalized(this.props.travelAxis || new Vec3(0, 1, 0));
    const dist = Math.max(0, Number(this.props.travelDistance) || 0);
    const spd  = Math.max(0, Number(this.props.speed) || 0);
    if (dist <= 0 || spd <= 0) return;

    let pos: Vec3 | null = null as any;
    try { pos = (elev as any).worldPosition?.get?.(); } catch {}
    if (!pos) { try { pos = (elev as any).position?.get?.(); } catch {} }
    if (!pos) return;

    const prog = this.dot(this.sub(pos, this.basePos), axis);
    let nextProg = prog + this.dir * spd * dt;
    if (nextProg > dist) { nextProg = dist; this.dir = -1; }
    if (nextProg < 0)    { nextProg = 0;    this.dir =  1; }

    const targetPos = this.add(this.basePos, this.scale(axis, nextProg));
    try {
      if ((elev as any).worldPosition?.set) (elev as any).worldPosition.set(targetPos);
      else if ((elev as any).position?.set) (elev as any).position.set(targetPos);
    } catch {}
  }

  // Vec3 helpers
  private sub(a: Vec3, b: Vec3) { return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z); }
  private add(a: Vec3, b: Vec3) { return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z); }
  private scale(a: Vec3, s: number) { return new Vec3(a.x * s, a.y * s, a.z * s); }
  private dot(a: Vec3, b: Vec3) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  private len(a: Vec3) { return Math.sqrt(this.dot(a, a)); }
  private normalized(a: Vec3) { const L = this.len(a); return L > 1e-6 ? this.scale(a, 1 / L) : new Vec3(0, 1, 0); }
}

Component.register(SwitchCounterElevator);

