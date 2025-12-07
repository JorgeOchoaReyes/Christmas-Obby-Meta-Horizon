import { Component, PropTypes, Player, CodeBlockEvents, Vec3 } from 'horizon/core';

export class Snowball extends Component<typeof Snowball> {
  static propsDefinition = {
    // The strength of the pushback force applied to the player on hit.
    pushbackForce: { type: PropTypes.Number, default: 5 },
  };

  override preStart() {
    // Listen for the event when this projectile hits a player.
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnProjectileHitPlayer,
      (playerHit: Player, position: Vec3, normal: Vec3) => this.onHitPlayer(playerHit, normal)
    );
  }

  override start() {
    // The projectile's logic is entirely event-driven after being launched.
  }

  private onHitPlayer(player: Player, hitNormal: Vec3) {
    // Calculate the pushback direction from the impact normal.
    // We use the negative normal to push the player away from the snowball's impact point.
    const pushDirection = hitNormal.mul(-1);

    // Apply the force to the player who was hit.
    player.applyForce(pushDirection.mul(this.props.pushbackForce));

    // Destroy the snowball after it hits a player.
    this.world.deleteAsset(this.entity);
  }
}

Component.register(Snowball);