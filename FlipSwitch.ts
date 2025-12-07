// flipswitch.ts (simplified)
import { Component, PropTypes, Entity, NetworkEvent, Vec3, Quaternion, World } from 'horizon/core';

type ImpactPayload = { pos: Vec3, normal: Vec3 };

// This version is dead-simple: assign `target` to an object that owns the counter
// (e.g., a SwitchCounterElevator). Shooting this entity flips it 180°, briefly pauses
// any Rotate component on it, and increments the target's counter once per switch.
export class FlipSwitch extends Component<typeof FlipSwitch> {
  static propsDefinition = {
    // Set this to the object that contains the counter (e.g., the elevator controller)
    target:      { type: PropTypes.Entity,  default: null },
    // Count only once per switch (recommended for "all targets" puzzles)
    countOnce:   { type: PropTypes.Boolean, default: true },
    // Optional: choose a different mesh to flip; leave empty to flip this entity
    visual:      { type: PropTypes.Entity,  default: null },
    // Smooth rotate duration in ms (180° yaw)
    rotateDurationMs: { type: PropTypes.Number, default: 300 },

    // Optional simple movement for the target/visual
    moveEnableLeftRight:   { type: PropTypes.Boolean, default: false }, // X
    moveEnableUpDown:      { type: PropTypes.Boolean, default: false }, // Y
    moveEnableForwardBack: { type: PropTypes.Boolean, default: false }, // Z
    moveDistance:          { type: PropTypes.Vec3,    default: new Vec3(0, 0, 0) }, // half-range from start
    moveSpeed:             { type: PropTypes.Vec3,    default: new Vec3(0.5, 0.5, 0.5) }, // units/sec
    moveUseLocalAxes:      { type: PropTypes.Boolean, default: false },
    moveActive:            { type: PropTypes.Boolean, default: false },
    debug:       { type: PropTypes.Boolean, default: false },
  };

  // Internal gates
  private counted = false;
  private done = false; // when true, ignore further hits (prevents repeated flips)
  private lastAt = 0;
  private unpauseAt = 0;
  private rotateCompCache: any | null = null;
  private origRotateSpeed: Vec3 | null = null;
  // animation state
  private animActive = false;
  private animStartQ: any = null;
  private animEndQ: any = null;
  private animStartAt = 0;
  private animDuration = 0;
  private animFreezePos: Vec3 | null = null;

  // movement state
  private moveBasePos: Vec3 | null = null;
  private moveOffset = new Vec3(0, 0, 0);
  private moveDir = new Vec3(1, 1, 1);

  override start() {
    // Listen for hits from ImpactSplatter using the standard impact event name
    try {
      const evt = new NetworkEvent<ImpactPayload>('OnGunImpact');
      (this as any).connectNetworkEvent?.(this.entity, evt, (_payload: ImpactPayload) => this.onImpact());
    } catch {}

    // Initialize movement base position
    const moveEnt: Entity = (this.props.visual as Entity) || this.entity;
    try { this.moveBasePos = ((moveEnt as any).worldPosition?.get?.() || (moveEnt as any).position?.get?.()); } catch {}
    if (!this.moveBasePos) this.moveBasePos = new Vec3(0, 0, 0);

    // Movement updater (cheap)
    this.connectLocalBroadcastEvent(World.onUpdate, (d: { deltaTime: number }) => this.tickMovement(d.deltaTime));
  }

  // Also allow the method to be called directly
  public onShot(_data: ImpactPayload) { this.onImpact(); }

  private onImpact() {
    const now = Date.now();
    if (this.done || this.animActive) return;
    if (now - this.lastAt < 150) return; // small debounce
    this.lastAt = now;

    // Start smooth flip and pause Rotate while animating
    const dur = Math.max(1, (this.props.rotateDurationMs | 0));
    this.pauseRotateFor(dur + 50);
    // Stop movement immediately so target doesn't drift
    try { (this.props as any).moveActive = false; } catch {}
    this.startFlipAnim180(dur);

    // Increment the linked counter (only once if countOnce is true)
    if (!this.props.countOnce || !this.counted) {
      this.incrementTarget();
      if (this.props.countOnce) this.counted = true;
    }

    // Disable any further flipping
    this.done = true;
  }

  public reset() {
    // Allow external reset (optional)
    this.counted = false;
  }

  private incrementTarget() {
    const tgt = this.props.target as Entity | null;
    if (!tgt) return;
    try {
      const inc = new NetworkEvent<{ by: number }>('SwitchCounter_Increment');
      this.sendNetworkEvent(tgt, inc, { by: 1 });
      if (this.props.debug) console.log('[FlipSwitch] increment sent to target');
    } catch {}
  }

  private startFlipAnim180(durationMs: number) {
    const visual: Entity = (this.props.visual as Entity) || this.entity;
    // Capture start and target rotation (use local rotation for in-place behavior)
    let startQ: any = null;
    try { startQ = (visual as any).rotation?.get?.(); } catch {}
    if (!startQ) { try { startQ = (visual as any).worldRotation?.get?.(); } catch {} }
    if (!startQ) return;

    // Also capture the current world position to freeze during animation
    this.animFreezePos = null;
    try { this.animFreezePos = (visual as any).worldPosition?.get?.(); } catch {}
    if (!this.animFreezePos) { try { this.animFreezePos = (visual as any).position?.get?.(); } catch {} }

    const deltaQ = Quaternion.fromEuler(new Vec3(0, 180, 0));
    const endQ = deltaQ.mul(startQ);

    this.animActive = true;
    this.animStartQ = startQ;
    this.animEndQ = endQ;
    this.animStartAt = Date.now();
    this.animDuration = Math.max(1, durationMs | 0);

    const sub = this.connectLocalBroadcastEvent(World.onUpdate, (d: { deltaTime: number }) => {
      const t = Math.min(1, (Date.now() - this.animStartAt) / this.animDuration);
      const q = this.slerpAny(this.animStartQ, this.animEndQ, t);
      // Apply local rotation for in-place turning
      this.applyLocalQuatToEntity(visual, q);
      // Force position to remain constant during animation to avoid arcs
      if (this.animFreezePos) {
        try { (visual as any).worldPosition?.set?.(this.animFreezePos); } catch {}
        try { (visual as any).position?.set?.(this.animFreezePos); } catch {}
      }
      if (t >= 1) {
        this.animActive = false;
        try { sub.disconnect(); } catch {}
      }
    });
  }

  private slerpAny(a: any, b: any, t: number): any {
    // Try a few common quaternion slerp APIs to maximize compatibility
    try { if (typeof (Quaternion as any).slerp === 'function') return (Quaternion as any).slerp(a, b, t); } catch {}
    try { if (typeof a?.slerp === 'function') return a.slerp(b, t); } catch {}
    // Fallback: linear interpolate components then normalize (approximation)
    const aq = a; const bq = b;
    const lerp = (x: number, y: number) => x + (y - x) * t;
    const q = { x: lerp(aq.x, bq.x), y: lerp(aq.y, bq.y), z: lerp(aq.z, bq.z), w: lerp(aq.w, bq.w) } as any;
    // try to normalize if API exists
    try { if (typeof q.normalize === 'function') q.normalize(); } catch {}
    return q;
  }

  private applyQuatToEntity(e: Entity, q: any) {
    try { (e as any).worldRotation?.set?.(q); } catch {}
    try { (e as any).rotation?.set?.(q); } catch {}
  }

  private applyLocalQuatToEntity(e: Entity, q: any) {
    try { (e as any).rotation?.set?.(q); } catch {}
    // fallback to world if local not available
    try { (e as any).worldRotation?.set?.(q); } catch {}
  }

  // ----------------- movement -----------------
  private tickMovement(dt: number) {
    if (!this.props.moveActive) return;
    const e: Entity = (this.props.visual as Entity) || this.entity;
    if (!e || !this.moveBasePos) return;

    const dist = this.props.moveDistance || new Vec3(0, 0, 0);
    const spd  = this.props.moveSpeed    || new Vec3(0, 0, 0);

    if (this.props.moveEnableLeftRight && dist.x > 0 && spd.x > 0) {
      this.moveOffset.x += this.moveDir.x * spd.x * dt;
      if (this.moveOffset.x >  dist.x) { this.moveOffset.x =  dist.x; this.moveDir.x = -1; }
      if (this.moveOffset.x < -dist.x) { this.moveOffset.x = -dist.x; this.moveDir.x =  1; }
    } else {
      this.moveOffset.x = Math.max(-dist.x, Math.min(dist.x, this.moveOffset.x));
    }

    if (this.props.moveEnableUpDown && dist.y > 0 && spd.y > 0) {
      this.moveOffset.y += this.moveDir.y * spd.y * dt;
      if (this.moveOffset.y >  dist.y) { this.moveOffset.y =  dist.y; this.moveDir.y = -1; }
      if (this.moveOffset.y < -dist.y) { this.moveOffset.y = -dist.y; this.moveDir.y =  1; }
    } else {
      this.moveOffset.y = Math.max(-dist.y, Math.min(dist.y, this.moveOffset.y));
    }

    if (this.props.moveEnableForwardBack && dist.z > 0 && spd.z > 0) {
      this.moveOffset.z += this.moveDir.z * spd.z * dt;
      if (this.moveOffset.z >  dist.z) { this.moveOffset.z =  dist.z; this.moveDir.z = -1; }
      if (this.moveOffset.z < -dist.z) { this.moveOffset.z = -dist.z; this.moveDir.z =  1; }
    } else {
      this.moveOffset.z = Math.max(-dist.z, Math.min(dist.z, this.moveOffset.z));
    }

    // transform offset by local axes if requested
    let disp = this.moveOffset;
    if (this.props.moveUseLocalAxes) {
      const q = ((e as any).worldRotation?.get?.() || (e as any).rotation?.get?.());
      if (q) disp = this.rotateVecByQuat(this.moveOffset, q);
    }

    const targetPos = new Vec3(
      this.moveBasePos.x + disp.x,
      this.moveBasePos.y + disp.y,
      this.moveBasePos.z + disp.z,
    );
    try {
      if ((e as any).worldPosition?.set) (e as any).worldPosition.set(targetPos);
      else if ((e as any).position?.set) (e as any).position.set(targetPos);
    } catch {}
  }

  private rotateVecByQuat(v: Vec3, q: any): Vec3 {
    // v' = q * v * q^-1 (vector rotation shortcut)
    const x = v.x, y = v.y, z = v.z;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    const tx = 2 * (qy * z - qz * y);
    const ty = 2 * (qz * x - qx * z);
    const tz = 2 * (qx * y - qy * x);
    return new Vec3(
      x + qw * tx + (qy * tz - qz * ty),
      y + qw * ty + (qz * tx - qx * tz),
      z + qw * tz + (qx * ty - qy * tx),
    );
  }

  private pauseRotateFor(ms: number) {
    const visual: Entity = (this.props.visual as Entity) || this.entity;
    const comp = this.getRotateComponent(visual);
    if (!comp) return;
    try {
      if (!this.origRotateSpeed) this.origRotateSpeed = new Vec3(comp.props.rotationSpeed.x, comp.props.rotationSpeed.y, comp.props.rotationSpeed.z);
      comp.props.rotationSpeed = new Vec3(0, 0, 0);
      this.unpauseAt = Date.now() + Math.max(1, ms | 0);
      const sub = this.connectLocalBroadcastEvent(World.onUpdate, () => {
        if (this.unpauseAt > 0 && Date.now() >= this.unpauseAt) {
          this.restoreRotate();
          this.unpauseAt = 0;
          try { sub.disconnect(); } catch {}
        }
      });
    } catch {}
  }

  private restoreRotate() {
    const visual: Entity = (this.props.visual as Entity) || this.entity;
    const comp = this.getRotateComponent(visual);
    if (!comp) return;
    if (this.origRotateSpeed) {
      try { comp.props.rotationSpeed = new Vec3(this.origRotateSpeed.x, this.origRotateSpeed.y, this.origRotateSpeed.z); } catch {}
    }
  }

  private getRotateComponent(e: Entity): any | null {
    if (this.rotateCompCache) return this.rotateCompCache;
    try {
      const comps = (e as any)?.getComponents?.();
      if (Array.isArray(comps)) {
        for (const c of comps) {
          const name = (c?.constructor?.name || '').toString();
          if (name === 'Rotate') { this.rotateCompCache = c; return c; }
        }
      }
    } catch {}
    return null;
  }
}

Component.register(FlipSwitch);
