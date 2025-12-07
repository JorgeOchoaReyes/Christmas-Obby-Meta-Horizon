import { Component, Player, CodeBlockEvents } from 'horizon/core';

class IceSkating extends Component<typeof IceSkating> {
  static propsDefinition = {
    iceSkatingSpeed: { type: 'number', default: 100 },
  };

  private playersInTrigger = new Set<number>();

  private iceSkatingSpeed: number = 0;

  override preStart() { 
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterTrigger,
      (player: Player) => this.onPlayerEnter(player)
    );
 
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitTrigger,
      (player: Player) => this.onPlayerExit(player)
    );
 
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitWorld,
      (player: Player) => this.onPlayerExit(player)
    );
  }

  override start() { 
    this.iceSkatingSpeed = this.props.iceSkatingSpeed;
  }

  private onPlayerEnter(player: Player) {
    if (!this.playersInTrigger.has(player.id)) {
      this.playersInTrigger.add(player.id);
      this.setSkatingPhysics(player);
    }
  }

  private onPlayerExit(player: Player) {
    if (this.playersInTrigger.has(player.id)) {
      this.playersInTrigger.delete(player.id);
      this.setDefaultPhysics(player);
    }
  }

  private setSkatingPhysics(player: Player) { 
    player.locomotionSpeed.set(this.iceSkatingSpeed);
    console.log(`Player ${player.name.get()} started skating.`);
  }

  private setDefaultPhysics(player: Player) { 
    player.locomotionSpeed.set(4.5); // Default locomotion speed
    console.log(`Player ${player.name.get()} stopped skating.`);
  }
}

Component.register(IceSkating);