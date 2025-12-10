import { Component, PropTypes, Player, PlayerInput, PlayerControls, PlayerInputAction, ButtonIcon, AvatarPoseGizmo, CodeBlockEvents, World, Vec3, Quaternion, AvatarPoseUseMode } from 'horizon/core';

class RideableSleigh extends Component<typeof RideableSleigh> {
  static propsDefinition = {
    speed: { type: PropTypes.Number, default: 5 },
    rotationSpeed: { type: PropTypes.Number, default: 60 },
  };

  private driver: Player | null = null;
  private poseGizmo: AvatarPoseGizmo | null = null;

  // Input connections
  private moveYInput: PlayerInput | null = null;
  private turnInput: PlayerInput | null = null;
  private exitInput: PlayerInput | null = null;

  override start() {
    this.poseGizmo = this.entity.as(AvatarPoseGizmo);
    if (!this.poseGizmo) {
      console.error("RideableSleigh requires an AvatarPoseGizmo on the same entity.");
      return;
    }

    // Allow any player to use the pose gizmo to enter the sleigh
    this.poseGizmo.setCanUseForPlayers([], AvatarPoseUseMode.AllowUse);

    // Detect when a player enters the pose gizmo
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterAvatarPoseGizmo, (player: Player) => {
      this.onPlayerEnter(player);
    });

    // Detect when a player exits the pose gizmo
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitAvatarPoseGizmo, (player: Player) => {
      this.onPlayerExit(player);
    });

    // Handle vehicle movement every frame
    this.connectLocalBroadcastEvent(World.onUpdate, (data: { deltaTime: number }) => {
      this.updateMovement(data.deltaTime);
    });
  }

  private onPlayerEnter(player: Player) {
    this.driver = player;
    this.connectInputs();
  }

  private onPlayerExit(player: Player) {
    if (this.driver && this.driver.id === player.id) {
      this.driver = null;
      this.disconnectInputs();
    }
  }

  private connectInputs() {
    // Left thumbstick for movement
    this.moveYInput = PlayerControls.connectLocalInput(PlayerInputAction.LeftYAxis, ButtonIcon.None, this);

    // Right thumbstick for turning
    this.turnInput = PlayerControls.connectLocalInput(PlayerInputAction.RightXAxis, ButtonIcon.None, this);

    // B button to exit
    this.exitInput = PlayerControls.connectLocalInput(PlayerInputAction.RightSecondary, ButtonIcon.None, this);
    this.exitInput.registerCallback((action, pressed) => {
      if (pressed && this.driver && this.poseGizmo) {
        this.poseGizmo.player.set(null); // Eject player from pose
      }
    });
  }

  private disconnectInputs() {
    this.moveYInput?.disconnect();
    this.turnInput?.disconnect();
    this.exitInput?.disconnect();

    this.moveYInput = null;
    this.turnInput = null;
    this.exitInput = null;
  }

  private updateMovement(deltaTime: number) {
    if (!this.driver || !this.moveYInput || !this.turnInput) {
      return;
    }

    const forwardInput = this.moveYInput.axisValue.get();
    const turnInput = this.turnInput.axisValue.get();

    // Forward/backward movement
    if (Math.abs(forwardInput) > 0.1) {
      const moveDirection = this.entity.forward.get();
      const moveDistance = forwardInput * this.props.speed * deltaTime;
      const newPosition = this.entity.position.get().add(moveDirection.mul(moveDistance));
      this.entity.position.set(newPosition);
    }

    // Turning
    if (Math.abs(turnInput) > 0.1) {
      const rotationAmount = -turnInput * this.props.rotationSpeed * deltaTime; // Invert for intuitive turning
      const currentRotation = this.entity.rotation.get();
      const rotationDelta = Quaternion.fromEuler(new Vec3(0, rotationAmount, 0));
      this.entity.rotation.set(currentRotation.mul(rotationDelta));
    }
  }

  override dispose() {
    this.disconnectInputs();
  }
}

Component.register(RideableSleigh);