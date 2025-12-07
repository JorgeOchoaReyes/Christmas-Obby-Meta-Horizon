import { Component, PropTypes, Entity, Player, PlayerInput, PlayerInputAction, ButtonIcon, CodeBlockEvents, ProjectileLauncherGizmo, PlayerControls } from 'horizon/core';

export class SnowballGun extends Component<typeof SnowballGun> {
  static propsDefinition = {
    // The ProjectileLauncher gizmo that will fire the projectile
    projectileLauncher: { type: PropTypes.Entity },
  };

  // Store the trigger input to disconnect it later
  private triggerInput: PlayerInput | null = null;

  override preStart() {
    // Note: For input handling, the script's execution mode must be set to 'Local' in the editor.

    // Listen for when a player grabs this entity
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnGrabStart,
      (isRightHand: boolean, player: Player) => this.onGrab(player)
    );

    // Listen for when a player drops this entity
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnGrabEnd,
      (player: Player) => this.onDrop()
    );
  }

  override start() {
    // Initialization logic can go here if needed
  }

  private onGrab(player: Player) {
    // When the gun is grabbed, connect the trigger input
    // This ensures only the holding player can fire
    if (this.triggerInput) {
      this.triggerInput.disconnect();
    }

    // Use the RightTrigger action, which corresponds to the primary fire button on most devices
    this.triggerInput = PlayerControls.connectLocalInput(
      PlayerInputAction.RightTrigger,
      ButtonIcon.Fire,
      this
    );

    // Register a callback for when the trigger is pressed
    this.triggerInput.registerCallback((action, pressed) => {
      if (pressed) {
        this.fire();
      }
    });
  }

  private onDrop() {
    // When the gun is dropped, disconnect the trigger input
    if (this.triggerInput) {
      this.triggerInput.disconnect();
      this.triggerInput = null;
    }
  }

  private fire() {
    // Check if the projectileLauncher property is set
    if (!this.props.projectileLauncher) {
      console.warn("ProjectileLauncher is not set in the properties for SnowballGun.");
      return;
    }

    // Get the launcher gizmo and fire a projectile
    const launcher = this.props.projectileLauncher.as(ProjectileLauncherGizmo);
    if (launcher) {
      launcher.launch();
    }
  }

  override dispose() {
    // Clean up the input connection when the component is destroyed
    if (this.triggerInput) {
      this.triggerInput.disconnect();
    }
  }
}

Component.register(SnowballGun);