// impactsplatter.ts

import {
  Component, PropTypes, Vec3, Quaternion,
  CodeBlockEvents, Entity, Color, World, NetworkEvent
} from "horizon/core";

export class ImpactSplatter extends Component<typeof ImpactSplatter> {
  static executionMode = "local";

  // Hide props again (auto-wiring handles SplatPool*/SplatPool)
  static propsDefinition = {} as any;
  static _propsDefinition = {
    // If null, we auto-find a child named "SplatPool" under the asset root.
    poolParent:          { type: PropTypes.Entity,  default: null },

    // Visual
    splatScale:          { type: PropTypes.Number,  default: 0.4 },
    surfaceOffset:       { type: PropTypes.Number,  default: 0.006 },

    // Stick policy (parent if possible; fallback uses light follower only when parenting fails)
    stickToMovingTarget: { type: PropTypes.Boolean, default: true },
    // Ignore hits on our own splat pool (safety against self-hit loops)
    ignoreSelfHits:      { type: PropTypes.Boolean, default: true },
    // Dedupe repeated engine hit callbacks (per target/position)
    hitDedupMs:          { type: PropTypes.Number,  default: 40 },
    dedupPosEpsilon:     { type: PropTypes.Number,  default: 0.01 },
    // Limit how many follower splats we update per frame (perf)
    maxFollowerUpdatesPerFrame: { type: PropTypes.Number, default: 16 },
    // Auto-expire followers after N ms (prevents long-lived tracking)
    followerTTLms:       { type: PropTypes.Number,  default: 5000 },
    // Retry parenting for a short period to encourage attachment
    parentRetryMs:       { type: PropTypes.Number,  default: 80 },
    parentRetryMax:      { type: PropTypes.Number,  default: 12 },
    // Global per-frame TRS action budget (pos/rot updates). 1 pos + 1 rot ≈ 2 actions
    maxTRSActionsPerFrame: { type: PropTypes.Number, default: 80 },
    // Follower update cadence and thresholds
    followerUpdateIntervalMs: { type: PropTypes.Number, default: 50 },
    posUpdateEpsilon:     { type: PropTypes.Number,  default: 0.003 },
    rotUpdateEpsilonDeg:  { type: PropTypes.Number,  default: 1.0 },
    // Per-target cap to avoid crowding one moving object
    maxFollowersPerTarget: { type: PropTypes.Number, default: 3 },
    // Ensure occasional refresh even with tiny deltas
    forceRefreshMs: { type: PropTypes.Number, default: 250 },

    // Safety / performance
    maxActiveSplats:     { type: PropTypes.Number,  default: 24 }, // hard cap of "in play" splats
    impactRateLimitMs:   { type: PropTypes.Number,  default: 8 },  // ignore duplicate hits within this window
    enableDeepTint:      { type: PropTypes.Boolean, default: false },
    // Emit a hit event so targets can react
    emitImpactEvent:     { type: PropTypes.Boolean, default: true },
    impactEventName:     { type: PropTypes.String,  default: 'OnGunImpact' },
    callOnShotMethod:    { type: PropTypes.Boolean, default: false },
    // Splat color styling (applied only to splats; bullets unaffected)
    splatSaturation:     { type: PropTypes.Number,  default: 1.2 },
    splatBrightness:     { type: PropTypes.Number,  default: 1.15 },
    splatGamma:          { type: PropTypes.Number,  default: 1.2 },
    // Material controls
    forceVertexColors:   { type: PropTypes.Boolean, default: false },
    enableEmissiveTint:  { type: PropTypes.Boolean, default: true },
    emissiveBoost:       { type: PropTypes.Number,  default: 1.4 },

    // Debug
    debug:               { type: PropTypes.Boolean, default: false },
  };

  // Internal defaults to preserve behavior without exposing editor props
  private readonly DEF = {
    poolParent: null,
    splatScale: 0.4,
    surfaceOffset: 0.008,
    stickToMovingTarget: true,
    ignoreSelfHits: true,
    hitDedupMs: 40,
    dedupPosEpsilon: 0.01,
    maxFollowerUpdatesPerFrame: 16,
    followerTTLms: 0,           // 0 = infinite follow
    parentRetryMs: 80,
    parentRetryMax: -1,         // -1 = infinite retries
    maxTRSActionsPerFrame: 80,
    followerUpdateIntervalMs: 50,
    posUpdateEpsilon: 0.003,
    rotUpdateEpsilonDeg: 1.0,
    maxFollowersPerTarget: 3,
    forceRefreshMs: 250,
    maxActiveSplats: 24,
    impactRateLimitMs: 8,
    enableDeepTint: true,
    emitImpactEvent: true,
    impactEventName: 'OnGunImpact',
    callOnShotMethod: false,
    splatSaturation: 1.2,
    splatBrightness: 1.15,
    splatGamma: 1.2,
    forceVertexColors: false,
    enableEmissiveTint: true,
    emissiveBoost: 1.4,
    debug: false,
  } as const;
  private _cfg: any = null;
  private get P(): any { return this._cfg ?? (this.props as any); }
  private applyDefaults() {
    const P: any = this.props as any;
    const D: any = this.DEF as any;
    for (const k of Object.keys(D)) {
      try { if (typeof P[k] === 'undefined') P[k] = D[k]; } catch {}
    }
  }

  // Allow external managers to re-snapshot current props into the live config
  public refreshConfig() {
    try { this._cfg = { ...(this.DEF as any), ...(this.props as any) }; } catch { this._cfg = this.DEF; }
  }

  private currentShotColor: Color | null = null;

  /** Gun.ts calls this with Vec3(0..1) */
  public setShotColor(rgb: Vec3) {
    try {
      this.currentShotColor = new Color(rgb.x, rgb.y, rgb.z);
      if (this.P.debug) {
        console.log("[ImpactSplatter] setShotColor",
          rgb.x.toFixed(3), rgb.y.toFixed(3), rgb.z.toFixed(3));
      }
    } catch (e) {
      console.warn("[ImpactSplatter] setShotColor failed", e);
    }
  }

  // Pool / state
  private pool: Entity[] = [];
  private poolRoot: Entity | null = null; // where splats live when idle
  private cursor = 0;

  // Active ring-window + simple hit throttle
  private activeCount = 0;
  private lastHitAt = 0;

  // Per-frame follow (only when parenting fails; bounded to pool size)
  private followers: Array<{
    splat: Entity,
    target: Entity,
    localPos: Vec3,
    localRot: Quaternion | null,
    expiresAt: number,
    nextRetryAt: number,
    retryMs: number,
    retriesLeft: number,
    lastWorldPos: Vec3 | null,
    lastWorldRot: Quaternion | null,
    nextUpdateAt: number,
    lastRefreshAt: number
  }> = [];
  private followerCursor = 0;
  private trsBudgetRemaining = 0;

  // Keep track of event subscriptions so we can disconnect on stop/destroy
  private subs: Array<{ disconnect?: () => void } | null> = [];

  private cleanupSubscriptions() {
    try { this.subs.forEach(s => { try { s?.disconnect?.(); } catch {} }); } catch {}
    this.subs = [];
  }

  override start(): void {
    // Make start idempotent across hot-reloads: clear old listeners/state first
    this.cleanupSubscriptions();
    // Apply internal defaults since editor props are hidden
    this.applyDefaults();
    // Snapshot effective config to avoid TS/IDE errors on this.props.* access
    try { this._cfg = { ...(this.DEF as any), ...(this.props as any) }; } catch { this._cfg = this.DEF; }
    this.followers = [];
    this.activeCount = 0;
    const pool = this.resolvePoolsAndChildren();
    if (!pool) return;
    this.poolRoot = pool.root;
    const kids = pool.kids;
    if (kids.length === 0) console.log("[ImpactSplatter] Found no splat children under SplatPool*/SplatPool. Add splat entities under those.");

    this.pool = [];
    for (const k of kids) {
      this.detachToPool(k);
      this.hideSplat(k);
      this.pool.push(k);
    if (this.P.debug) this.logCaps(k);
    }
    if (this.P.debug) console.log(`[ImpactSplatter] Pool size: ${this.pool.length}`);

    this.activeCount = 0; // grow lazily up to cap

    // ENTITY hits → can stick
    this.subs.push(this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnProjectileHitEntity,
      (hit: Entity, pos: Vec3, normal: Vec3) => this.placeSplat(hit, pos, normal)) as any);

    // PLAYER hits → Player isn’t an Entity; we stamp in world space
    this.subs.push(this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnProjectileHitPlayer,
      (_player: any, pos: Vec3, normal: Vec3) => this.placeSplat(null, pos, normal)) as any);

    // Lightweight, bounded update for fallback followers
    this.subs.push(this.connectLocalBroadcastEvent(World.onUpdate, (_dt: any) => {
      if (!this.P.stickToMovingTarget || this.followers.length === 0) return;

      // Hard bound to pool size so work never grows
      if (this.followers.length > this.pool.length) {
        this.followers.length = this.pool.length;
      }

      // Drop expired followers (TTL); allow infinite follow when followerTTLms <= 0
      const now = Date.now();
      const ttlProp = Number(this.P.followerTTLms) || 0;
      const expireBy = ttlProp > 0;
      for (let i = this.followers.length - 1; i >= 0; i--) {
        const f = this.followers[i];
        if (!f || !f.splat || !f.target || (expireBy && f.expiresAt <= now)) {
          this.followers.splice(i, 1);
        }
      }

      // Reset per-frame TRS budget
      this.trsBudgetRemaining = Math.max(0, (this.P.maxTRSActionsPerFrame | 0));

      const total = this.followers.length;
      const perFrame = Math.max(1, (this.P.maxFollowerUpdatesPerFrame | 0));
      const steps = Math.min(total, perFrame);
      let processed = 0;
      for (let k = 0; k < steps; k++) {
        const i = (this.followerCursor + k) % total;
        const f = this.followers[i];
        if (!f || !f.splat || !f.target) { this.followers.splice(i, 1); continue; }
        if (f.nextUpdateAt && now < f.nextUpdateAt) { processed++; continue; }
        const world = this.localToWorld(f.target, f.localPos, f.localRot);

        // Decide if we need to update pos/rot based on epsilons
        const posEps = Math.max(1e-5, Number(this.P.posUpdateEpsilon) || 0.002);
        const rotEpsDeg = Math.max(0.1, Number(this.P.rotUpdateEpsilonDeg) || 1.5);
        let needPos = !f.lastWorldPos || this.vecDistSq(f.lastWorldPos, world.pos) > (posEps * posEps);
        let needRot = !f.lastWorldRot || this.rotAngleDeg(f.lastWorldRot, world.rot || this.qIdentity()) > rotEpsDeg;

        // Force a refresh periodically even for tiny deltas
        const forceIv = Math.max(50, (this.P.forceRefreshMs | 0));
        if (!needPos && !needRot && (now - (f.lastRefreshAt || 0) >= forceIv)) {
          needRot = true; // prioritize rotation refresh to avoid visible stalls
        }

        let cost = (needPos ? 1 : 0) + (needRot ? 1 : 0);
        if (cost === 0) {
          // No meaningful change; schedule next update
          f.nextUpdateAt = now + Math.max(10, (this.P.followerUpdateIntervalMs | 0));
        } else if (this.trsBudgetRemaining >= cost) {
          // Apply selectively
          this.applyWorldTRS(f.splat, needPos ? world.pos : null, needRot ? world.rot : null, null);
          this.trsBudgetRemaining -= cost;
          f.lastWorldPos = needPos ? world.pos : f.lastWorldPos;
          f.lastWorldRot = needRot ? (world.rot || f.lastWorldRot) : f.lastWorldRot;
          f.lastRefreshAt = now;
          // Stagger next update with small jitter
      const baseIv = Math.max(10, (this.P.followerUpdateIntervalMs | 0));
          f.nextUpdateAt = now + baseIv + Math.floor(Math.random() * 10);
        } else {
          // Out of budget; stop early
          break;
        }
        processed++;

        // Try to parent again on a cadence, to "nudge" attachment
        const now2 = Date.now();
        const infRetry = ((this.P.parentRetryMax | 0) < 0);
        if ((f.retriesLeft > 0 || infRetry) && now2 >= f.nextRetryAt) {
          const ok = this.trySetParent(f.splat, f.target);
          if (ok) {
            try { this.applyLocalTRS(f.splat, f.localPos, f.localRot, null); } catch {}
            this.followers.splice(i, 1);
          } else {
            if (!infRetry && f.retriesLeft > 0) { f.retriesLeft -= 1; }
            f.nextRetryAt = now2 + Math.max(10, f.retryMs | 0);
          }
        }
      }
      // Advance cursor by how many entries we actually visited to prevent starvation
      this.followerCursor = (this.followerCursor + processed) % Math.max(1, this.followers.length);
    }) as any);
  }

  // ----------------- main -----------------
  private placeSplat(hitTarget: Entity | null, hitPos: Vec3, hitNormal: Vec3) {
    if (this.pool.length === 0) { if (this.P.debug) console.log("[ImpactSplatter] No splats in pool"); return; }

    // Guard against self-hits (e.g., projectiles reporting hits on our own splat pool items)
    if (this.P.ignoreSelfHits && hitTarget) {
      if (this.isPoolEntity(hitTarget) || this.isDescendantOfAny(hitTarget, this.pool)) {
        if (this.P.debug) console.log("[ImpactSplatter] Ignored self-hit on pooled splat");
        return;
      }
    }

    // Tiny throttle to ignore duplicate physics hits in the same frame
    const now = Date.now();
    if (now - this.lastHitAt < (this.P.impactRateLimitMs | 0)) return;
    this.lastHitAt = now;

    // Dedupe same-target, same-spot hits within short window
    if (this.isDuplicateHit(hitTarget, hitPos, now)) {
      if (this.P.debug) console.log("[ImpactSplatter] Deduped repeated hit");
      return;
    }

    // Grow active window up to caps
    if (this.activeCount < Math.min(this.pool.length, Math.max(1, this.P.maxActiveSplats | 0))) {
      this.activeCount++;
    }

    // Reuse only within the active window (prevents “first few stick then stop”)
    const idx = this.cursor % this.activeCount;
    this.cursor++;
    const e = this.pool[idx] as any;

    // Clean previous state before reuse
    this.removeFollowerForSplat(e);
    this.detachToPool(e); // ensure clean parent for reuse

    // Surface align
    const n = this.normalize(hitNormal ?? new Vec3(0,0,1));
    const posWS = hitPos.add(n.mul(this.P.surfaceOffset));
    const scl = new Vec3(this.P.splatScale, this.P.splatScale, this.P.splatScale);

    let rotWS: Quaternion | null = null;
    try { rotWS = Quaternion.lookRotation(n); } catch {
      const yaw = Math.atan2(n.x, n.z) * 180/Math.PI;
      const pitch = Math.atan2(-n.y, Math.sqrt(n.x*n.x + n.z*n.z)) * 180/Math.PI;
      try { rotWS = (Quaternion as any).fromEulerDegrees?.(pitch, yaw, 0) ?? null; } catch {}
    }

    // Stick to target if possible/requested
    let madeFollower = false;
    let handledStickCase = false;
    if (this.P.stickToMovingTarget && hitTarget) {
      const local = this.worldToLocal(hitTarget, posWS, rotWS);
      // Defer parenting to next frame to avoid re-entrant physics/hierarchy mutations
      // Apply world TRS immediately so the splat appears this frame
      this.applyWorldTRS(e, posWS, rotWS, scl);
      this.onceNextFrame(() => {
        const ok = this.trySetParent(e, hitTarget);
        if (ok) {
          try { this.applyLocalTRS(e, local.pos, local.rot, scl); } catch {}
        } else {
          // Parent failed -> ensure follower fallback exists (bounded)
          const now3 = Date.now();
          const propTTL = Number(this.P.followerTTLms) || 0;
          const ttl = propTTL <= 0 ? Number.MAX_SAFE_INTEGER : Math.max(250, (propTTL | 0));
          const rMs = Math.max(20, (this.P.parentRetryMs | 0));
          const rMax = (this.P.parentRetryMax | 0);
          const effRetries = rMax < 0 ? 1_000_000_000 : Math.max(0, rMax);
          // Per-target cap
          if (this.countFollowersForTarget(hitTarget) < Math.max(1, (this.P.maxFollowersPerTarget | 0))) {
            this.followers.push({
              splat: e,
              target: hitTarget,
              localPos: local.pos,
              localRot: local.rot,
              expiresAt: now3 + Math.max(ttl, rMs * Math.min(effRetries, 1000) + 250),
              nextRetryAt: now3 + rMs,
              retryMs: rMs,
              retriesLeft: effRetries,
              lastWorldPos: posWS,
              lastWorldRot: rotWS,
              nextUpdateAt: now3 + Math.floor(Math.random() * Math.max(10, (this.P.followerUpdateIntervalMs | 0))),
              lastRefreshAt: now3,
            });
          }
          if (this.followers.length > this.pool.length) {
            this.followers.splice(0, this.followers.length - this.pool.length);
          }
        }
      });
      madeFollower = true;
      handledStickCase = true;
    }
    if (!handledStickCase && this.P.stickToMovingTarget && hitTarget) {
      const local = this.worldToLocal(hitTarget, posWS, rotWS);
      const parented = this.trySetParent(e, hitTarget);
      if (parented) {
        // Parenting succeeded → local TRS, no follower needed
        this.applyLocalTRS(e, local.pos, local.rot, scl);
      } else {
        // Parent failed → world TRS + bounded follower
        this.applyWorldTRS(e, posWS, rotWS, scl);
        const rMs = Math.max(20, (this.P.parentRetryMs | 0));
        const rMax = (this.P.parentRetryMax | 0);
        const effRetries = rMax < 0 ? 1_000_000_000 : Math.max(0, rMax);
        const propTTL2 = Number(this.P.followerTTLms) || 0;
        const ttl2 = propTTL2 <= 0 ? Number.MAX_SAFE_INTEGER : Math.max(250, (propTTL2 | 0));
        if (this.countFollowersForTarget(hitTarget) < Math.max(1, (this.P.maxFollowersPerTarget | 0))) {
          this.followers.push({
          splat: e,
          target: hitTarget,
          localPos: local.pos,
          localRot: local.rot,
          expiresAt: now + Math.max(ttl2, rMs * Math.min(effRetries, 1000) + 250),
          nextRetryAt: now + rMs,
          retryMs: rMs,
          retriesLeft: effRetries,
          lastWorldPos: posWS,
          lastWorldRot: rotWS,
          nextUpdateAt: now + Math.floor(Math.random() * Math.max(10, (this.P.followerUpdateIntervalMs | 0))),
          lastRefreshAt: now,
        });
        }
        madeFollower = true;

        // Bound followers to pool size (safety)
        if (this.followers.length > this.pool.length) {
          this.followers.splice(0, this.followers.length - this.pool.length);
        }
      }
    } else {
      // World-space only (e.g., player hits)
      this.applyWorldTRS(e, posWS, rotWS, scl);
    }

    // Tint (single, shallow pass – no reapply frames)
    if (this.currentShotColor) {
      if (this.P.enableDeepTint) { try { this.tintModelDeep(e as Entity, this.currentShotColor, /*maxDepth*/ 2); } catch {} } else { try { (e as any)?.color?.set?.(this.currentShotColor); } catch {} }
    }

    // Notify hit target for gameplay (optional)
    if (hitTarget) {
      if (this.P.emitImpactEvent) {
        try {
          const evtName = String(this.P.impactEventName || 'OnGunImpact');
          const evt = new NetworkEvent<any>(evtName);
          const owner = (this.entity as any)?.owner?.get?.() ?? null;
          const payload: any = {
            pos: posWS,
            normal: n,
            color: this.currentShotColor,
            gunEntityId: (this.entity as any)?.id ?? null,
            shooterId: owner ? ((owner as any)?.id ?? null) : null,
          };
          this.sendNetworkEvent(hitTarget, evt, payload);
        } catch {}
      }
      if (this.P.callOnShotMethod) {
        try { (hitTarget as any)?.onShot?.({ pos: posWS, normal: n, color: this.currentShotColor, gun: this.entity }); } catch {}
      }
    }

    if (this.P.debug) {
      const tgt = hitTarget ? this.safeName(hitTarget) : "(world)";
      let name = ""; try { name = ((e as any).name?.get?.() ?? (e as any).name ?? "") as string; } catch {}
      console.log(`[ImpactSplatter] [${idx}] placed stick=${!!hitTarget && this.P.stickToMovingTarget} follower=${madeFollower} on ${tgt} as ${name || "(unnamed)"}`);
    }
  }

  private hideSplat(e: Entity) {
    try { e.scale.set(new Vec3(0.001, 0.001, 0.001)); } catch {}
  }

  // ----------------- follower/parenting lifecycle -----------------
  private removeFollowerForSplat(splat: Entity) {
    for (let i = this.followers.length - 1; i >= 0; i--) {
      if (this.followers[i].splat === splat) this.followers.splice(i, 1);
    }
  }

  private detachToPool(e: Entity) {
    // Reparent the splat back to pool root (if available) so it's "free"
    try {
      const p = (e as any).parent;
      if (this.poolRoot && p && typeof p.set === "function") p.set(this.poolRoot);
    } catch {}
  }

  private trySetParent(child: Entity, newParent: Entity): boolean {
    try {
      const p = (child as any).parent;
      if (p && typeof p.set === "function") { p.set(newParent); return true; }
    } catch {}
    return false;
  }

  // Try both local & world fields so it works across builds
  private applyWorldTRS(e: Entity, pos: Vec3 | null, rot: Quaternion | null, scl: Vec3 | null) {
    try {
      if (rot) {
        if ((e as any).worldRotation?.set) (e as any).worldRotation.set(rot);
        else if ((e as any).rotation?.set) (e as any).rotation.set(rot);
      }
    } catch {}
    try {
      if (pos) {
        if ((e as any).worldPosition?.set) (e as any).worldPosition.set(pos);
        else if ((e as any).position?.set) (e as any).position.set(pos);
      }
    } catch {}
    try { if (scl) (e as any).scale?.set?.(scl); } catch {}
  }

  private applyLocalTRS(e: Entity, posL: Vec3, rotL: Quaternion | null, scl: Vec3 | null) {
    try {
      if (rotL) {
        if ((e as any).localRotation?.set) (e as any).localRotation.set(rotL);
        else if ((e as any).rotation?.set) (e as any).rotation.set(rotL);
      }
    } catch {}
    try {
      if ((e as any).localPosition?.set) (e as any).localPosition.set(posL);
      else if ((e as any).position?.set) (e as any).position.set(posL);
    } catch {}
    try { if (scl) (e as any).scale?.set?.(scl); } catch {}
  }

  // World <-> Local (ignores non-uniform scale; fine for decals/planes)
  private worldToLocal(target: Entity, worldPos: Vec3, worldRot: Quaternion | null): { pos: Vec3, rot: Quaternion | null } {
    const tPos = this.getWorldPos(target) ?? new Vec3(0,0,0);
    const tRot = this.getWorldRot(target) ?? this.qIdentity();

    const delta = new Vec3(worldPos.x - tPos.x, worldPos.y - tPos.y, worldPos.z - tPos.z);
    const inv = this.inverseRot(tRot);
    const pL = this.rotateVec(inv, delta);
    const rL = (worldRot && inv) ? this.mulRot(inv, worldRot) : worldRot;
    return { pos: pL, rot: rL };
  }

  private localToWorld(target: Entity, localPos: Vec3, localRot: Quaternion | null): { pos: Vec3, rot: Quaternion | null } {
    const tPos = this.getWorldPos(target) ?? new Vec3(0,0,0);
    const tRot = this.getWorldRot(target) ?? this.qIdentity();

    const pW = this.rotateVec(tRot, localPos);
    const pos = new Vec3(tPos.x + pW.x, tPos.y + pW.y, tPos.z + pW.z);
    const rot = (localRot && tRot) ? this.mulRot(tRot, localRot) : localRot;
    return { pos, rot };
  }

  private vecDistSq(a: Vec3, b: Vec3): number {
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return dx*dx + dy*dy + dz*dz;
  }

  private rotAngleDeg(a: Quaternion, b: Quaternion): number {
    try {
      const ax=(a as any).x, ay=(a as any).y, az=(a as any).z, aw=(a as any).w;
      const bx=(b as any).x, by=(b as any).y, bz=(b as any).z, bw=(b as any).w;
      const dot = Math.max(-1, Math.min(1, ax*bx + ay*by + az*bz + aw*bw));
      return Math.acos(Math.abs(dot)) * 2 * 180/Math.PI;
    } catch { return 180; }
  }

  private getWorldPos(e: Entity): Vec3 | null {
    try { return ((e as any).worldPosition?.get?.() ?? (e as any).position?.get?.() ?? null) as Vec3 | null; } catch { return null; }
  }
  private getWorldRot(e: Entity): Quaternion | null {
    try { return ((e as any).worldRotation?.get?.() ?? (e as any).rotation?.get?.() ?? null) as Quaternion | null; } catch { return null; }
  }

  private qIdentity(): Quaternion {
    try { return (Quaternion as any).fromEulerDegrees?.(0,0,0) as Quaternion; } catch {}
    try { return new (Quaternion as any)(0,0,0,1) as Quaternion; } catch {}
    return (null as unknown) as Quaternion;
  }

  // Minimal quaternion helpers
  private mulRot(a: Quaternion, b: Quaternion): Quaternion {
    try { if ((Quaternion as any).multiply) return (Quaternion as any).multiply(a, b); } catch {}
    try {
      const ax=(a as any).x, ay=(a as any).y, az=(a as any).z, aw=(a as any).w;
      const bx=(b as any).x, by=(b as any).y, bz=(b as any).z, bw=(b as any).w;
      return new (Quaternion as any)(
        aw*bx + ax*bw + ay*bz - az*by,
        aw*by - ax*bz + ay*bw + az*bx,
        aw*bz + ax*by - ay*bx + az*bw,
        aw*bw - ax*bx - ay*by - az*bz
      );
    } catch {}
    return b;
  }

  private inverseRot(q: Quaternion): Quaternion {
    try { if ((q as any).inverse) return (q as any).inverse(); } catch {}
    try {
      const x=(q as any).x, y=(q as any).y, z=(q as any).z, w=(q as any).w;
      const norm = x*x + y*y + z*z + w*w || 1;
      return new (Quaternion as any)(-x/norm, -y/norm, -z/norm, w/norm);
    } catch {}
    return q;
  }

  private rotateVec(q: Quaternion, v: Vec3): Vec3 {
    // v' = q * (v,0) * q^-1
    try {
      const x=(q as any).x, y=(q as any).y, z=(q as any).z, w=(q as any).w;
      const ix =  w*v.x + y*v.z - z*v.y;
      const iy =  w*v.y + z*v.x - x*v.z;
      const iz =  w*v.z + x*v.y - y*v.x;
      const iw = -x*v.x - y*v.y - z*v.z;

      const rx = ix*w + iw*-x + iy*-z - iz*-y;
      const ry = iy*w + iw*-y + iz*-x - ix*-z;
      const rz = iz*w + iw*-z + ix*-y - iy*-x;
      return new Vec3(rx, ry, rz);
    } catch { return v; }
  }

  // ----------------- utilities & tint helpers -----------------
  private getChildrenSafe(e: Entity): Entity[] {
    try { const a = (e as any)?.children; if (a?.get) { const arr = a.get(); if (Array.isArray(arr)) return arr.filter(Boolean); } } catch {}
    try { const b = (e as any)?.getChildren?.(); if (Array.isArray(b)) return b.filter(Boolean); } catch {}
    return [];
  }

  private getParentSafe(e: Entity): Entity | null {
    try { return ((e as any).parent?.get?.() ?? null) as Entity | null; } catch { return null; }
  }

  private findAssetRoot(from: Entity): Entity | null {
    let cur: Entity | null = from, last: Entity | null = null, guard = 0;
    while (cur && guard++ < 128) { last = cur; cur = this.getParentSafe(cur); }
    return last;
  }

  private resolvePoolsAndChildren(): { root: Entity, kids: Entity[] } | null {
    // If explicitly assigned, use that parent
    const manual = this.P.poolParent as Entity | null;
    if (manual) {
      const ks = this.getChildrenSafe(manual);
      return { root: manual, kids: ks };
    }

    // Prefer the NEAREST ancestor that contains one or more SplatPool*/SplatPool children.
    const chain: Entity[] = [];
    { // build ancestor chain from this.entity up to root (closest first)
      let cur: Entity | null = this.entity; let guard = 0;
      while (cur && guard++ < 256) { chain.push(cur); cur = this.getParentSafe(cur); }
    }
    const hostIdx = this.extractIndexFromName(this.entity);
    for (const anc of chain) {
      // 1) Exact index match: SplatPool{N} based on this entity's numeric suffix
      if (hostIdx !== null) {
        const exactName = `SplatPool${hostIdx}`;
        const exact = this.findChildByName(anc, exactName);
        if (exact) {
          if (this.P.debug) console.log(`[ImpactSplatter] Auto-wired exact pool '${exactName}' under`, this.safeName(anc));
          return { root: exact, kids: this.getChildrenSafe(exact) };
        }
      }
      const pools = this.findChildrenByPattern(anc, /^(splatpool)(\d+)?$/i);
      if (pools.length > 0) {
        let kids: Entity[] = [];
        for (const p of pools) kids.push(...this.getChildrenSafe(p));
        // Safety: exclude any ancestors of the gun/launcher from the pool children set
        const before = kids.length;
        kids = kids.filter((k) => !this.isDescendantOf(this.entity, k));
        if (this.P.debug && before !== kids.length) {
          console.warn(`[ImpactSplatter] Filtered ${before - kids.length} non-splat item(s) from nearest pools (ancestors of gun).`);
        }
        try { (this as any).poolParent = anc; } catch {}
        if (this.P.debug) console.log(`[ImpactSplatter] Auto-wired nearest ${pools.length} pool(s) under`, this.safeName(anc));
        return { root: anc, kids };
      }
      const single = this.findChildByName(anc, 'SplatPool');
      if (single) {
        try { (this as any).poolParent = single; } catch {}
        if (this.P.debug) console.log(`[ImpactSplatter] Auto-wired nearest poolParent =`, this.safeName(single));
        return { root: single, kids: this.getChildrenSafe(single) };
      }
    }

    // Last resort: look under the asset root (broadest scope)
    const assetRoot = this.findAssetRoot(this.entity) ?? this.entity;
    const pools = this.findChildrenByPattern(assetRoot, /^(splatpool)(\d+)?$/i);
    if (pools.length > 0) {
      let kids: Entity[] = [];
      for (const p of pools) kids.push(...this.getChildrenSafe(p));
      // Safety: never treat ancestors of the gun/launcher as splat items.
      // If a container accidentally includes the gun root, exclude it so we don't move the gun.
      const before = kids.length;
      kids = kids.filter((k) => !this.isDescendantOf(this.entity, k));
      if (this.P.debug && before !== kids.length) {
        console.warn(`[ImpactSplatter] Filtered ${before - kids.length} non-splat item(s) from pool (ancestors of gun).`);
      }
      if (this.P.debug) console.log(`[ImpactSplatter] Auto-wired (asset-root) ${pools.length} pool(s).`);
      return { root: assetRoot, kids };
    }
    const parent = this.findChildByName(assetRoot, 'SplatPool');
    if (parent) {
      let kids = this.getChildrenSafe(parent);
      // Safety: exclude any ancestors of the gun/launcher from the pool children set
      const before = kids.length;
      kids = kids.filter((k) => !this.isDescendantOf(this.entity, k));
      if (this.P.debug && before !== kids.length) {
        console.warn(`[ImpactSplatter] Filtered ${before - kids.length} non-splat item(s) from single pool (ancestors of gun).`);
      }
      if (this.P.debug) console.log("[ImpactSplatter] Auto-wired (asset-root) poolParent =", this.safeName(parent));
      return { root: parent, kids };
    }

    console.warn("[ImpactSplatter] No 'SplatPool' or 'SplatPool*' found under entity hierarchy. Wire poolParent manually.");
    return null;
  }

  private findChildByName(root: Entity, name: string): Entity | null {
    const target = name.trim().toLowerCase();
    const stack: Entity[] = [root];
    let guard = 0;
    while (stack.length && guard++ < 2048) {
      const n = stack.pop()!;
      try {
        const nm = (n as any).name?.get?.() ?? (n as any).name ?? "";
        if (typeof nm === "string" && nm.trim().toLowerCase() === target) return n;
      } catch {}
      this.getChildrenSafe(n).forEach(c => stack.push(c));
    }
    return null;
  }

  private findChildrenByPattern(root: Entity, pattern: RegExp): Entity[] {
    const out: Entity[] = [];
    const stack: Entity[] = [root];
    let guard = 0;
    while (stack.length && guard++ < 4096) {
      const n = stack.pop()!;
      try {
        const nm = (n as any).name?.get?.() ?? (n as any).name ?? "";
        if (typeof nm === "string" && pattern.test(nm.trim())) out.push(n);
      } catch {}
      this.getChildrenSafe(n).forEach(c => stack.push(c));
    }
    return out;
  }

  private extractIndexFromName(e: Entity): number | null {
    // Try this entity's name, then walk up until a number is found
    const tryGet = (x: Entity | null): number | null => {
      if (!x) return null;
      try {
        const nm = ((x as any).name?.get?.() ?? (x as any).name ?? '').toString().trim();
        const m = nm.match(/(\d{1,3})$/);
        if (m) return parseInt(m[1], 10);
      } catch {}
      return null;
    };
    let cur: Entity | null = e;
    let guard = 0;
    while (cur && guard++ < 8) {
      const idx = tryGet(cur);
      if (idx !== null && isFinite(idx)) return idx;
      cur = this.getParentSafe(cur);
    }
    return null;
  }

  private isPoolEntity(e: Entity): boolean {
    try { return this.pool.indexOf(e) !== -1; } catch { return false; }
  }

  private isDescendantOf(node: Entity | null, maybeAncestor: Entity | null): boolean {
    if (!node || !maybeAncestor) return false;
    let cur: Entity | null = node;
    let guard = 0;
    while (cur && guard++ < 256) {
      if (cur === maybeAncestor) return true;
      cur = this.getParentSafe(cur);
    }
    return false;
  }

  private countFollowersForTarget(target: Entity): number {
    let n = 0;
    for (const f of this.followers) { try { if (f && f.target === target) n++; } catch {} }
    return n;
  }

  private isDescendantOfAny(node: Entity | null, ancestors: Entity[]): boolean {
    if (!node || !ancestors || !ancestors.length) return false;
    let cur: Entity | null = node;
    let guard = 0;
    while (cur && guard++ < 256) {
      if (ancestors.indexOf(cur) !== -1) return true;
      cur = this.getParentSafe(cur);
    }
    return false;
  }

  // -------------- hit dedupe --------------
  private lastHits: Array<{ id: string, px: number, py: number, pz: number, t: number }> = [];

  private isDuplicateHit(target: Entity | null, pos: Vec3, now: number): boolean {
    const eps = Math.max(1e-4, Number(this.P.dedupPosEpsilon) || 0.01);
    const win = Math.max(0, Number(this.P.hitDedupMs) || 0);
    const id = target ? this.getEntityId(target) : 'world';

    // quantize position to eps grid
    const qx = Math.round(pos.x / eps) * eps;
    const qy = Math.round(pos.y / eps) * eps;
    const qz = Math.round(pos.z / eps) * eps;

    // purge old
    for (let i = this.lastHits.length - 1; i >= 0; i--) {
      if (now - this.lastHits[i].t > win) this.lastHits.splice(i, 1);
    }

    // check
    for (const h of this.lastHits) {
      if (h.id === id && h.px === qx && h.py === qy && h.pz === qz) return true;
    }

    // record
    this.lastHits.push({ id, px: qx, py: qy, pz: qz, t: now });
    if (this.lastHits.length > 64) this.lastHits.splice(0, this.lastHits.length - 64);
    return false;
  }

  private getEntityId(e: Entity): string {
    try { return String((e as any).id ?? (e as any).guid ?? (e as any)._id ?? '0'); } catch { return '0'; }
  }

  private safeName(e: Entity): string {
    try { return ((e as any).name?.get?.() ?? (e as any).name ?? "(unnamed)") as string; } catch { return "(unnamed)"; }
  }

  private normalize(v: Vec3): Vec3 {
    const m2 = v.x*v.x + v.y*v.y + v.z*v.z;
    if (m2 > 1e-8) { const inv = 1/Math.sqrt(m2); return new Vec3(v.x*inv, v.y*inv, v.z*inv); }
    return new Vec3(0,0,1);
  }

  private onceNextFrame(fn: () => void) {
    try {
      const world: any = (this as any).world;
      const onUpdate = world?.onUpdate ?? World.onUpdate;
      if (!onUpdate) return;
      const sub = this.connectLocalBroadcastEvent(onUpdate, (_dt: any) => {
        try { fn(); } finally { try { sub.disconnect?.(); } catch {} }
      });
    } catch {}
  }

  private logCaps(e: Entity) {
    const has = (p: any, k: string) => { try { return !!p && (k in p); } catch { return false; } };
    let name = ""; try { name = ((e as any).name?.get?.() ?? (e as any).name ?? "") as string; } catch {}
    console.log(`[ImpactSplatter] pool item caps ${name ? `"${name}" ` : ""}`, {
      worldRot_set: has((e as any).worldRotation, "set"),
      rot_set:      has((e as any).rotation, "set"),
      worldPos_set: has((e as any).worldPosition, "set"),
      pos_set:      has((e as any).position, "set"),
      localRot_set: has((e as any).localRotation, "set"),
      localPos_set: has((e as any).localPosition, "set"),
      color:        has(e as any, "color"),
    });
  }

  private setColorSlot(slot: any, c: Color): boolean {
    if (!slot) return false;
    try { if (typeof slot.set === "function") { slot.set(c); return true; } } catch {}
    try {
      if (slot && typeof slot === "object" && "r" in slot && "g" in slot && "b" in slot) {
        const a = ("a" in slot && typeof slot.a === "number") ? slot.a : undefined;
        (slot as any).r = c.r; (slot as any).g = c.g; (slot as any).b = c.b; if (a !== undefined) (slot as any).a = a; return true;
      }
    } catch {}
    return false;
  }

  private setBoolSlot(slot: any, v: boolean): boolean {
    try { if (slot && typeof (slot as any).set === "function") { (slot as any).set(v); return true; } } catch {}
    try { if (typeof slot === "boolean") { (slot as any) = v; return true; } } catch {}
    return false;
  }

  private setNumberSlot(slot: any, v: number): boolean {
    try { if (slot && typeof (slot as any).set === "function") { (slot as any).set(v); return true; } } catch {}
    try { if (typeof slot === "number") { (slot as any) = v; return true; } } catch {}
    return false;
  }

  private tryTintOnMaterialLike(mat: any, c: Color, label: string): string[] {
    const logs: string[] = [];
    if (!mat) return logs;

    const gatesAlways = ["useTint", "enableTint"];
    const gatesVC = ["useVertexColor", "useVertexColors", "enableVertexColors"];
    for (const g of gatesAlways) { try { if (this.setBoolSlot((mat as any)[g], true)) logs.push(`${label}.${g}=true`); } catch {} }
    if (this.P.forceVertexColors) {
      for (const g of gatesVC) { try { if (this.setBoolSlot((mat as any)[g], true)) logs.push(`${label}.${g}=true`); } catch {} }
    }

    const colorKeys = ["baseColor", "albedoColor", "baseColorFactor", "baseColorTint", "tintColor", "tint", "color"];
    for (const k of colorKeys) { try { if (this.setColorSlot((mat as any)[k], c)) logs.push(`${label}.${k}.set`); } catch {} }

    // Emissive tint and intensity
    if (this.P.enableEmissiveTint) {
      const emisKeys = ["emissiveColor", "emissionColor", "emissive", "emission", "emissiveTint"];
      for (const k of emisKeys) { try { if (this.setColorSlot((mat as any)[k], c)) logs.push(`${label}.${k}.set`); } catch {} }
      const intensityKeys = ["emissiveIntensity", "emissionIntensity", "emissionStrength", "emissiveStrength", "intensity"];
      for (const k of intensityKeys) { try { if (this.setNumberSlot((mat as any)[k], Math.max(0, Number(this.P.emissiveBoost) || 0))) logs.push(`${label}.${k}=${this.P.emissiveBoost}`); } catch {} }
      const enableKeys = ["useEmissive", "enableEmissive", "emissiveEnabled", "emissionEnabled"];
      for (const k of enableKeys) { try { if (this.setBoolSlot((mat as any)[k], true)) logs.push(`${label}.${k}=true`); } catch {} }
    }

    const altBags = ["parameters", "props", "values", "uniforms"];
    for (const bag of altBags) {
      try {
        const obj = (mat as any)[bag];
        if (obj && typeof obj === "object") {
          for (const k of Object.keys(obj)) {
            if (/tint|color|albedo|base/i.test(k)) {
              try { if (this.setColorSlot((obj as any)[k], c)) logs.push(`${label}.${bag}.${k}.set`); } catch {}
            }
            if (this.P.enableEmissiveTint && /emiss/i.test(k)) {
              try {
                if (/intensity|strength/i.test(k)) {
                  if (this.setNumberSlot((obj as any)[k], Math.max(0, Number(this.P.emissiveBoost) || 0))) logs.push(`${label}.${bag}.${k}=${this.P.emissiveBoost}`);
                } else {
                  if (this.setColorSlot((obj as any)[k], c)) logs.push(`${label}.${bag}.${k}.set`);
                }
              } catch {}
            }
          }
        }
      } catch {}
    }
    return logs;
  }

  private tryTintOnComponent(comp: any, c: Color): string[] {
    const out: string[] = [];
    const cname = comp?.constructor?.name || "Component";

    const directKeys = ["tintColor", "tint", "color", "albedoColor", "baseColor", "diffuseColor"];
    for (const k of directKeys) { try { if (this.setColorSlot((comp as any)[k], c)) out.push(`component(${cname}).${k}.set`); } catch {} }

    try { if ((comp as any).material) out.push(...this.tryTintOnMaterialLike((comp as any).material, c, `component(${cname}).material`)); } catch {}
    try {
      const mats = (comp as any).materials ?? (comp as any).materials?.get?.();
      if (Array.isArray(mats)) mats.forEach((m: any, i: number) => {
        out.push(...this.tryTintOnMaterialLike(m, c, `component(${cname}).materials[${i}]`));
      });
    } catch {}

    return out;
  }

  private tintModelDeep(root: Entity, c: Color, maxDepth = 2): string[] {
    const seen: string[] = [];
    const visit = (node: Entity | any, depth: number) => {
      if (!node || depth > maxDepth) return;

      const comps = this.getChildrenComponents(node as Entity);
      comps.forEach(comp => {
        const hits = this.tryTintOnComponent(comp, c);
        if (hits.length) hits.forEach(h => seen.push(h));
      });

      const nodeHits = this.tryTintOnComponent(node, c);
      if (nodeHits.length) nodeHits.forEach(h => seen.push(h));

      const kids = this.getChildrenSafe(node as Entity);
      kids.forEach(k => visit(k, depth + 1));
    };
    visit(root, 0);
    return seen;
  }

  // ---- splat color shaping (HSV + gamma) ----
  private styleSplatColor(src: Color): Color {
    const sat = isFinite(this.P.splatSaturation as any) ? Math.max(0, Number(this.P.splatSaturation)) : 1;
    const bri = isFinite(this.P.splatBrightness as any) ? Math.max(0, Number(this.P.splatBrightness)) : 1;
    const gma = isFinite(this.P.splatGamma as any) ? Math.max(0.2, Number(this.P.splatGamma)) : 1;
    const hsv = this.rgb2hsvSafe(src.r, src.g, src.b);
    hsv.s = Math.max(0, Math.min(1, hsv.s * sat));
    hsv.v = Math.max(0, Math.min(1, hsv.v * bri));
    const rgb = this.hsv2rgbSafe(hsv.h, hsv.s, hsv.v);
    const r = Math.pow(rgb.r, 1 / gma);
    const gg = Math.pow(rgb.g, 1 / gma);
    const b = Math.pow(rgb.b, 1 / gma);
    return new Color(r, gg, b);
  }

  private rgb2hsvSafe(r: number, g: number, b: number) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h /= 6;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return { h, s, v };
  }

  private hsv2rgbSafe(h: number, s: number, v: number) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r = 0, g = 0, b = 0;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return { r, g, b };
  }

  private getChildrenComponents(e: Entity): any[] {
    try {
      const list = (e as any)?.getComponents?.();
      if (Array.isArray(list)) return list.filter(Boolean);
    } catch {}
    return [];
  }
}

Component.register(ImpactSplatter);
export class ImpactSplatter_MVP extends ImpactSplatter {}
Component.register(ImpactSplatter_MVP);
