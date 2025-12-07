/*

Paintball Gun – by Cappa Games

The Paintball Gun is a complete, ready-to-use package for your world.
Just drop it in and it works out of the box.

It includes:

-A configurable paintball gun with multiple camera and firing options.

A splatter system with reusable splat pools.

Two optional scripts (FlipSwitch & SwitchCounterElevator) for building target/effect gameplay.



Quick Start

    1. Drag and drop the Paintball Gun prefab into your world.
        ◦ On import, placement may appear slightly off. To fix:
          a. Select the Paintball Gun Container and nudge it with the Move tool.
          b. Then select the Paintball Gun inside and nudge it as well.

    2. Playtest — the gun is immediately usable.

    3. (Optional) Adjust gun properties such as:
        ◦ Camera mode
        ◦ Fire rate
        ◦ Projectile speed

    4. (Optional) Customize splatters
        ◦ Edit the splat pools to change models or adjust splatter size.

    5. (Optional) Add interactions
        ◦ Use the included Target/Effect scripts for triggers and effects.




Paintball Gun Skin Customization

-You can swap out the default visuals, sounds, and effects with your own to create a unique paintball gun style.

1. Remove the defaults

-Delete the existing skin, sound, and muzzle flash from the Paintball Gun.

2. Add your custom parts

-Place your new skin model inside the Paintball Gun Container.

-Add your custom sound and muzzle flash directly into the Paintball Gun.

3. Enable grabbing

-In Properties → Behavior, set Interaction to Grabbable.

-This unlocks additional options in the “More” section.

4. Set the grab anchor

-Enable HWXS Grab Anchor.

-Adjust HWXS Anchor Position and Rotation so the gun aligns naturally in the player’s hands.

-Tip: Start the game, pick up the gun, press Escape to unlock your mouse, adjust the values, click back into the game and pick up your gun to check alignment without leaving play mode.

5. Choose a pose

-Select an avatar pose that matches your design.

-Shotgun works well for most paintball gun skins, but try others to see what fits.

6. Finalize setup

-Set Primary Action to Fire.

-Attach the PaintBallGun script to your custom skin and enter your desired gun property values (see Gun Properties section below).


Gun Properties

Property	            Type	           Description
cameraMode	          String	         Camera mode: FirstPerson, ThirdPerson, or Orbit.
autoFireEnabled	      Boolean	         Enables automatic fire when trigger is held.
autoFireRate	        Number	         Shots per second when auto-fire is enabled.
fireCooldown	        Number	         Delay (seconds) between shots to prevent spamming.
projectileSpeed	      Number	         Speed of the paintball projectile.
gunshotSfx	          Audio	           Sound effect played when the gun fires.
muzzleFlash	          Particle	       Particle effect played at the muzzle when firing.


Splatter Customization

The gun uses 10 alternating launchers. Each launcher is linked to its own splatpool so that paintball colors can change every shot without interfering mid-flight.

Editing Splatter Models

-Each splatpool contains multiple splatter models.

-To resize splatters, adjust the scale of the model in Properties → Attributes.

-To replace splatters, delete the old models inside each splatpool and paste in your own.

-Keep the splatpool objects themselves (do not rename or delete them).

-Make sure your custom splatter models have:

  -Collidable = Off

  -Motion = Animated

You may include as many splatter variants as you like, but keeping a similar count per pool is recommended for performance.



Optional: Target & Effect System

The Target and Effect folder includes two scripts that demonstrate how to build gameplay interactions. These are not required for the gun to function.


FlipSwitch Script

Attach this to a target object. When hit by a paintball, it will send a signal to increment a counter (e.g., to activate an elevator).

Property	            Type	        Description
target	              Entity	      The object receiving the increment (e.g., elevator).
countOnce	            Boolean	      If true, target only counts once per switch.
visual	              Entity	      Optional entity to rotate instead of the FlipSwitch root.
rotateDurationMs	    Number	      Time (ms) for a 180° turn (default 300).
moveEnableX/Y/Z	      Boolean	      Enable/disable motion per axis.
moveDistance	        Vec3	        Half-range distance moved along each axis.
moveSpeed	            Vec3	        Units per second per axis.
moveUseLocalAxes	    Boolean	      Movement follows local instead of world axes.
moveActive	          Boolean	      Turns movement on/off at runtime.
debug	                Boolean	      Logs internal actions to console.


SwitchCounterElevator Script

Attach this to the elevator object. It increments when notified by FlipSwitches and moves once the count is reached.

Property		          Type				Description
totalTargets		      Number			Number of hits required to activate the elevator.
currentCount		      Number			Current hit count (leave at 0).
activated		          Boolean			Becomes true once totalTargets is reached.
elevator			        Entity			Object that moves. Defaults to the attached entity if empty.
travelAxis		        Vec3			  Direction of movement (default: up (0,1,0)).
travelDistance		    Number			Maximum distance along the travel axis.
speed			            Number			Movement speed along travel axis.
debug			            Boolean			Logs updates to console.


Notes

If you don’t need the target/effect system, you can safely delete the Target and Effect folder.

Always test custom splatter models in-game to ensure they look and perform as expected.



Created by Cappa Games.

I hope this Paintball Gun package helps you build faster and add fun interactions to your world!
*/



























// Minimal stub to satisfy existing "ReadMe" component references
import { Component, PropTypes } from 'horizon/core';

export class ReadMe extends Component<typeof ReadMe> {
  static propsDefinition = {
    // Short label shown in the inspector
    title:      { type: PropTypes.String,  default: 'Notes' },
    // Your notes (supports multi-line)
    notes:      { type: PropTypes.String,  default: '' },
    // Optional: log these notes to the console on start
    logOnStart: { type: PropTypes.Boolean, default: false },
    // Optional: log as a warning instead of info
    warn:       { type: PropTypes.Boolean, default: false },
  };

  override start() {
    if (!this.props.logOnStart) return;
    const header = `[ReadMe] ${this.props.title || 'Notes'} — ${this.entity?.name?.get?.() ?? ''}`.trim();
    const msg = this.props.notes || '';
    try {
      if (this.props.warn) console.warn(header + (msg ? `\n${msg}` : ''));
      else console.log(header + (msg ? `\n${msg}` : ''));
    } catch {}
  }
}

Component.register(ReadMe);


