// gun.ts

import {
  Component, PropTypes, Entity, ProjectileLauncherGizmo, ParticleGizmo, AudioGizmo,
  Player, CodeBlockEvents, NetworkEvent, Color, AvatarGripPoseAnimationNames, Vec3, World
} from 'horizon/core';
import LocalCamera, { CameraMode } from 'horizon/camera';

// ===================== WEAPON (base) =====================
export class Weapon<T> extends Component<typeof Weapon & T> {
  static propsDefinition = {
    cameraMode:   { type: PropTypes.String, default: 'ThirdPerson' },
    fireCooldown: { type: PropTypes.Number, default: 0.1 },
  };

  private fireCooldownMs: number = 100;
  private lastFired: number = -1;
  private previousCameraMode: CameraMode = CameraMode.ThirdPerson;
  protected instanceId: string = "";

  override preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabStart,
      (isRightHand, player) => this.onGrab(player));
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabEnd,
      (player) => this.onRelease(player));
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnIndexTriggerDown,
      (player) => this.onIndexTriggerDown(player));
    this.instanceId = this.entity.id.toString();
  }

  override start() {
    this.fireCooldownMs = this.props.fireCooldown * 1000;
  }

  onGrab(player: Player) {
    this.entity.owner.set(player);
    this.previousCameraMode = LocalCamera.currentMode.get();
    this.setCameraMode(this.getCameraModeFromString(this.props.cameraMode));
  }

  onRelease(_player: Player) {
    this.entity.owner.set(this.world.getServerPlayer());
    this.setCameraMode(this.previousCameraMode);
  }

  onIndexTriggerDown(player: Player): boolean {
    if (player.id === this.entity.owner.get().id) {
      if (this.lastFired === -1 || Date.now() - this.lastFired > this.fireCooldownMs) {
        this.lastFired = Date.now();
        player.playAvatarGripPoseAnimationByName(AvatarGripPoseAnimationNames.Fire);
        return true;
      }
    }
    return false;
  }

  private setCameraMode(mode: CameraMode) {
    const options = { duration: 0.4 };
    switch (mode) {
      case CameraMode.FirstPerson: LocalCamera.setCameraModeFirstPerson(options); break;
      case CameraMode.ThirdPerson: LocalCamera.setCameraModeThirdPerson(options); break;
      case CameraMode.Orbit:       LocalCamera.setCameraModeOrbit({ ...options, distance: 12 }); break;
      default:                     LocalCamera.setCameraModeThirdPerson(options); break;
    }
  }

  private getCameraModeFromString(modeStr: string): CameraMode {
    switch (modeStr) {
      case 'FirstPerson': return CameraMode.FirstPerson;
      case 'Orbit':       return CameraMode.Orbit;
      case 'ThirdPerson':
      default:            return CameraMode.ThirdPerson;
    }
  }
}

// ===================== GUN (auto-fire + color controls + auto-wiring) =====================
export class Gun extends Weapon<typeof Gun> {
  static propsDefinition = {
    // Organized for cleaner Properties UI
    cameraMode:       { type: PropTypes.String,  default: 'ThirdPerson' },
    autoFireEnabled:  { type: PropTypes.Boolean, default: true },
    autoFireRate:     { type: PropTypes.Number,  default: 10 },       // shots/sec
    fireCooldown:     { type: PropTypes.Number,  default: 0.1 },
    projectileSpeed:  { type: PropTypes.Number,  default: 40 },
    gunshotSfx:       { type: PropTypes.Entity },
    muzzleFlash:      { type: PropTypes.Entity },

    // Notes: launchersParent removed (auto-detected via SplatterManager);
    // isolateProjectileMaterials always on; color controls removed (always random)

    // Explicit launcher slots removed; auto-find under this gun is reliable with naming fixed
  };

  private currentLauncherIndex = 0;
  private launchers: (Entity | undefined)[] = [];
  private badLauncherIds: Set<string> = new Set();
  // Vibrant color sequencing state
  private hueCursor: number = Math.random();
  private readonly hueStep: number = 0.618033988749895; // golden-ratio conjugate
  private recentHues: number[] = [];
  

  // paletteColors removed (palette feature removed)
  private triggerHeld = false;
  private autoAccumulator = 0;
  private subs: Array<{ disconnect?: () => void } | null> = [];
  private cleanupSubscriptions() {
    try { this.subs.forEach(s => { try { s?.disconnect?.(); } catch {} }); } catch {}
    this.subs = [];
  }

  override start() {
    super.start();
    // Make start idempotent across hot-reloads
    this.cleanupSubscriptions();

    // Auto-find launchers strictly under THIS gun
    const scanRoot: Entity = this.entity;
    this.launchers = this.findLaunchersUnder(scanRoot);

    // Keep only entities that actually have a ProjectileLauncherGizmo
    this.launchers = this.launchers.filter(l => {
      try { return !!l?.as(ProjectileLauncherGizmo); } catch { return false; }
    });

    // Seed hue from instanceId for per-gun variation (stable across sessions)
    try {
      const seed = this.hashStringToUnit(this.instanceId || (this.entity as any)?.id?.toString?.() || String(Math.random()));
      if (isFinite(seed)) this.hueCursor = seed;
    } catch {}

    // No muzzles handling; single-launch per launcher

    // no palette parsing

    // stop auto-fire on trigger up
    this.subs.push(this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnIndexTriggerUp, (_p: Player) => {
      this.triggerHeld = false;
      this.autoAccumulator = 0;
    }) as any);

    // auto-fire loop (per instance)
    this.subs.push(this.connectLocalBroadcastEvent(World.onUpdate, (data: { deltaTime: number }) => {
      if (!this.props.autoFireEnabled || !this.triggerHeld) return;

      const shotsPerSec = Math.max(1, this.props.autoFireRate || 10);
      const interval = 1 / shotsPerSec;
      this.autoAccumulator += data.deltaTime;
      let attempts = 0;
      const maxPerFrame = 2; // avoid large catch-up bursts on slow frames
      while (this.autoAccumulator >= interval && attempts < maxPerFrame) {
        this.autoAccumulator -= interval;
        const owner = this.entity.owner.get() as Player | any;
        if (super.onIndexTriggerDown(owner as Player)) {
          this.fireProjectile();
        } else {
          // cooled down: avoid tight loop
          this.autoAccumulator = Math.min(this.autoAccumulator, interval * 0.5);
          break;
        }
        attempts++;
      }
    }) as any);
  }

  override onGrab(player: Player) {
    super.onGrab(player);
    this.launchers.forEach(l => l?.owner.set(player));
  }

  override onRelease(player: Player) {
    super.onRelease(player);
    this.launchers.forEach(l => l?.owner.set(this.world.getServerPlayer()));
    this.triggerHeld = false;
    this.autoAccumulator = 0;
  }

  override onIndexTriggerDown(player: Player): boolean {
    this.triggerHeld = true;
    if (super.onIndexTriggerDown(player)) {
      this.fireProjectile();
      return true;
    }
    return false;
  }

  private fireProjectile() {
    // choose launcher
    const currentLauncherEntity = this.getNextValidLauncher();
    if (!currentLauncherEntity) {
      try { console.warn('[Gun] No valid launcher found to fire'); } catch {}
      return;
    }
    const launcherGizmo = currentLauncherEntity.as(ProjectileLauncherGizmo);

    // color per shot
    const shotColor = this.pickStyledColor();
    const shotVec = new Vec3(shotColor.r, shotColor.g, shotColor.b);

    // tell ImpactSplatter on THIS launcher (co-component pattern)
    const impact = currentLauncherEntity.getComponents().find(
      (c: any) => typeof c?.setShotColor === "function"
    ) as any;
    try { impact?.setShotColor?.(shotVec); } catch {}

    // tint projectile on spawn (single-shot per fire)
    let remaining = 1;
    let fired = false;
    const sub = this.connectCodeBlockEvent(
      launcherGizmo,
      CodeBlockEvents.OnProjectileLaunched,
      (projectile: Entity) => {
        fired = true;
        const SetColor = new NetworkEvent<{ color: Color }>('SetColor_' + this.instanceId);
        this.sendNetworkEvent(projectile, SetColor, { color: shotColor });

        // Always isolate projectile materials so tinting is per-projectile
        try { this.isolateProjectileMaterialsFor(projectile); } catch {}

        // robust local tinting: immediate + short retry window to catch late-attached renderers
        this.tryApplyColor(projectile, shotColor);
        this.retryApplyColor(projectile, shotColor, /*maxAttempts*/ 2, /*intervalMs*/ 40);
        remaining -= 1;
        if (remaining <= 0) sub.disconnect();
      }
    );

    // Monitor this shot; if no projectile spawns shortly, mark launcher as bad to avoid future blanks
    try {
      const idStr = (() => { try { return String((currentLauncherEntity as any)?.id); } catch { return ''; } })();
      if (idStr) {
        let acc = 0;
        const mon = this.connectLocalBroadcastEvent(World.onUpdate, (data: { deltaTime: number }) => {
          acc += (data?.deltaTime || 0);
          if (acc >= 0.25) {
            if (!fired) {
              try { this.badLauncherIds.add(idStr); console.warn('[Gun] Marked launcher as bad (no projectile):', idStr); } catch {}
            }
            try { mon.disconnect(); } catch {}
          }
        });
      }
    } catch {}

    // single launch from selected launcher
    launcherGizmo.launch({ speed: this.props.projectileSpeed });

    // VFX/SFX
    this.props.muzzleFlash?.as(ParticleGizmo)?.play();
    // No tinting of muzzle flash (option removed)
    this.props.gunshotSfx?.as(AudioGizmo)?.play();
  }

  private isolateProjectileMaterialsFor(root: Entity) {
    const visited = new Set<Entity>();
    const queue: Entity[] = [root];
    let guard = 0;
    while (queue.length && guard++ < 64) {
      const n = queue.shift()!;
      if (visited.has(n)) continue;
      visited.add(n);
      // Clone entity-level material(s) if present
      try {
        const mat = (n as any).material;
        if (mat) {
          try {
            let clone: any = null;
            if (typeof mat.clone === 'function') clone = mat.clone();
            else if (typeof mat.instantiate === 'function') clone = mat.instantiate();
            else if (typeof mat.duplicate === 'function') clone = mat.duplicate();
            if (clone) (n as any).material = clone;
          } catch {}
        }
      } catch {}
      try {
        const mats = (n as any).materials ?? (n as any).materials?.get?.();
        if (Array.isArray(mats)) {
          const arr = (n as any).materials?.get?.() ?? mats.slice();
          for (let i = 0; i < arr.length; i++) {
            const m = arr[i];
            try {
              let clone: any = null;
              if (m?.clone) clone = m.clone();
              else if (m?.instantiate) clone = m.instantiate();
              else if (m?.duplicate) clone = m.duplicate();
              if (clone) arr[i] = clone;
            } catch {}
          }
          try { (n as any).materials?.set?.(arr); } catch {}
        }
      } catch {}
      // Clone on components that reference materials
      try {
        const comps = (n as any)?.getComponents?.();
        if (Array.isArray(comps)) {
          for (const comp of comps) {
            try {
              const cmat = (comp as any).material;
              if (cmat) {
                try {
                  let clone: any = null;
                  if (cmat?.clone) clone = cmat.clone();
                  else if (cmat?.instantiate) clone = cmat.instantiate();
                  else if (cmat?.duplicate) clone = cmat.duplicate();
                  if (clone) (comp as any).material = clone;
                } catch {}
              }
            } catch {}
            try {
              const cmats = (comp as any).materials ?? (comp as any).materials?.get?.();
              if (Array.isArray(cmats)) {
                const carr = (comp as any).materials?.get?.() ?? cmats.slice();
                for (let i = 0; i < carr.length; i++) {
                  const m = carr[i];
                  try {
                    let clone: any = null;
                    if (m?.clone) clone = m.clone();
                    else if (m?.instantiate) clone = m.instantiate();
                    else if (m?.duplicate) clone = m.duplicate();
                    if (clone) carr[i] = clone;
                  } catch {}
                }
                try { (comp as any).materials?.set?.(carr); } catch {}
              }
            } catch {}
          }
        }
      } catch {}
      try {
        const kids = ((n as any).children?.get?.() ?? []) as Entity[];
        if (Array.isArray(kids)) kids.forEach(k => k && queue.push(k));
      } catch {}
    }
  }

  private tryApplyColor(e: Entity, c: Color): boolean {
    let applied = false;
    try { if ((e as any)?.color?.set) { (e as any).color.set(c); applied = true; } } catch {}
    try {
      if (!applied) {
        const kids = (((e as any)?.children?.get?.() ?? []) as Entity[]);
        if (Array.isArray(kids)) {
          for (const k of kids) {
            try { if ((k as any)?.color?.set) { (k as any).color.set(c); applied = true; break; } } catch {}
          }
        }
      }
    } catch {}
    return applied;
  }

  private retryApplyColor(projectile: Entity, c: Color, maxAttempts: number, intervalMs: number) {
    let attempts = 0;
    let acc = 0;
    const sub = this.connectLocalBroadcastEvent(World.onUpdate, (data: { deltaTime: number }) => {
      if (attempts >= maxAttempts) { try { sub.disconnect(); } catch {} return; }
      acc += (data?.deltaTime || 0);
      if (acc < intervalMs / 1000) return;
      acc = 0;
      const ok = this.tryApplyColor(projectile, c);
      attempts++;
      if (ok || attempts >= maxAttempts) { try { sub.disconnect(); } catch {} }
    });
  }

  // ---------- helpers ----------
  private pickStyledColor(): Color {
    // Low-repetition vibrant hues using golden-angle sequence
    let h = (this.hueCursor + this.hueStep) % 1;
    // Nudge away from very recent hues to avoid perceptual repeats
    let guard = 0;
    while (this.isHueTooCloseToRecent(h) && guard++ < 6) h = (h + this.hueStep) % 1;
    this.hueCursor = h;
    this.recentHues.push(h); if (this.recentHues.length > 6) this.recentHues.shift();

    const s = 0.88 + Math.random() * 0.12; // 0.88..1.0
    const v = 0.92 + Math.random() * 0.08; // 0.92..1.0
    const rgb = hsv2rgb(h, s, v);
    return new Color(rgb.r, rgb.g, rgb.b);
  }

  private isHueTooCloseToRecent(h: number): boolean {
    const minGap = 0.08; // ~29 degrees on the color wheel
    for (const r of this.recentHues) {
      const d = Math.abs(h - r);
      const wrap = Math.min(d, 1 - d);
      if (wrap < minGap) return true;
    }
    return false;
  }

  // parsePalette removed (palette feature removed)

  private findLaunchersUnder(root: Entity): Entity[] {
    const out: Entity[] = [];
    const stack: Entity[] = [root];
    let guard = 0;
    while (stack.length && guard++ < 2048) {
      const n = stack.pop()!;
      try {
        if (n !== root && n.as(ProjectileLauncherGizmo)) {
          let ok = true;
          // Must be enabled/active if such flags exist
          try { const en = (n as any).enabled?.get?.(); if (typeof en === 'boolean' && !en) ok = false; } catch {}
          try { if (typeof (n as any).enabled === 'boolean' && !(n as any).enabled) ok = false; } catch {}
          if (ok) out.push(n);
        }
      } catch {}
      try {
        const kids = ((n as any).children?.get?.() ?? []) as Entity[];
        if (Array.isArray(kids)) kids.forEach(k => k && stack.push(k));
      } catch {}
    }
    // Stable order: prefer numeric suffix if present, else by name
    out.sort((a, b) => {
      const an = (((a as any).name?.get?.() ?? (a as any).name ?? '') as string).trim();
      const bn = (((b as any).name?.get?.() ?? (b as any).name ?? '') as string).trim();
      const am = an.match(/(\d{1,3})$/);
      const bm = bn.match(/(\d{1,3})$/);
      const ai = am ? parseInt(am[1], 10) : 9999;
      const bi = bm ? parseInt(bm[1], 10) : 9999;
      if (ai !== bi) return ai - bi;
      return an.localeCompare(bn);
    });
    // de-dupe by id (safety)
    const seen = new Set<string>();
    const dedup: Entity[] = [];
    for (const e of out) {
      try {
        const id = String((e as any)?.id);
        if (!seen.has(id)) { seen.add(id); dedup.push(e); }
      } catch { dedup.push(e); }
    }
    // Cap to 10 launchers max (Launcher1..Launcher10)
    return dedup.slice(0, 10);
  }

  // findMuzzlesUnder removed (single-launch mode removed)

  private getNextValidLauncher(): Entity | undefined {
    const n = Math.max(0, this.launchers.length);
    if (n === 0) return undefined;
    for (let t = 0; t < n; t++) {
      const idx = this.currentLauncherIndex % n;
      const cand = this.launchers[idx];
      this.currentLauncherIndex = (this.currentLauncherIndex + 1) % n;
      try {
        if (cand && cand.as(ProjectileLauncherGizmo)) {
          // Skip candidates previously observed to not spawn projectiles
          try {
            const idStr = String((cand as any)?.id);
            if (idStr && this.badLauncherIds.has(idStr)) continue;
          } catch {}
          return cand;
        }
      } catch {}
    }
    return undefined;
  }

  // findSplatterManagerRoot removed: we now strictly scan under this gun only

  private hashStringToUnit(s: string): number {
    try {
      let h = 2166136261 >>> 0; // FNV-1a
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
      }
      // map to [0,1)
      return (h % 100000) / 100000;
    } catch {
      return Math.random();
    }
  }
}

// ---- utilities ----
// Minimal color helper
function hsv2rgb(h: number, s: number, v: number) {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: return { r: v, g: t, b: p };
    case 1: return { r: q, g: v, b: p };
    case 2: return { r: p, g: v, b: t };
    case 3: return { r: p, g: q, b: v };
    case 4: return { r: t, g: p, b: v };
    case 5: return { r: v, g: p, b: q };
    default: return { r: v, g: t, b: p };
  }
}

Component.register(Gun);
