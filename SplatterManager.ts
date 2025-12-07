// splattermanager.ts

import { Component, PropTypes, Entity } from 'horizon/core';

// Centralizes ImpactSplatter tuning so you edit once per gun/asset.
// Finds all ImpactSplatter components under a scope and pushes these values into them.
export class SplatterManager extends Component<typeof SplatterManager> {
  // Hide props; use your tuned defaults internally
  static propsDefinition = {} as any;
  private readonly DEF = {
    splatScale: 0.4,
    surfaceOffset: 0.008,
    stickToMovingTarget: true,
    ignoreSelfHits: true,
    hitDedupMs: 40,
    dedupPosEpsilon: 0.01,
    maxFollowerUpdatesPerFrame: 16,
    followerTTLms: 0,
    parentRetryMs: 80,
    parentRetryMax: -1,
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

  override start() {
    this.applyToAll();
  }

  public applyToAll() {
    const root = this.entity;
    const splatters = this.findImpactSplattersUnder(root);
    for (const sp of splatters) this.applyToOne(sp as any);
    try { if ((this as any).DEF?.debug) console.log(`[SplatterManager] Applied to ${splatters.length} splatter(s).`); } catch {}
  }

  private applyToOne(comp: any) {
    const P = (comp?.props ?? comp) as any;
    const S = (this.DEF as any);
    const keys: Array<[string, 'number'|'boolean'|'string']> = [
      ['splatScale','number'], ['surfaceOffset','number'], ['stickToMovingTarget','boolean'],
      ['ignoreSelfHits','boolean'], ['hitDedupMs','number'], ['dedupPosEpsilon','number'],
      ['maxFollowerUpdatesPerFrame','number'], ['followerTTLms','number'], ['parentRetryMs','number'],
      ['parentRetryMax','number'], ['maxTRSActionsPerFrame','number'], ['followerUpdateIntervalMs','number'],
      ['posUpdateEpsilon','number'], ['rotUpdateEpsilonDeg','number'], ['maxFollowersPerTarget','number'],
      ['forceRefreshMs','number'], ['maxActiveSplats','number'], ['impactRateLimitMs','number'],
      ['enableDeepTint','boolean'], ['splatSaturation','number'], ['splatBrightness','number'],
      ['splatGamma','number'], ['forceVertexColors','boolean'], ['enableEmissiveTint','boolean'],
      ['emissiveBoost','number'], ['emitImpactEvent','boolean'], ['impactEventName','string'],
      ['callOnShotMethod','boolean'], ['debug','boolean']
    ];
    for (const [k, kind] of keys) {
      try {
        const v = S[k];
        if (kind === 'number' && typeof v === 'number') {
          if (P && typeof P[k] !== 'undefined') P[k] = v;
          else comp[k] = v;
        } else if (kind === 'boolean' && typeof v === 'boolean') {
          if (P && typeof P[k] !== 'undefined') P[k] = v;
          else comp[k] = v;
        } else if (kind === 'string' && typeof v === 'string') {
          if (P && typeof P[k] !== 'undefined') P[k] = v;
          else comp[k] = v;
        }
      } catch {}
    }
    // Ask splatter to refresh its runtime config if it supports it
    try { (comp as any).refreshConfig?.(); } catch {}
  }

  private findImpactSplattersUnder(root: Entity): any[] {
    const out: any[] = [];
    const stack: Entity[] = [root];
    let guard = 0;
    while (stack.length && guard++ < 4096) {
      const n = stack.pop()!;
      try {
        const comps = (n as any)?.getComponents?.();
        if (Array.isArray(comps)) {
          for (const c of comps) {
            const name = (c?.constructor?.name || '').toString();
            if (name === 'ImpactSplatter' || name === 'ImpactSplatter_MVP') out.push(c);
          }
        }
      } catch {}
      try {
        const kids = ((n as any).children?.get?.() ?? []) as Entity[];
        if (Array.isArray(kids)) kids.forEach(k => k && stack.push(k));
      } catch {}
    }
    return out;
  }
}

Component.register(SplatterManager);
