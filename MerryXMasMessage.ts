import * as hz from 'horizon/core';
import { Player, PropTypes } from 'horizon/core';

class MerryXMasMessage extends hz.Component<typeof MerryXMasMessage> {
  static propsDefinition = {
    soundFxToPlay: { type: PropTypes.Entity },
  };

  start() {
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
      this.playSFX(player);
    }); 
  }


  playSFX(player: Player) {
    if(this.props.soundFxToPlay) {
      this.props.soundFxToPlay.as(hz.AudioGizmo).play({
        fade: 0,
        players: [player],
      })
    }
  }


}
hz.Component.register(MerryXMasMessage);