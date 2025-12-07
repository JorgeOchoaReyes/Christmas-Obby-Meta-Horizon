declare module 'horizon/analytics' {
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
import * as hz from 'horizon/core';
/**
 * A valid value type for an {@link EventData} object.
 */
export declare type EventValueType = string | number | boolean | hz.Vec3 | Array<string>;
/**
 * A set of key-value pairs that represent data for an analytics event.
 *
 * @remarks
 * See {@link EventValueType} for the available value types.
 */
export declare type EventData = {
    [key: string]: EventValueType;
};
/**
 * The game modes for analytics sections.
 *
 * @remarks
 * To enable sections analytics, see the {@link ITurboSettings.useSections} property.
 */
export declare enum AnalyticsSectionGameMode {
    /**
     * The default game mode for gameplay.
     */
    GAMEPLAY = 0,
    /**
     * The game mode for loading sections.
     */
    LOADING = 1,
    /**
     * The game mode for lobby sections.
     */
    LOBBY = 2
}
/**
 * Logs analytics events to the Creator Analytics dashboard and Creator Analytics
 * table.
 */
export declare const analytics: {
    /**
     * Logs an event to the Creator Analytics dashboard with an arbitrary set of key:value
     * pairs as extra data input.
     *
     * @param player - The player to log events for.
     * @param eventName - The event to log.
     * @param data - An array of key/value pairs for storing extra
     * event data.
     */
    logEvent(player: hz.Player, eventName: string, data: EventData): void;
    /**
     * Logs an event to the Creator Analytics table based on when a new section is
     * starting.
     *
     * @param sectionName - The section name to log.
     * @param gameMode - The game mode to log.
     */
    markPlaySection(sectionName: string, gameMode: AnalyticsSectionGameMode): void;
};
/**
 * The Turbo actions that trigger Turbo {@link TurboEvents | events}. Turbo
 * actions are contexts for Turbo events, and represent the trigger or
 * player action for an associated event.
 *
 * @remarks
 * The {@link ITurboSettings} interface defines properties that enable and disable
 * analytics tracking for each Turbo action.
 */
export declare enum Action {
    /**
     * Triggered for an unknown action.
     */
    UNKNOWN = -1,
    /**
     * Triggered when a player unequips an ability.
     *
     * The {@link ITurboSettings.useAbilities} property enables ability analytics.
     */
    ABILITY_DEQUIP = 1,
    /**
     * Triggered when a player equips an ability.
     *
     * The {@link ITurboSettings.useAbilities} property enables ability analytics.
     */
    ABILITY_EQUIP = 2,
    /**
     * Triggered when a player uses an ability.
     *
     * The {@link ITurboSettings.useAbilities} property enables ability analytics.
     */
    ABILITY_USED = 3,
    /**
     * Triggered when a player unlocks an achievement.
     *
     * The {@link ITurboSettings.useQuests} property enables achievement analytics.
     */
    ACHIEVEMENT_UNLOCKED = 4,
    /**
     * Triggered when a player enters the AFK (away from keyboard) state.
     *
     * The {@link ITurboSettings.useAFK} property enables AFK analytics.
     */
    AFK_ENTER = 5,
    /**
     * Triggered when a player exits the AFK (away from keyboard) state.
     *
     * The {@link ITurboSettings.useAFK} property enables AFK analytics.
     */
    AFK_EXIT = 6,
    /**
     * Triggered when a player transitions from one specific area to another.
     */
    AREA_CHANGE = 7,
    /**
     * Triggered when a player enters an area.
     */
    AREA_ENTER = 8,
    /**
     * Triggered when a player exits an area.
     */
    AREA_EXIT = 9,
    /**
     * Triggered when a player equips and armor item.
     *
     * The {@link ITurboSettings.useArmor} property enables armor analytics.
     */
    ARMOR_EQUIP = 10,
    /**
     * Triggered when a player unequips an armor item.
     *
     * The {@link ITurboSettings.useArmor} property enables armor analytics.
     */
    ARMOR_DEQUIP = 11,
    /**
     * Triggered when a player opens their camera.
     */
    CAMERA_OPEN = 12,
    /**
     * Triggered when a player closes their camera.
     */
    CAMERA_CLOSE = 13,
    /**
     * Triggered when a player captures image in the game.
     */
    CAMERA_PHOTO_TAKEN = 14,
    /**
     * Triggered for a custom action.
     */
    CUSTOM_ACTION = 15,
    /**
     * Triggered when an enemy takes damage.
     *
     * The {@link ITurboSettings.useDamage} property enables damage analytics.
     */
    DAMAGE_ENEMY = 16,
    /**
     * Triggered when a player takes damage.
     *
     * The {@link ITurboSettings.useDamage} property enables damage analytics.
     */
    DAMAGE_PLAYER = 17,
    /**
     * Triggered when a player character dies.
     */
    DEATH = 18,
    /**
     * Triggered when a player activates a discovery event.
     *
     * The {@link ITurboSettings.useDiscovery} property enables discovery analytics.
     */
    DISCOVERY_MADE = 19,
    /**
     * Triggered when a player causes a friction event.
     *
     * The {@link ITurboSettings.useFriction} property enables friction analytics.
     */
    FRICTION_CAUSED = 20,
    /**
     * Triggered when an event that causes friction occurs.
     *
     * @remarks
     * The {@link ITurboSettings.useFriction} property enables friction analytics.
     */
    FRICTION_HIT = 21,
    /**
     * Triggered when a player kills an enemy controlled by the game or a player character.
     */
    KILL = 22,
    /**
     * Triggered when a player kills an enemy controlled by the game.
     */
    KILL_ENEMY = 23,
    /**
     * Triggered when a player kills another player character.
     */
    KILL_PLAYER = 24,
    /**
     * Triggered when a player levels up.
     */
    LEVEL_UP = 25,
    /**
     * Triggered when a player in a lobby area pogresses through a matchmaking queue.
     */
    LOBBY_PROGRESS = 26,
    /**
     * Triggered when a player enters a lobby area.
     */
    LOBBY_SECTION_ENTER = 27,
    /**
     * Triggered when a player exits a lobby area.
     */
    LOBBY_SECTION_EXIT = 28,
    /**
     * Triggered when a mini game starts.
     */
    MINI_GAME_START = 29,
    /**
     * Triggered when a mini game ends.
     */
    MINI_GAME_END = 30,
    /**
     * Triggered when the stats of a mini game are updated.
     */
    MINI_GAME_STATS = 31,
    /**
     * Triggered when a player enters an area that implies their intent to play.
     */
    PLAYER_READY_ENTER = 32,
    /**
     * Triggered when a player exits an area that implies their intent to play.
     */
    PLAYER_READY_EXIT = 33,
    /**
     * Triggered when a player rejoins the instance.
     */
    REJOINED_INSTANCE = 34,
    /**
     * Triggered when a player is revived.
     */
    REVIVE = 35,
    /**
     * Triggered when the player is revived by another player.
     */
    REVIVED_BY_PLAYER = 36,
    /**
     * Triggered when a player earns rewards.
     */
    REWARDS_EARNED = 37,
    /**
     * Triggered for all players that were participating when the round ends (one event per player).
     *
     * @remarks
     * Rounds are enabled by the {@link ITurboSettings.useRounds} setting.
     */
    ROUND_END = 38,
    /**
     * Triggered when a player abandons a round.
     *
     * @remarks
     * Rounds are enabled by the {@link ITurboSettings.useRounds} setting.
     */
    ROUND_ABANDONED = 39,
    /**
     * Triggered when a player rejoins a round.
     *
     * @remarks
     * Rounds are enabled by the {@link ITurboSettings.useRounds} setting.
     */
    ROUND_REJOINED = 40,
    /**
     * Triggered when a player loses a round.
     *
     * @remarks
     * Rounds are enabled by the {@link ITurboSettings.useRounds} setting.
     */
    ROUND_LOST = 41,
    /**
     * Triggered for all participating players when the round starts, or for players that join during an existing round.
     *
     * @remarks
     * Rounds are enabled by the {@link ITurboSettings.useRounds} setting.
     */
    ROUND_START = 42,
    /**
     * Triggered when the stats for a round are updated.
     *
     * @remarks
     * Rounds are enabled by the {@link ITurboSettings.useRounds} setting.
     */
    ROUND_STATS = 43,
    /**
     * Triggered when a player wins the round.
     *
     * @remarks
     * Rounds are enabled by the {@link ITurboSettings.useRounds} setting.
     */
    ROUND_WIN = 44,
    /**
     * Triggered when a player quits a section.
     *
     * @remarks
     * Sections are enabled by the {@link ITurboSettings.useSections} setting.
     */
    SECTION_ABANDONED = 45,
    /**
     * Triggered when the section ends.
     *
     * @remarks
     * Sections are enabled by the {@link ITurboSettings.useSections} setting.
     */
    SECTION_END = 46,
    /**
     * Triggered when a player restarts a section.
     *
     * @remarks
     * Sections are enabled by the {@link ITurboSettings.useSections} setting.
     */
    SECTION_RESTART = 47,
    /**
     * Triggered when a player starts playing a section.
     *
     * @remarks
     * Sections are enabled by the {@link ITurboSettings.useSections} setting.
     */
    SECTION_START = 48,
    /**
     * Triggered when the stats for a section are updated.
     *
     * @remarks
     * Sections are enabled by the {@link ITurboSettings.useSections} setting.
     */
    SECTION_STATS = 49,
    /**
     * Triggered when a player quits a stage.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useStages} setting.
     */
    STAGE_ABANDONED = 50,
    /**
     * Triggered when a stage ends.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useStages} setting.
     */
    STAGE_END = 51,
    /**
     * Triggered when a player progresses through a stage.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useStages} setting.
     */
    STAGE_PROGRESS = 52,
    /**
     * Triggered when a player restarts a stage.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useStages} setting.
     */
    STAGE_RESTART = 53,
    /**
     * Triggered when a player begins a stage.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useStages} setting.
     */
    STAGE_START = 54,
    /**
     * Triggered when stats are collected for a stage.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useStages} setting.
     */
    STAGE_STATS = 55,
    /**
     * Triggered when a task is abondoned.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_ABANDONED = 56,
    /**
     * Triggered when a tesk ends.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_END = 57,
    /**
     * Triggered when task fails.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_FAIL = 58,
    /**
     * Triggered when begins.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_START = 59,
    /**
     * Triggered when a task step ends.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_STEP_END = 60,
    /**
     * Triggered when a task step fails.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_STEP_FAIL = 61,
    /**
     * Triggered when task step begins.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_STEP_START = 62,
    /**
     * Triggered when the step of a task succeeds.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_STEP_SUCCESS = 63,
    /**
     * Triggered when a task succeeds.
     *
     * @remarks
     * Tasks are enabled by the {@link ITurboSettings.useTasks} setting.
     */
    TASK_SUCCESS = 64,
    /**
     * Triggered when an intermittent snapshot is taken of the game state.
     */
    TURBO_GAME_STATE_SNAPSHOT = 65,
    /**
     * Triggered when an intermittent snapshot is taken of the player state.
     */
    TURBO_PLAYER_STATE_SNAPSHOT = 66,
    /**
     * Triggered every interval defined by the {@link ITurboSettings.heartbeatFrequencySeconds} property.
     */
    TURBO_HEARTBEAT = 67,
    /**
     * Triggered when a player equips a weapon.
     */
    WEAPON_EQUIP = 68,
    /**
     * Triggered when a player fires a weapon.
     */
    WEAPON_FIRED = 69,
    /**
     * Triggered when a player grabs a weapon.
     */
    WEAPON_GRAB = 70,
    /**
     * Triggered while a player is holding a weapon.
     */
    WEAPON_HELD = 71,
    /**
     * Triggered when a player unequips a weapon.
     */
    WEAPON_RELEASE = 72,
    /**
     * Triggered when a player equips a wearable item.
     *
     * @remarks
     * The {@link ITurboSettings.useWearables} and {@link ITurboSettings.useWearableEquipAndRelease }
     * properties enable wearables analytics.
     */
    WEARABLE_EQUIP = 73,
    /**
     * Triggered when a player removes a wearable item.
     *
     * @remarks
     * The {@link ITurboSettings.useWearables} and {@link ITurboSettings.useWearableEquipAndRelease }
     * properties enable wearables analytics.
     */
    WEARABLE_RELEASE = 74,
    /**
     * Triggered when a player enters the world.
     */
    WORLD_ENTER = 75,
    /**
     * Triggered when a player exits the world.
     */
    WORLD_EXIT = 76
}
/**
 * The shared game states for a world instance. This is not player-specific.
 */
export declare enum GameStateEnum {
    /**
     * No game state.
     */
    NONE = "NONE",
    /**
     * The game is active.
     */
    ACTIVE = "ACTIVE",
    /**
     * The game has not started.
     */
    NEVER_STARTED = "NEVER_STARTED",
    /**
     * The game is in between rounds.
     */
    BETWEEN_ROUNDS = "BETWEEN_ROUNDS",
    /**
     * The game is in between stages.
     */
    BETWEEN_STAGES = "BETWEEN_STAGES"
}
/**
 * The participation state of a player in a world instance.
 *
 * @privateRemarks
 * Mirrors the `HzWorldsTurboStateEnum` enum.
 */
export declare enum ParticipationEnum {
    /**
     * No player state.
     */
    NONE = "NONE",
    /**
     * The player is AFK (away from the keyboard).
     */
    AFK = "AFK",
    /**
     * The player is in the game lobby.
     */
    IN_LOBBY = "IN_LOBBY",
    /**
     * The player is participating in a game round.
     */
    IN_ROUND = "IN_ROUND",
    /**
     * The player is in between game rounds.
     */
    BETWEEN_ROUNDS = "IN_BETWEEN_ROUNDS",
    /**
     * The player is in between game stages.
     */
    IN_BETWEEN_STAGES = "IN_BETWEEN_STAGES"
}
/**
 * The available settings for a {@link Turbo} instance including the ability to
 * enable and disable specific types of analytics tracking. Many of these
 * settings configure a corresponding set of Turbo {@link Action | actions} and {@link TurboEvents}.
 *
 * @remarks
 * The {@link TurboDefaultSettings} variable defines the default settings.
 *
 * To apply your Turbo settings, populate your `ITurboSettings` object and pass it to the
 * `Turbo.register(component, configs)` method. For details, see the {@link Turbo} variable.
 *
 * @example
 * This example demonstrates how to disable several Turbo settings when calling the
 * Turbo.register() method.
 * ```
 * start() {
 *    const turboSettings: ITurboSettings = {
 *     useAFK: false,
 *     useFriction: false,
 *     useHeartBeats
 *   };
 *    Turbo.register(this, turboSettings);
 *    AnalyticsManager.s_instance = this;
 *    this.subscribeToEvents();
 *   }
 * ```
 */
export interface ITurboSettings {
    /**
     * `true` to enable Turbo debugging functionality, such as logs and tools;
     * `false` to disable it.
     */
    debug: boolean;
    /**
     * A method that enables a set of experiments for the player.
     */
    experiments: Set<string>;
    /**
     * `true` to enable logging for wearable equip and release events on the
     * backend server; `false` to disable it.
     *
     * @remarks
     * To use this setting, you must enable the
     * {@link ITurboSettings.useWearableEquipAndRelease} property.
     *
     * Player state updates can still reflect current the wearables and timers
     * without logging the actual events.
     */
    eventsForWearableEquipAndRelease: boolean;
    /**
     * `true` to enable logging for weapon equip and release events on the backend
     * server; `false` to disable it.
     *
     * @remarks
     * To use this setting, you must enable the
     * {@link ITurboSettings.useWeaponEquipAndRelease} property.
     *
     * Player state updates can still reflect current the weapon and timers
     * without logging the actual events.
     */
    eventsForWeaponGrabAndRelease: boolean;
    /**
     * A timer that creates a friction event whenever no player kills occur within the
     * specified duration during gameplay. The timer specified in seconds.
     *
     * @remarks
     * The {@link useFrictionNoKOs} property must be `true`; otherwise, this timer is ignored.
     */
    frictionNoKOsTimerSeconds: number;
    /**
     * The name of a custom game mode, such as arena, or adventure.
     *
     * @remarks
     * The {@link useGameMode} property must be enabled to track game mode events and data.
     */
    gameMode: string;
    /**
     * The frequency, in seconds, for capturing a heartbeat event for each active player.
     *
     * @remarks
     * The {@link useHeartbeats} setting must be enabled to track heartbeat events.
     */
    heartbeatFrequencySeconds: number;
    /**
     * The name of the initial area where a player first enters a world.
     */
    playerInitialArea: string;
    /**
     * The player's initial participation state when a player first enters a world.
     */
    playerInitialState: ParticipationEnum;
    /**
     * The frequency, in seconds, for Turbo Manger to update the game state.
     *
     * @remarks
     * Setting this proprety lower affects performance; higher impacts accuracy.
     */
    turboUpdateSeconds: number;
    /**
     * The number of seconds before deleting an AFK player.
     *
     * @remarks
     * Deleting AFK players after the specified duration can help avoid memory
     * leak issues.
     */
    maxAFKSecondsBeforeRemove: number;
    /**
     * The maximum number of times to send friction events due to no player kills
     * occuring within the {@link frictionNoKOsTimerSeconds} timer.
     *
     * @remarks
     * The {@link useFrictionNoKOs} setting must be enabled in order to track this
     * event type.
     */
    maxFrictionNoKOEvents: number;
    /**
     * `true` to track abilities events and data; `false` otherwise.
     */
    useAbilities: boolean;
    /**
     * `true` to track AFK enter and AFK exit events and data; `false` otherwise.
     *
     * @remarks
     * This setting enables the `AFK_ENTER` and `AFK_EXIT` {@link Action | actions}.
     */
    useAFK: boolean;
    /**
     * `true` to track armor events and data; `false` otherwise.
     *
     * @remarks
     * This setting enables the `ARMOR_EQUIP` and `ARMOR_DEQUIP`
     * {@link Action | actions}.
     */
    useArmor: boolean;
    /**
     * `true` to track damage events and data; `false` otherwise.
     *
     * @remarks
     * This setting enables the `DAMAGE_ENEMY` and `DAMAGE_PLAYER`
     * {@link Action | actions}.
     */
    useDamage: boolean;
    /**
     * `true` to track events and data for player discoveries; `false` otherwise.
     *
     * @remarks
     * This setting enables the `DISCOVERY_MADE` {@link Action | action}.
     */
    useDiscovery: boolean;
    /**
     * `true` to log forward vectors with each player action; `false` otherwise.
     */
    useForward: boolean;
    /**
     * `true` to track friction events and data; `false` otherwise.
     *
     * @remarks
     * This setting enables the `FRICTION_HIT` and `FRICTION_CAUSED`
     * {@link Action | actions}.
     *
     * Friction events can be derived or deliberate, and slow player pogression.
     */
    useFriction: boolean;
    /**
     * `true` to track friction events and data caused when no player kills occur
     * within a specified duration; `false` otherwise.
     *
     * @remarks
     * This setting enables events and data tracking based on the the
     * {@link ITurboSettings.frictionNoKOsTimerSeconds} property.
     */
    useFrictionNoKOs: boolean;
    /**
     * `true` to track custom game mode events and data; `false` otherwise.
     *
     * @remarks
     * This setting enables the {@link ITurboSettings.gameMode} property.
     *
     * Game modes are custom variations of the game, such as arena and guild wars.
     */
    useGameMode: boolean;
    /**
     * `true` to track track heartbeat events and data at the specified
     * duration; `false` otherwise.
     *
     * @remarks
     * The {@link ITurboSettings.heartbeatFrequencySeconds} property specifies the
     * tracking duration.
     */
    useHeartbeats: boolean;
    /**
     * `true` to continuously track player position, rotation, distances, and other player
     * transforms. `false` to only calculate player transforms for each action.
     */
    useTransforms: boolean;
    /**
     * `true` to track player level and level up events and data; `false` otherwise.
     *
     * @remarks
     * This setting enables the `LEVEL_UP` {@link Action | action}.
     */
    useLevelUp: boolean;
    /**
     * `true` to enable quest and achievement analytics; `false` otherwise.
     */
    useQuests: boolean;
    /**
     * `true` to track rewards events and data; `false` otherwise.
     *
     * @remarks
     * This setting can track data such as collectibles, XP, points, and
     * bonuses. Reward tracking ensures rewards are being received and provide
     * insight into how, when, and why those rewards are earned or missed.
     */
    useRewards: boolean;
    /**
     * `true` to track events and data for rounds; `false` otherwise.
     *
     * @remarks
     * A round is a full completion of a game and represent the overall
     * loop of funnel progression analytics, which consists of rounds, stages,
     * and sections.
     *
     * This setting enables the `ROUND_ABANDONED`, `ROUND_END`, `ROUND_LOST`,
     * `ROUND_REJOINED`, `ROUND_START`, `ROUND_STATS`, and `ROUND_WIN`
     * {@link Action | actions}.
     */
    useRounds: boolean;
    /**
     * `true` to log rotation using Eurler angles with each player action;
     * `false` otherwise.
     */
    useRotation: boolean;
    /**
     * `true` to track events and data for stages; `false` otherwise.
     *
     * @remarks
     * Stages are subdivisions of {@link useRounds | rounds} in funnel progression
     * analytics.
     *
     * This setting enables the `STAGE_ABANDONED`, `STAGE_END`, `STAGE_PROGRESS`,
     * `STAGE_RESTART`, `STAGE_START`, and `STAGE_STATS` {@link Action | actions}.
     */
    useStages: boolean;
    /**
     * `true` to track events and data for sections; `false` otherwise.
     *
     * @remarks
     * Sections are subdivisions of {@link useStages | stages} in funnel progression
     * analytics. Sections track progression when a player starts, completes, or
     * enters a subsection of a stage, wave, or level. The purpose of this setting is
     * to track more granular portions of the areas where an event occurs or a player
     * is navigating.
     *
     * This setting enables the `SECTION_ABANDONED`, `SECTION_END`, `SECTION_RESTART`,
     * `SECTION_START`, and `SECTION_STATS` {@link Action | actions}.
     */
    useSections: boolean;
    /**
     * `true` to track events and data for tasks and task steps, such as activities,
     * challenges, and puzzles. Otherwise, `false`.
     *
     * @remarks
     * Tasks and task steps were designed to measure specific activities where a player
     * has a series of steps to follow. In comparison to rounds, stages, and sections,
     * tasks are more discrete units that can occur within those items.
     *
     * This setting enables the `TASK_ABANDONED`, `TASK_END`, `TASK_FAIL`, `TASK_START`,
     * `TASK_STEP_END`, `TASK_STEP_FAIL`, `TASK_STEP_START`, `TASK_STEP_SUCCESS`, and
     * `TASK_SUCCESS` {@link Action | actions}.
     */
    useTasks: boolean;
    /**
     * `true` to track team and role based data using the player state; `false`
     * otherwise.
     */
    useTeamAndRole: boolean;
    /**
     * `true` to track weapon use events and data; `false` otherwise.
     *
     * @remarks
     * This settings enables the `WEAPON_FIRED` {@link Action | action}.
     *
     * Weapon grab and release analytics are enabled with the
     * {@link ITurboSettings.useWeaponGrabAndRelease } property.
     *
     * Weapon equip analytics are enabled with the
     * {@link ITurboSettings.useWeaponEquip } property.
     */
    useWeapons: boolean;
    /**
     * `true` to track when a player equips a weapon; `false` otherwise.
     *
     * @remarks
     * This setting enables the `WEARABLE_EQUIP` {@link Action | action}.
     *
     * Weapon grab and release analytics are enabled with the
     * {@link ITurboSettings.useWeaponGrabAndRelease } property.
     *
     * Weapon usr analytics are enabled with the
     * {@link ITurboSettings.useWeapons } property.
     */
    useWeaponEquip: boolean;
    /**
     * `true` to enable tracking for weapon grab and release events and data.
     * `false` to disable it.
     *
     * @remarks
     * This setting enables the `WEAPON_GRAB` and `WEAPON_RELEASE`
     * {@link Action | actions}.
     *
     * When players grab and release weapons, it updates weapon utilization timers
     * and the current weapons data.
     *
     * The {@link ITurboSettings.EventsForWeaponGrabAndRelease} property enables
     * logging the individual grab and release events to the backend server.
     */
    useWeaponGrabAndRelease: boolean;
    /**
     * `true` to track events and data for a wearables that are currently
     * eqquiped by a player. `false` to disable it.
     *
     * @remarks
     * The {@link ITurboSettings.useWearableEquipAndRelease} property enables tracking of equip
     * and release events for wearables.
     */
    useWearables: boolean;
    /**
     * `true` to track equip and release events and data for wearables; `false`
     * otherwise.
     *
     * @remarks
     * This setting enables the `WEARABLE_EQUIP` and `WEARABLE_RELEASE`
     * {@link Action | actions}.
     *
     * The {@link ITurboSettings.eventsForWearableEquipAndRelease} property
     * enables logging the individual grab and release events to the backend
     * server.
     */
    useWearableEquipAndRelease: boolean;
}
/**
 * The default {@link ITurboSettings | settings} for a {@link Turbo} instance,
 * including the initial Turbo events and data to collect.
 *
 * @remarks
 * To use these settings, pass this value to `Turbo.register(component, configs)` method. For
 * more information, see the {@link Turbo} variable.
 *
 * Default settings:
 *
 * {@link ITurboSettings.debug | debug} `false`
 *
 * {@link ITurboSettings.experiments | experiments} `new Set<string>()`
 *
 * {@link ITurboSettings.frictionNoKOsTimerSeconds | frictionNoKOsTimerSeconds} `120.0`
 *
 * {@link ITurboSettings.gameMode | gameMode} - game mode is empty
 *
 * {@link ITurboSettings.heartbeatFrequencySeconds | heartbeatFrequencySeconds} `120`
 *
 * {@link ITurboSettings.maxAFKSecondsBeforeRemove | maxAFKSecondsBeforeRemove} `180`
 *
 * {@link ITurboSettings.maxFrictionNoKOEvents | maxFrictionNoKOEvents} `30`
 *
 * {@link ITurboSettings.playerInitialArea | playerInitialArea} `lobby_world_enter`
 *
 * {@link ITurboSettings.playerInitialState | playerInitialState} `ParticipationEnum.IN_LOBBY`
 *
 * {@link ITurboSettings.turboUpdateSeconds | turboUpdateSeconds} `1.0`
 *
 * These settings are set to true by default, which enables the associated Turbo
 * actions:
 *
 * {@link ITurboSettings.useAFK | useAFK}
 *
 * {@link ITurboSettings.useDiscovery | useDiscovery}
 *
 * {@link ITurboSettings.useFriction | useFriction}
 *
 * {@link ITurboSettings.useGameMode | useGameMode}
 *
 * {@link ITurboSettings.useHeartbeats | useHeartbeats}
 *
 * {@link ITurboSettings.useLevelUp | useLevelUp}
 *
 * {@link ITurboSettings.useQuests | useQuests}
 *
 * {@link ITurboSettings.useRewards | useRewards}
 *
 * These settings are set to false by default, which disables the associated
 * Turbo actions:
 *
 * {@link ITurboSettings.ForWeaponGrabAndRelease | ForWeaponGrabAndRelease}
 *
 * {@link ITurboSettings.eventsForWearableEquipAndRelease | eventsForWearableEquipAndRelease}
 *
 * {@link ITurboSettings.useAbilities | useAbilities}
 *
 * {@link ITurboSettings.useArmor | useArmor}
 *
 * {@link ITurboSettings.useDamage | useDamage}
 *
 * {@link ITurboSettings.useForward | useForward}
 *
 * {@link ITurboSettings.useFrictionNoKOs | useFrictionNoKOs}
 *
 * {@link ITurboSettings.useRotation | useRotation}
 *
 * {@link ITurboSettings.useRounds | useRounds}
 *
 * {@link ITurboSettings.useSections | useSections}
 *
 * {@link ITurboSettings.useStages | useStages}
 *
 * {@link ITurboSettings.useTasks | useTasks}
 *
 * {@link ITurboSettings.useTeamAndRole | useTeamAndRole}
 *
 * {@link ITurboSettings.useTransforms | useTransforms}
 *
 * {@link ITurboSettings.useWeaponEquip | useWeaponEquip}
 *
 * {@link ITurboSettings.useWeaponGrabAndRelease | useWeaponGrabAndRelease}
 *
 * {@link ITurboSettings.useWeapons | useWeapons}
 *
 * {@link ITurboSettings.useWearableEquipAndRelease | useWearableEquipAndRelease}
 *
 * {@link ITurboSettings.useWearables | useWearables}
 *
 * @example
 * This example sets the Turbo settings to the default settings.
 * ```
 * Turbo.register(this, TurboDefaultSettings);
 * ```
 */
export declare const TurboDefaultSettings: ITurboSettings;
declare const TurboOnEventSymbol: unique symbol;
declare const TurboAfterEventSymbol: unique symbol;
/** TurboEventOptions - for defining a TurboEvent */
declare type TurboEventOptions<TPayload> = {
    id: string;
    action: Action;
    [TurboOnEventSymbol]?: (this: BaseTurboEvent<TPayload>, turboPlayer: TurboPlayer, payload: TPayload, turboPlayers?: Array<TurboPlayer>) => TurboPlayer;
    [TurboAfterEventSymbol]?: (this: BaseTurboEvent<TPayload>, turboPlayer: TurboPlayer, payload?: TPayload) => void;
};
declare abstract class BaseTurboEvent<TPayload> {
    protected options: TurboEventOptions<TPayload>;
    constructor(options: TurboEventOptions<TPayload>);
    getID(): string;
    get action(): Action;
}
declare type BaseTurboEventPayload<TEvent> = TEvent extends SinglePlayerTurboEvent<infer TPayload> ? TPayload : TEvent extends MultiPlayerTurboEvent<infer TPayload> ? TPayload : never;
declare type TurboEventPayload<TPayload> = TPayload & {
    player: hz.Player;
};
declare type MultiPlayerEventPayload<TPayload> = TPayload & {
    players: Array<hz.Player>;
};
declare type FullTurboEventPayload<TEvent> = TEvent extends BaseTurboEvent<infer TPayload> ? TPayload : never;
/** Single Player TurboEvents are handled per-player with defined logging and effects of TurboPlayer actions
 * @remarks using a unique symbol allows the "onEvent" method on TurboEvent to be private to the implementation
 */
declare class SinglePlayerTurboEvent<TPayload> extends BaseTurboEvent<TurboEventPayload<TPayload>> {
    getID(): string;
    get action(): Action;
    /** Send Analytics Event - shared flow across TurboPlayer actions */
    onTurboPlayerEvent<TPayload>(turboManager: TurboManager, turboPlayer: TurboPlayer, payload: TPayload, action: Action): boolean;
    /** Proxy Calls to TurboOnEvent symbol from the Event to the Private Options Object on that event
     * @remarks [OnEvent] is unique per TurboEvent type defined in the options
     * designed to execute prior to 'AfterEvent' logic, ensuring the Turbo action is logged
     * Step 1: TurboPlayer state changes resulting from the event
     * Step 2: Logging enrichment and transmission (logAnalyticsEvent)
     */
    [TurboOnEventSymbol](payload: TurboEventPayload<TPayload>, maxSendsPerAction?: number): TurboPlayer;
    /** Proxy Calls to TurboAfterEvent cleanup, mostly for TurboPlayer state management */
    [TurboAfterEventSymbol](turboPlayer: TurboPlayer): void;
    /**
     * Subset of Turbo Settings as Array to send settings sparsely for each player.  Subset keeps it less expensive
     **/
    private getFilteredSettingsKV;
    /** Determine if we should log an event to the analytics backend */
    private shouldSendEvent;
}
declare type AFKEnterPayload = BaseTurboEventPayload<typeof OnAFKEnterTurboEvent>;
declare type AFKExitPayload = BaseTurboEventPayload<typeof OnAFKExitTurboEvent>;
declare const OnAbilityEquip: SinglePlayerTurboEvent<{
    abilityKey: string;
    abilityId?: number | undefined;
    abilitySeconds?: number | undefined;
    abilityCooldownSeconds?: number | undefined;
}>;
declare const OnAbilityDequip: SinglePlayerTurboEvent<{
    abilityKey: string;
}>;
declare const OnAbilityUsed: SinglePlayerTurboEvent<{
    abilityKey: string;
}>;
declare const OnAreaEnter: SinglePlayerTurboEvent<{
    actionArea: string;
    actionAreaIsLobbySection: boolean;
    actionAreaIsPlayerReadyZone: boolean;
    turboState?: ParticipationEnum | undefined;
    nextArea?: {
        actionArea: string;
        actionAreaIsLobbySection: boolean;
        actionAreaIsPlayerReadyZone: boolean;
    } | undefined;
}>;
declare const OnAreaExit: SinglePlayerTurboEvent<{
    actionArea: string;
    actionAreaIsLobbySection: boolean;
    actionAreaIsPlayerReadyZone: boolean;
    turboState?: ParticipationEnum | undefined;
    nextArea?: {
        actionArea: string;
        actionAreaIsLobbySection: boolean;
        actionAreaIsPlayerReadyZone: boolean;
    } | undefined;
}>;
declare const OnArmorEquip: SinglePlayerTurboEvent<{
    armorBody?: string | undefined;
    armorHelm?: string | undefined;
}>;
declare const OnArmorDequip: SinglePlayerTurboEvent<{
    armorBody?: string | undefined;
    armorHelm?: string | undefined;
}>;
declare const OnDamageEnemy: SinglePlayerTurboEvent<{
    enemyDamaged: string;
    damageAmount: number;
    damageIsFriendlyFire?: boolean | undefined;
    weaponKey?: string | undefined;
}>;
declare const OnDamagePlayer: SinglePlayerTurboEvent<{
    otherPlayerDamaged: string;
    damageAmount: number;
    damageIsFriendlyFire?: boolean | undefined;
    weaponKey?: string | undefined;
}>;
declare const OnDeath: SinglePlayerTurboEvent<{
    killedByPlayer: string;
    killedByWeaponKey?: string | undefined;
    killedByEnemy?: boolean | undefined;
}>;
declare const OnDeathByPlayer: SinglePlayerTurboEvent<{
    killedByPlayer: string;
    killedByWeaponKey?: string | undefined;
}>;
declare const OnDeathByEnemy: SinglePlayerTurboEvent<{
    killedByEnemy: string;
    killedByWeaponKey?: string | undefined;
}>;
/** Discovery Made is for positive features seen by the player */
declare const OnDiscoveryMade: SinglePlayerTurboEvent<{
    discoveryItemKey: string;
    discoveryAmount?: number | undefined;
    discoveryIsImplied?: boolean | undefined;
    discoveryNumTimes?: number | undefined;
    rewardsType?: string | undefined;
    rewardsEarned?: number | undefined;
    weaponKey?: string | undefined;
}>;
declare const OnFrictionCaused: SinglePlayerTurboEvent<{
    frictionItemKey: string;
    frictionAmount?: number | undefined;
    frictionIsImplied?: boolean | undefined;
    frictionNumTimes?: number | undefined;
}>;
/** Friction Hit is for negative or progression-slowing events experienced by the player */
declare const OnFrictionHit: SinglePlayerTurboEvent<{
    frictionItemKey: string;
    frictionAmount?: number | undefined;
    frictionIsImplied?: boolean | undefined;
    frictionNumTimes?: number | undefined;
    affectedPlayerNames?: string[] | undefined;
    afkRoundSeconds?: number | undefined;
    roundNoKillSeconds?: number | undefined;
}>;
declare const OnKOPlayer: SinglePlayerTurboEvent<{
    otherPlayerKilled: string;
    killedByWeaponKey: string;
}>;
declare const OnKOEnemy: SinglePlayerTurboEvent<{
    enemyKilled: string;
    killedByWeaponKey: string;
}>;
declare const OnLevelUp: SinglePlayerTurboEvent<{
    playerLevel: number;
    playerTitle: string;
}>;
declare const OnPlayerReadyEnter: SinglePlayerTurboEvent<{
    actionArea: string;
    actionAreaIsLobbySection: boolean;
    actionAreaIsPlayerReadyZone: boolean;
    turboState?: ParticipationEnum | undefined;
    nextArea?: {
        actionArea: string;
        actionAreaIsLobbySection: boolean;
        actionAreaIsPlayerReadyZone: boolean;
    } | undefined;
}>;
declare const OnPlayerReadyExit: SinglePlayerTurboEvent<{
    actionArea: string;
    actionAreaIsLobbySection: boolean;
    actionAreaIsPlayerReadyZone: boolean;
    turboState?: ParticipationEnum | undefined;
    nextArea?: {
        actionArea: string;
        actionAreaIsLobbySection: boolean;
        actionAreaIsPlayerReadyZone: boolean;
    } | undefined;
}>;
declare const OnQuestCompleted: SinglePlayerTurboEvent<{
    achievementKey: string;
}>;
declare const OnRewardsEarned: SinglePlayerTurboEvent<{
    rewardsType: string;
    rewardsEarned: number;
}>;
declare const OnRoundStart: SinglePlayerTurboEvent<{
    gameMode?: string | undefined;
    role?: string | undefined;
    roundId?: number | undefined;
    roundName?: string | undefined;
    team?: string | undefined;
}>;
declare const OnRoundEnd: SinglePlayerTurboEvent<{
    turboState: ParticipationEnum;
}>;
declare const OnStageStart: SinglePlayerTurboEvent<{
    gameMode?: string | undefined;
    role?: string | undefined;
    stageId?: number | undefined;
    stageName?: string | undefined;
    team?: string | undefined;
}>;
declare const OnStageEnd: SinglePlayerTurboEvent<{
    turboState: ParticipationEnum;
}>;
declare const OnSectionStart: SinglePlayerTurboEvent<{
    gameMode?: string | undefined;
    role?: string | undefined;
    sectionId?: number | undefined;
    sectionName?: string | undefined;
    team?: string | undefined;
}>;
declare const OnSectionEnd: SinglePlayerTurboEvent<{
    turboState: ParticipationEnum;
}>;
declare const OnTaskStart: SinglePlayerTurboEvent<{
    taskKey: string;
    taskType?: string | undefined;
}>;
declare const OnTaskEnd: SinglePlayerTurboEvent<{
    taskKey: string;
    taskType?: string | undefined;
}>;
declare const OnTaskStepStart: SinglePlayerTurboEvent<{
    taskKey: string;
    taskStepKey: string;
}>;
declare const OnTaskStepEnd: SinglePlayerTurboEvent<{
    taskKey: string;
    taskStepKey: string;
}>;
declare const OnWeaponGrab: SinglePlayerTurboEvent<{
    weaponKey: string;
    weaponType?: string | undefined;
    isRightHand?: boolean | undefined;
}>;
declare const OnWeaponEquip: SinglePlayerTurboEvent<{
    weaponKey: string;
    weaponType?: string | undefined;
    isRightHand?: boolean | undefined;
}>;
declare const OnWeaponRelease: SinglePlayerTurboEvent<{
    weaponKey: string;
    weaponType?: string | undefined;
    isRightHand?: boolean | undefined;
    weaponUsedNumTimes?: number | undefined;
}>;
declare const OnWearableEquip: SinglePlayerTurboEvent<{
    wearableKey: string;
    wearableType?: string | undefined;
}>;
declare const OnWearableRelease: SinglePlayerTurboEvent<{
    wearableKey: string;
    wearableType?: string | undefined;
}>;
declare type MultiPlayerTurboEventFullPayload<TPayload> = TPayload & {
    players: Array<hz.Player>;
};
/** MultiPlayer events are for triggering events for multiple players
 * @remarks often this will handle GameState and then send individual events
 */
declare class MultiPlayerTurboEvent<TPayload> extends BaseTurboEvent<MultiPlayerEventPayload<TPayload>> {
    getID(): string;
    get action(): Action;
    [TurboOnEventSymbol](turboPlayers: Array<TurboPlayer>, payload: MultiPlayerTurboEventFullPayload<TPayload>): void;
}
declare const OnGameRoundStartForPlayers: MultiPlayerTurboEvent<{
    sendPlayerRoundStart: boolean;
    gameStartData?: {
        gameMode?: string | undefined;
        roundName?: string | undefined;
        teamByPlayer?: Map<hz.Player, string> | undefined;
        roleByPlayer?: Map<hz.Player, string> | undefined;
    } | undefined;
}>;
declare const OnGameRoundEndForPlayers: MultiPlayerTurboEvent<{
    sendPlayerRoundEnd: boolean;
}>;
/**
 * A payload sent by the `OnAbilityEquip` {@link TurboEvents | event}.
 */
export declare type AbilityEquipPayload = FullTurboEventPayload<typeof OnAbilityEquip>;
/**
 * A payload sent by the `OnAbilityDequip` {@link TurboEvents | event}.
 */
export declare type AbilityDequipPayload = FullTurboEventPayload<typeof OnAbilityDequip>;
/**
 * A payload sent by the `OnAbilityUsed` {@link TurboEvents | event}.
 */
export declare type AbilityUsedPayload = FullTurboEventPayload<typeof OnAbilityUsed>;
/**
 * A payload sent by the `OnAreaEnter` {@link TurboEvents | event}.
 */
export declare type AreaEnterPayload = FullTurboEventPayload<typeof OnAreaEnter>;
/**
 * A payload sent by the `OnAreaExit` {@link TurboEvents | event}.
 */
export declare type AreaExitPayload = FullTurboEventPayload<typeof OnAreaExit>;
/**
 * A payload sent by the `OnArmorEquip` {@link TurboEvents | event}.
 */
export declare type ArmorEquipPayload = FullTurboEventPayload<typeof OnArmorEquip>;
/**
 * A payload sent by the `OnArmorDequip` {@link TurboEvents | event}.
 */
export declare type ArmorDequipPayload = FullTurboEventPayload<typeof OnArmorDequip>;
/**
 * A payload sent by the `OnCustomAction` {@link TurboEvents | event}.
 */
export declare type CustomEventPayload = FullTurboEventPayload<typeof OnCustomAction>;
/**
 * A payload sent by the `OnDamageEnemy` {@link TurboEvents | event}.
 */
export declare type DamageEnemyPayload = FullTurboEventPayload<typeof OnDamageEnemy>;
/**
 * A payload sent by the `OnDamagePlayer` {@link TurboEvents | event}.
 */
export declare type DamagePlayerPayload = FullTurboEventPayload<typeof OnDamagePlayer>;
/**
 * A payload sent by the `OnDeath` {@link TurboEvents | event}.
 */
export declare type DeathPayload = FullTurboEventPayload<typeof OnDeath>;
/**
 * A payload sent by the `OnDeathByPlayer` {@link TurboEvents | event}.
 */
export declare type DeathByPlayerPayload = FullTurboEventPayload<typeof OnDeathByPlayer>;
/**
 * A payload sent by the `OnDeathByEnemy` {@link TurboEvents | event}.
 */
export declare type DeathByEnemyPayload = FullTurboEventPayload<typeof OnDeathByEnemy>;
/**
 * A payload sent by the `OnDiscoveryMade` {@link TurboEvents | event}.
 */
export declare type DiscoveryMadePayload = FullTurboEventPayload<typeof OnDiscoveryMade>;
/**
 * A payload sent by the `OnFrictionCaused` {@link TurboEvents | event}.
 */
export declare type FrictionCausedPayload = FullTurboEventPayload<typeof OnFrictionCaused>;
/**
 * A payload sent by the `OnFrictionHit` {@link TurboEvents | event}.
 */
export declare type FrictionHitPayload = FullTurboEventPayload<typeof OnFrictionHit>;
/**
 * A payload sent by the `OnKOPlayer` {@link TurboEvents | event}.
 */
export declare type KOPlayerPayload = FullTurboEventPayload<typeof OnKOPlayer>;
/**
 * A payload sent by the `OnKOEnemy` {@link TurboEvents | event}.
 */
export declare type KOEnemyPayload = FullTurboEventPayload<typeof OnKOEnemy>;
/**
 * A payload sent by the `OnLevelUp` {@link TurboEvents | event}.
 */
export declare type LevelUpPayload = FullTurboEventPayload<typeof OnLevelUp>;
/**
 * A payload sent by the `OnPlayerReadyEnter` {@link TurboEvents | event}.
 */
export declare type PlayerReadyEnterPayload = FullTurboEventPayload<typeof OnPlayerReadyEnter>;
/**
 * A payload sent by the `OnPlayerReadyExit` {@link TurboEvents | event}.
 */
export declare type PlayerReadyExitPayload = FullTurboEventPayload<typeof OnPlayerReadyExit>;
/**
 * A payload sent by the `OnQuestCompleted` {@link TurboEvents | event}.
 */
export declare type QuestCompletedPayload = FullTurboEventPayload<typeof OnQuestCompleted>;
/**
 * A payload sent by the `OnRewardsEarned` {@link TurboEvents | event}.
 */
export declare type RewardsEarnedPayload = FullTurboEventPayload<typeof OnRewardsEarned>;
/**
 * A payload sent by the `OnRoundStart` {@link TurboEvents | event}.
 */
export declare type RoundStartPayload = FullTurboEventPayload<typeof OnRoundStart>;
/**
 * A payload sent by the `OnRoundEnd` {@link TurboEvents | event}.
 */
export declare type RoundEndPayload = FullTurboEventPayload<typeof OnRoundEnd>;
/**
 * A payload sent by the `OnSectionStart` {@link TurboEvents | event}.
 */
export declare type SectionStartPayload = FullTurboEventPayload<typeof OnSectionStart>;
/**
 * A payload sent by the `OnSectionEnd` {@link TurboEvents | event}.
 */
export declare type SectionEndPayload = FullTurboEventPayload<typeof OnSectionEnd>;
/**
 * A payload sent by the `OnStageStart` {@link TurboEvents | event}.
 */
export declare type StageStartPayload = FullTurboEventPayload<typeof OnStageStart>;
/**
 * A payload sent by the `OnStageEnd` {@link TurboEvents | event}.
 */
export declare type StageEndPayload = FullTurboEventPayload<typeof OnStageEnd>;
/**
 * A payload sent by the `OnTaskStart` {@link TurboEvents | event}.
 */
export declare type TaskStartPayload = FullTurboEventPayload<typeof OnTaskStart>;
/**
 * A payload sent by the `OnTaskEnd` {@link TurboEvents | event}.
 */
export declare type TaskEndPayload = FullTurboEventPayload<typeof OnTaskEnd>;
/**
 * A payload sent by the `OnTaskStepStart` {@link TurboEvents | event}.
 */
export declare type TaskStepStartPayload = FullTurboEventPayload<typeof OnTaskStepStart>;
/**
 * A payload sent by the `OnTaskStepEnd` {@link TurboEvents | event}.
 */
export declare type TaskStepEndPayload = FullTurboEventPayload<typeof OnTaskStepEnd>;
/**
 * A payload sent by the `OnWeaponGrab` {@link TurboEvents | event}.
 */
export declare type WeaponGrabPayload = FullTurboEventPayload<typeof OnWeaponGrab>;
/**
 * A payload sent by the `OnWeaponEquip` {@link TurboEvents | event}.
 */
export declare type WeaponEquipPayload = FullTurboEventPayload<typeof OnWeaponEquip>;
/**
 * A payload sent by the `OnWeaponRelease` {@link TurboEvents | event}.
 */
export declare type WeaponReleasePayload = FullTurboEventPayload<typeof OnWeaponRelease>;
/**
 * A payload sent by the `OnWearableEquip` {@link TurboEvents | event}.
 */
export declare type WearableEquipPayload = FullTurboEventPayload<typeof OnWearableEquip>;
/**
 * A payload sent by the `OnWearableRelease` {@link TurboEvents | event}.
 */
export declare type WearableReleasePayload = FullTurboEventPayload<typeof OnWearableRelease>;
/**
 * A payload sent by the `OnGameRoundStartForPlayers` multi-player {@link TurboEvents | event}.
 */
export declare type GameRoundStartForPlayersPayload = FullTurboEventPayload<typeof OnGameRoundStartForPlayers>;
/**
 * A payload sent by the `OnGameRoundEndForPlayers` multi-player {@link TurboEvents | event}.
 */
export declare type GameRoundEndForPlayersPayload = FullTurboEventPayload<typeof OnGameRoundEndForPlayers>;
declare const OnAFKEnterTurboEvent: SinglePlayerTurboEvent<{
    actionCustom?: string | undefined;
}>;
declare const OnAFKExitTurboEvent: SinglePlayerTurboEvent<{
    actionCustom?: string | undefined;
}>;
/** Copies a type and converts non-optional props to optional */
declare type Optionalize<T> = {
    [K in keyof T]?: T[K];
};
/**
 * The superset of optional data fields recognized by the Turbo engine.
 *
 * @remarks
 * This type is exported for easier visibility of the fields recognized by the
 * Turbo engine.
 */
export declare type CustomActionData = {
    actionCustom?: string;
    team?: string;
    role?: string;
    gameMode?: string;
    gameRoundName?: string;
    gameRoundId?: string;
    gameRoundActivePlayers?: Array<string>;
    gameState?: GameStateEnum;
} & Optionalize<AbilityEquipPayload> & Optionalize<AbilityDequipPayload> & Optionalize<AbilityUsedPayload> & Optionalize<AFKEnterPayload> & Optionalize<AFKExitPayload> & Optionalize<AreaEnterPayload> & Optionalize<AreaExitPayload> & Optionalize<ArmorEquipPayload> & Optionalize<ArmorDequipPayload> & Optionalize<DamageEnemyPayload> & Optionalize<DamagePlayerPayload> & Optionalize<DeathPayload> & Optionalize<DeathByPlayerPayload> & Optionalize<DeathByEnemyPayload> & Optionalize<DiscoveryMadePayload> & Optionalize<FrictionCausedPayload> & Optionalize<FrictionHitPayload> & Optionalize<KOPlayerPayload> & Optionalize<KOEnemyPayload> & Optionalize<LevelUpPayload> & Optionalize<PlayerReadyEnterPayload> & Optionalize<PlayerReadyExitPayload> & Optionalize<QuestCompletedPayload> & Optionalize<RewardsEarnedPayload> & Optionalize<RoundStartPayload> & Optionalize<RoundEndPayload> & Optionalize<SectionStartPayload> & Optionalize<SectionEndPayload> & Optionalize<StageStartPayload> & Optionalize<StageEndPayload> & Optionalize<TaskStartPayload> & Optionalize<TaskEndPayload> & Optionalize<TaskStepStartPayload> & Optionalize<TaskStepEndPayload> & Optionalize<WeaponGrabPayload> & Optionalize<WeaponEquipPayload> & Optionalize<WeaponReleasePayload> & Optionalize<WearableEquipPayload> & Optionalize<WearableReleasePayload>;
/**
 * Custom Events will send data directly to the Turbo Analytics logging table
 * @remarks NOTE: Custom Events don't guarantee any consistency or conformed consumption
 * and only a restricted set of fields will be logged
 */
declare const OnCustomAction: SinglePlayerTurboEvent<CustomActionData>;
/**
 * The events sent by the {@link Turbo} instance to capture analytics data from
 * a world. This variable defines the events to pass to the `Turbo.send(event, payload)`
 * method and the data fields to use in the payload.
 *
 * @remarks
 * The available payloads are defined in the Type Aliases section of the API
 * documentation. The name of the payload type to use corresponds to the name of
 * the event you send.
 *
 * For example, the `TurboEvents.OnKOPlayer` event is sent
 * with the `KOPlayerPayload` type.
 *
 * The `TurboEvents.OnKOPlayer` event defines the `otherPlayerKilled: string`
 * and the `killedByWeaponKey: string` data fields to use in the {@link KOPlayerPayload}
 * object that you pass to the `Turbo.send(event, payload)` method.
 *
 * However, there is one additional field you must include in each payload: the
 * player. For example `player: this.serverPlayer`.
 *
 * For details about using the `Turbo.send(event, payload)` method, see the
 * {@link Turbo} variable.
 *
 * @example
 * The following example demonstrates how to send the `TurboEvents.OnLevelUp` event
 * with the `LevelUpPayload` type. This is method is typically called from an event
 * listener in your script. As is necessary with other Turbo events, the player field
 * was also added to the payload.
 *
 * ```
 * Turbo.send(TurboEvents.OnLevelUp, {
 *   player: this.serverPlayer,
 *   playerLevel: 10,
 *   playerTitle: `Gladiator`
 * } as LevelUpPayload);
 * ```
 */
export declare const TurboEvents: {
    OnCustomAction: SinglePlayerTurboEvent<CustomActionData>;
    OnAbilityEquip: SinglePlayerTurboEvent<{
        abilityKey: string;
        abilityId?: number | undefined;
        abilitySeconds?: number | undefined;
        abilityCooldownSeconds?: number | undefined;
    }>;
    OnAbilityDequip: SinglePlayerTurboEvent<{
        abilityKey: string;
    }>;
    OnAbilityUsed: SinglePlayerTurboEvent<{
        abilityKey: string;
    }>;
    OnAreaEnter: SinglePlayerTurboEvent<{
        actionArea: string;
        actionAreaIsLobbySection: boolean;
        actionAreaIsPlayerReadyZone: boolean;
        turboState?: ParticipationEnum | undefined;
        nextArea?: {
            actionArea: string;
            actionAreaIsLobbySection: boolean;
            actionAreaIsPlayerReadyZone: boolean;
        } | undefined;
    }>;
    OnAreaExit: SinglePlayerTurboEvent<{
        actionArea: string;
        actionAreaIsLobbySection: boolean;
        actionAreaIsPlayerReadyZone: boolean;
        turboState?: ParticipationEnum | undefined;
        nextArea?: {
            actionArea: string;
            actionAreaIsLobbySection: boolean;
            actionAreaIsPlayerReadyZone: boolean;
        } | undefined;
    }>;
    OnArmorEquip: SinglePlayerTurboEvent<{
        armorBody?: string | undefined;
        armorHelm?: string | undefined;
    }>;
    OnArmorDequip: SinglePlayerTurboEvent<{
        armorBody?: string | undefined;
        armorHelm?: string | undefined;
    }>;
    OnDamagePlayer: SinglePlayerTurboEvent<{
        otherPlayerDamaged: string;
        damageAmount: number;
        damageIsFriendlyFire?: boolean | undefined;
        weaponKey?: string | undefined;
    }>;
    OnDamageEnemy: SinglePlayerTurboEvent<{
        enemyDamaged: string;
        damageAmount: number;
        damageIsFriendlyFire?: boolean | undefined;
        weaponKey?: string | undefined;
    }>;
    OnDeath: SinglePlayerTurboEvent<{
        killedByPlayer: string;
        killedByWeaponKey?: string | undefined;
        killedByEnemy?: boolean | undefined;
    }>;
    OnDeathByPlayer: SinglePlayerTurboEvent<{
        killedByPlayer: string;
        killedByWeaponKey?: string | undefined;
    }>;
    OnDeathByEnemy: SinglePlayerTurboEvent<{
        killedByEnemy: string;
        killedByWeaponKey?: string | undefined;
    }>;
    OnDiscoveryMade: SinglePlayerTurboEvent<{
        discoveryItemKey: string;
        discoveryAmount?: number | undefined;
        discoveryIsImplied?: boolean | undefined;
        discoveryNumTimes?: number | undefined;
        rewardsType?: string | undefined;
        rewardsEarned?: number | undefined;
        weaponKey?: string | undefined;
    }>;
    OnFrictionCaused: SinglePlayerTurboEvent<{
        frictionItemKey: string;
        frictionAmount?: number | undefined;
        frictionIsImplied?: boolean | undefined;
        frictionNumTimes?: number | undefined;
    }>;
    OnFrictionHit: SinglePlayerTurboEvent<{
        frictionItemKey: string;
        frictionAmount?: number | undefined;
        frictionIsImplied?: boolean | undefined;
        frictionNumTimes?: number | undefined;
        affectedPlayerNames?: string[] | undefined;
        afkRoundSeconds?: number | undefined;
        roundNoKillSeconds?: number | undefined;
    }>;
    OnKOPlayer: SinglePlayerTurboEvent<{
        otherPlayerKilled: string;
        killedByWeaponKey: string;
    }>;
    OnKOEnemy: SinglePlayerTurboEvent<{
        enemyKilled: string;
        killedByWeaponKey: string;
    }>;
    OnLevelUp: SinglePlayerTurboEvent<{
        playerLevel: number;
        playerTitle: string;
    }>;
    OnPlayerReadyEnter: SinglePlayerTurboEvent<{
        actionArea: string;
        actionAreaIsLobbySection: boolean;
        actionAreaIsPlayerReadyZone: boolean;
        turboState?: ParticipationEnum | undefined;
        nextArea?: {
            actionArea: string;
            actionAreaIsLobbySection: boolean;
            actionAreaIsPlayerReadyZone: boolean;
        } | undefined;
    }>;
    OnPlayerReadyExit: SinglePlayerTurboEvent<{
        actionArea: string;
        actionAreaIsLobbySection: boolean;
        actionAreaIsPlayerReadyZone: boolean;
        turboState?: ParticipationEnum | undefined;
        nextArea?: {
            actionArea: string;
            actionAreaIsLobbySection: boolean;
            actionAreaIsPlayerReadyZone: boolean;
        } | undefined;
    }>;
    OnQuestCompleted: SinglePlayerTurboEvent<{
        achievementKey: string;
    }>;
    OnRewardsEarned: SinglePlayerTurboEvent<{
        rewardsType: string;
        rewardsEarned: number;
    }>;
    OnRoundStart: SinglePlayerTurboEvent<{
        gameMode?: string | undefined;
        role?: string | undefined;
        roundId?: number | undefined;
        roundName?: string | undefined;
        team?: string | undefined;
    }>;
    OnRoundEnd: SinglePlayerTurboEvent<{
        turboState: ParticipationEnum;
    }>;
    OnSectionStart: SinglePlayerTurboEvent<{
        gameMode?: string | undefined;
        role?: string | undefined;
        sectionId?: number | undefined;
        sectionName?: string | undefined;
        team?: string | undefined;
    }>;
    OnSectionEnd: SinglePlayerTurboEvent<{
        turboState: ParticipationEnum;
    }>;
    OnStageStart: SinglePlayerTurboEvent<{
        gameMode?: string | undefined;
        role?: string | undefined;
        stageId?: number | undefined;
        stageName?: string | undefined;
        team?: string | undefined;
    }>;
    OnStageEnd: SinglePlayerTurboEvent<{
        turboState: ParticipationEnum;
    }>;
    OnTaskStart: SinglePlayerTurboEvent<{
        taskKey: string;
        taskType?: string | undefined;
    }>;
    OnTaskEnd: SinglePlayerTurboEvent<{
        taskKey: string;
        taskType?: string | undefined;
    }>;
    OnTaskStepStart: SinglePlayerTurboEvent<{
        taskKey: string;
        taskStepKey: string;
    }>;
    OnTaskStepEnd: SinglePlayerTurboEvent<{
        taskKey: string;
        taskStepKey: string;
    }>;
    OnWeaponGrab: SinglePlayerTurboEvent<{
        weaponKey: string;
        weaponType?: string | undefined;
        isRightHand?: boolean | undefined;
    }>;
    OnWeaponEquip: SinglePlayerTurboEvent<{
        weaponKey: string;
        weaponType?: string | undefined;
        isRightHand?: boolean | undefined;
    }>;
    OnWeaponRelease: SinglePlayerTurboEvent<{
        weaponKey: string;
        weaponType?: string | undefined;
        isRightHand?: boolean | undefined;
        weaponUsedNumTimes?: number | undefined;
    }>;
    OnWearableEquip: SinglePlayerTurboEvent<{
        wearableKey: string;
        wearableType?: string | undefined;
    }>;
    OnWearableRelease: SinglePlayerTurboEvent<{
        wearableKey: string;
        wearableType?: string | undefined;
    }>;
    OnGameRoundStartForPlayers: MultiPlayerTurboEvent<{
        sendPlayerRoundStart: boolean;
        gameStartData?: {
            gameMode?: string | undefined;
            roundName?: string | undefined;
            teamByPlayer?: Map<hz.Player, string> | undefined;
            roleByPlayer?: Map<hz.Player, string> | undefined;
        } | undefined;
    }>;
    OnGameRoundEndForPlayers: MultiPlayerTurboEvent<{
        sendPlayerRoundEnd: boolean;
    }>;
};
declare enum Duration {
    Both = "both",
    Session = "session",
    LatestInterval = "latestInterval"
}
/**
 * This provides a keyed-Timer that behaves as a stopwatch
 * @remarks Includes the option to reset after hitting a max threshold
 */
declare class TurboTimer {
    key: string;
    running: boolean;
    totalSessionSeconds: number;
    latestIntervalSeconds: number;
    maxSessionSeconds: number;
    constructor(key: string, running: boolean, maxSeconds?: number);
    /** Returns the display string for the timer */
    getDisplay(): string;
    /** Pauses the Timer */
    pauseTimer(): void;
    /** Returns the total duration of the timer in seconds */
    getSeconds(responseType: Duration.Session | Duration.LatestInterval): number;
    /** Sets the timer to running */
    runTimer(): void;
    /** Resets the current interval timer seconds
     * @remarks - current interval measures ticks since the latest 'open' interval began
     */
    resetCurrentIntervalOnly(): void;
    /** Returns the latest interval duration (seconds since latest 'open' interval began) */
    getLatestIntervalSeconds(): number;
    /** Returns the total duration of the timer in the session in seconds */
    getTotalSessionSeconds(): number;
    resetSessionAndInterval(): void;
    /** Updates the timer based on the deltaTime (seconds) */
    update(deltaTime: number): void;
}
/** Used in TurboTimers to determine if only one key can run at a time vs. multiple concurrent keys */
declare enum ConcurrencyType {
    SINGLE = "SINGLE",
    CONCURRENT = "CONCURRENT"
}
/**
 * This class provides an overall Timer and set of key-based timers
 * @remarks Can be leveraged for abstract collections of timers, but is usually scoped to related events
 */
declare class SeenTurboTimer {
    categoryKey: string;
    concurrency: ConcurrencyType;
    overallTimer: TurboTimer;
    seenTimers: Map<string, TurboTimer>;
    maxSeconds: number;
    constructor(categoryKey: string, concurrency: ConcurrencyType, initialKeySingle?: string, initialKeysMulti?: Array<string>, maxSeconds?: number);
    /** Adds multiple timers with associated keys and determines if they will all run immediately */
    addMultiple(keys: Array<string>, running: boolean): void;
    /** Returns the timer associated with the key if it exists */
    getTimer(key: string): TurboTimer | undefined;
    /** Pause all Seen Timers **/
    pauseAllTimers(): void;
    /** Sets the timer with the designated key to active and starts running the timer */
    setActiveAndRun(key: string): void;
    /** Updates overall timer + individual timer keys stored in the map */
    update(deltaTime: number): void;
    /** Adds an individual Turbo timer from the collection or gets an existing one */
    private addTimer;
    /** Conformed String of individual timers as CSV
     * @remarks Used for structured logging output
     **/
    getSnapshotAsString(): string;
    /** Conformed String of individual timers as Array<String>
     * @remarks Used for structured logging output
     **/
    getSnapshotAsArray(): Array<string>;
    hasSeen(key: string): boolean;
    /** Pause an individual Seen Timer based on key **/
    pauseIndividualTimer(key: string): void;
    /** Pauses all timers that are not associated with the key */
    private pauseOtherTimers;
    /** Resets the session and interval for all timers in the collection (full reset) */
    resetAllTimers(): void;
    /** Sets the timer to running and stops others if Timer is defined as Single */
    private runTimer;
}
/** AFKStateData - for action logging */
declare type AFKStateData = {
    isAfk: boolean;
    lastActionTime: number;
    isMarkedForDeletion: boolean;
};
declare class AFKManager {
    private _afkTimer;
    private _afkState;
    constructor();
    /** Returns the current AFK Timer */
    get afkTimer(): TurboTimer;
    /** Returns the current AFK State */
    get afkState(): AFKStateData;
    /** Sets the current AFK State */
    set afkState(newState: AFKStateData);
    /** Returns the # seconds since player was in the world and not AFK */
    get lastSeenSeconds(): number;
    /** Adjusts the AFK State based on entering AFK
     * @remarks includes automatic tracking of the AFK Timers
     */
    onAFKEnter(): void;
    /** Adjusts the AFK State based on returning from AFK */
    onAFKExit(): void;
}
/** Area State Data Shared in different area actions */
declare type AreaStateShared = {
    area: string;
    isLobbySection: boolean;
    isPlayerReadyZone: boolean;
};
/** Area State Data for Area State Machine */
declare type AreaStateData = {
    current: AreaStateShared;
    previous: AreaStateShared;
};
/** Abilities Manager (Superpowers) */
declare class AbilitiesManager {
    private _abilitiesCurrent;
    private _abilitiesSeen;
    private _abilitiesUsed;
    get abilitiesCurrent(): Set<string>;
    get abilitiesSeen(): Map<string, number>;
    get abilitiesUsed(): Map<string, number>;
    onEquip(abilityKey: string): void;
    onDequip(abilityKey: string): void;
    onUsed(abilityKey: string): void;
}
/** Area Manager - Manages the tracking and timers for TurboPlayer Area State */
declare class AreaManager {
    private _areaState;
    private _timerPlayerInWorld;
    private _timerLobbyOverall;
    private _timerAreasSeen;
    constructor(initialArea: string, initialState: ParticipationEnum);
    /** Returns the full area state of the player including current and previous state */
    get areaState(): AreaStateData;
    /** Returns the current area key representing the player's current area */
    get currentAreaState(): AreaStateShared;
    /** Area State Machine
     * @remarks - Note:  Includes transferring the 'current' area to 'previous'
     */
    set currentAreaState(newAreaState: AreaStateShared);
    /** Returns the current area key representing the player's current area */
    get previousArea(): string;
    get previousAreaState(): AreaStateShared;
    set previousAreaState(newAreaState: AreaStateShared);
    /** Returns the SeenTurboTimer for the player's areas seen (key-based timers) */
    get timerAreasSeen(): SeenTurboTimer;
    /** Returns the overall lobby TurboTimer for the player in the world (lobbySecondsOverall) */
    get timerLobbyOverall(): TurboTimer;
    /** Returns the timer for the player in the world (worldSeconds) */
    get timerPlayerInWorld(): TurboTimer;
    /** Returns the total seconds spent in the area by the player
     * @param areaKey - the key of the area to get the seconds for
     * @param type - the type of duration to get (session or latest interval)
     */
    getAreaSeconds(areaKey: string, type: Duration.Session | Duration.LatestInterval): number;
    /** Returns the areas seens (keys) for the player thus far in the session */
    getAreasSeen(): Set<string>;
    /** Returns the number of distinct areas the player has seen
     * @remarks - since areas are tracked by a SeenTurboTimer, this is the number of unique keys
     */
    getAreasSeenCount(): number;
    /** Returns the current area the player is in */
    getCurrentArea(): string;
    getCurrentAreaState(): AreaStateShared;
    /** Returns the total time spent in the lobby session by the player */
    getLobbyOverallSessionSeconds(): number;
    /** Returns the total time spent in this world session by the player */
    getWorldSeconds(): number;
    private initAreaTimers;
}
/** Damage Manager - Manages the tracking of Damage Actions */
declare class DamageManager {
    private _totalDamageDealt;
    /** Returns the amount of damage dealt by the player in the session */
    get totalDamageDealt(): number;
    /** Adds the enemy damage to the total amount */
    onDamageEnemy(damageAmount: number): void;
    /** Adds the player damage to the total amount */
    onDamagePlayer(damageAmount: number): void;
}
/** Heartbeat Manager - Manages the tracking and frequency of Turbo Heartbeat Events */
declare class HeartBeatManager {
    private counter;
    private interval;
    constructor(intervalSeconds: number);
    /** Increments the heartbeat, and resets if we hit the frequency threshold
     * @returns true if we should log heartbeat action
     */
    updateAndCheck(deltaTime: number): boolean;
}
declare enum ProgressionType {
    ROUND = "Round",
    STAGE = "Stage",
    SECTION = "Section"
}
declare class RewardsManager {
    private _level;
    private _title;
    private _rewardsEarnedByType;
    get level(): number;
    get title(): string;
    get rewardsEarnedByType(): Map<string, number>;
    get rewardsSeenKeys(): Array<string>;
    onRewardsEarned(rewardType: string, amount: number): void;
    onLevelChange(level: number): void;
    onTitleChange(title: string): void;
}
/** TurboPlayer - Progression Manager for managing rounds/stages/sections as loops of a game or experience */
declare class PlayerProgressionManager {
    private progressionType;
    private timer;
    private timerFrictionNoKOs;
    private timerWeaponsSeen;
    private _id;
    private name;
    private _kos;
    private _deaths;
    private _attempts;
    constructor(progressionType: ProgressionType, overrideStartId?: number);
    /** Returns the derived name of the current progression or returns provide one if provided
     * @example Round 1, Stage 3, Section 5 - automatic
     * @example Fun Round, Big Boss Stage, Final Section - override
     */
    getName(): string;
    /** Returns the current round id */
    get id(): number;
    get seconds(): number;
    /** Returns the latest Friction No Kos Timer seconds */
    getFrictionNoKOsSeconds(duration: Duration.Session | Duration.LatestInterval): number;
    get kos(): number;
    addKos(kos?: number): void;
    addDeaths(deaths?: number): void;
    get deaths(): number;
    get attempts(): number;
    /** Returns a map of weapon keys seen this cycle + seconds held */
    getWeaponsSeenTime(): Map<string, number>;
    /** Returns a stringified version of the weapons seen and seconds for logging */
    getWeaponsSeenSnapshot(): string;
    /** Ends the round and pauses the round timer (does not clear it) */
    onEnd(): void;
    /** Increments the id (sequence) and Starts the timer
     * @remarks - if override is provided (skip/reset) it will use that instead of incrementing
     */
    onStart(id?: number, name?: string): void;
    /** when equipping a weapon, runs the weapon seen timer for that key */
    onWeaponEquip(weaponKey: string): void;
    /** when releasing a weapon, pause the weapon seen timer */
    onWeaponRelease(weaponKey: string): void;
    /** Reset ko/death stats and timers */
    resetStats(): void;
    /** Returns true if player reaches above a threshold of No Kos seconds
     * @remarks will also reset the timer if it hits the threshold
     */
    checkFrictionNoKOs(): boolean;
    update(deltaTime: number): void;
    private getDefaultName;
    private incrementLevel;
}
/** TurboPlayer - Quests Manager for managing quests and quest completion
 * @remarks to avoid gotchas with the backend, we use the FKA name of 'achievement' since the Action
 * expected is ACHIEVEMENT_UNLOCKED and the data field in the logger is achievementKey
 */
declare class QuestsManager {
    private _questsCompleted;
    get questsCompleted(): Set<string>;
    onCompletedQuest(achievementKey: string): void;
}
/** Tasks Manager is used for managing activities/puzzles/sequences with concurrent SeenTurbo timer collection */
declare class TasksManager {
    private _tasksCollection;
    /** Returns the Task Seen keys and their total session seconds (overall task) */
    getTasksSeen(): Map<string, number>;
    /** Returns the task steps seen and total seconds for a given task key */
    getTaskStepsSeen(taskKey: string): Map<string, number>;
    /** Returns the total task seconds */
    getTaskSeconds(taskKey: string): number;
    /** Returns the total task step seconds */
    getTaskStepSeconds(taskKey: string, taskStepKey: string, duration: Duration.Session | Duration.LatestInterval): number;
    /** Task Start - Begin the task and run the overall timer */
    onStart(taskKey: string): void;
    /** Task End - End the task and pause all step timers */
    onEnd(taskKey: string): void;
    /** Task STEP START - Start the step key timer
     * @remarks won't stop other timers because these are concurrent
     */
    onStepStart(taskKey: string, taskStepKey: string): void;
    /** Task STEP END - End the step key timer */
    onStepEnd(taskKey: string, taskStepKey: string): void;
    private getOrAddTaskSeenTimer;
    /** Update all the Task Timers and their SubTask Timers
     * @remarks - If the Overall Task isn't running, we skip the subtasks for efficiency
     */
    update(deltaTime: number): void;
}
/**
 * TurboPlayer - Weapons Manager for managing weapons inventory and usage
 */
declare class WeaponsManager {
    private _weaponsSeen;
    private _weaponsCurrent;
    private _weaponsCurrentLeft;
    private _weaponsCurrentRight;
    constructor();
    get weaponsSeen(): Map<string, number>;
    get weaponsCurrent(): Set<string>;
    get weaponsCurrentLeft(): Set<string>;
    get weaponsCurrentRight(): Set<string>;
    /** Handles an Equip or Grab weapon action by reflecting in the player's state */
    onEquip(weaponKey: string, isRightHand?: boolean | undefined): void;
    /** Handles a Release or Drop weapon action by reflecting in the player's state
     * @remarks deletes from all current sets just in case.  Each weapon should be unique key
     * and hz Events don't provide handedness on release
     */
    onRelease(weaponKey: string): void;
}
/**
 * TurboPlayer - Main class for managing Turbo Player State
 */
declare class TurboPlayer {
    player: hz.Player;
    lastKnownIndex: number | undefined;
    playerName: string;
    turboState: ParticipationEnum;
    turboStatePrevious: ParticipationEnum;
    abilitiesManager: AbilitiesManager | undefined;
    armorBodyCurrent: Set<string> | undefined;
    armorHelmCurrent: Set<string> | undefined;
    afkManager: AFKManager;
    areaManager: AreaManager;
    damageManager: DamageManager | undefined;
    heartbeatManager: HeartBeatManager;
    hearbeatCounterSeconds: number;
    private actionEventCounters;
    protected _canLogEvents: boolean;
    discoveriesSeen: Map<string, number> | undefined;
    frictionsCaused: Map<string, number> | undefined;
    frictionsSeen: Map<string, number>;
    gameMode: string;
    rewardsManager: RewardsManager | undefined;
    roundManager: PlayerProgressionManager | undefined;
    questsManager: QuestsManager | undefined;
    stageManager: PlayerProgressionManager | undefined;
    sectionManager: PlayerProgressionManager | undefined;
    tasksManager: TasksManager | undefined;
    team: string | undefined;
    role: string | undefined;
    weaponsManager: WeaponsManager | undefined;
    wearablesSeen: Map<string, number>;
    wearablesCurrent: Set<string>;
    constructor(player: hz.Player);
    get canLogEvents(): boolean;
    getAbilitiesSeen(): Map<string, number>;
    getAbilitiesCurrent(): Set<string>;
    getAbilitiesUsed(): Map<string, number>;
    /** Returns the total seconds spent in the area by the player
     * @param areaKey - the key of the area to get the seconds for
     * @param type - the type of duration to get (session or latest interval)
     */
    getAreaSeconds(areaKey: string, type: Duration.Session | Duration.LatestInterval): number;
    /** Returns the areas seens (keys) for the player thus far in the session */
    getAreasSeen(): Set<string>;
    /** Returns the number of distinct areas the player has seen
     * @remarks - since areas are tracked by a SeenTurboTimer, this is the number of unique keys
     */
    getAreasSeenCount(): number;
    /** Returns the current area the player is in */
    getCurrentArea(): string;
    /** Returns the Current area state where the player is in
     * @remarks AreaState is a struct with some properties of the area besides just the key
     */
    getCurrentAreaState(): AreaStateShared;
    /** Returns the Previous Area state (key + attributes) for the player */
    getPreviousAreaState(): AreaStateShared;
    /** Returns the Current Armor Body (keys) for the player */
    getArmorBodyCurrent(): Set<string>;
    /** Returns the Current Armor Helm (keys) for the player */
    getArmorHelmCurrent(): Set<string>;
    /** Returns the duration since player was last seen in the world in seconds */
    getLastSeenSeconds(): number;
    /** Returns the total time spent in the lobby session by the player */
    getLobbyOverallSessionSeconds(): number;
    /** Returns the total time spent in this world session by the player */
    getWorldSeconds(): number;
    /** Returns the map of event counts per Action for the Turbo Player */
    getActionEventCounterMap(): Map<Action, number>;
    /** Returns the amount of damage dealt to each other player */
    getTotalDamageDealt(): number;
    /** Returns the latest interval seconds timer value of no KOs
     * @remarks represents seconds without a KO if in round
     */
    getFrictionNoKosLatestSeconds(): number;
    /** Returns the session seconds timer value of no KOs
     * @remarks represents session-level (most recent, across rounds) seconds without a KO
     */
    getFrictionNoKosSessionSeconds(): number;
    getGameMode(): string;
    /** returns the player's current level (numeric) */
    getPlayerLevel(): number;
    /** Returns the player's current title */
    getPlayerTitle(): string;
    /** Returns the Quests Unlocked by the player */
    getQuestsUnlocked(): Set<string>;
    /** Returns the rewards earned amounts by each type as a full map */
    getRewardsEarnedByType(): Map<string, number>;
    /** Returns the rewards seen keys for the player thus far in the session */
    getRewardsSeenKeys(): Array<string>;
    /** Returns the current role of the player if assigned */
    getRole(): string;
    /** Returns the current round id for the player (subjective sequence id) */
    getRoundId(): number;
    /** Returns the current round name for the player (subjective sequence id) */
    getRoundName(): string;
    /** Returns the current round seconds for the player (subjective sequence id) */
    getRoundSeconds(): number;
    /** Returns the Round Weapons seen and their held seconds for the current round */
    getRoundWeaponsSeenSeconds(): Map<string, number>;
    /** Returns the current round KOs for the player (points/Kos) */
    getRoundKos(): number;
    /** Returns the current deaths for the player (lost points/deaths) */
    getRoundDeaths(): number;
    /** Returns the current stage id for the player (subjective sequence id) */
    getStageId(): number;
    /** Returns the current stage name for the player (subjective sequence id) */
    getStageName(): string;
    /** Returns the current stage seconds for the player (subjective sequence id) */
    getStageSeconds(): number;
    /** Returns the current stage KOs for the player (points/Kos) */
    getStageKos(): number;
    /** Returns the current deaths for the player (lost points/deaths) */
    getStageDeaths(): number;
    /** Returns the stage attempts the player's current stage */
    getStageAttempts(): number;
    /** Returns the current section id for the player (subjective sequence id) */
    getSectionId(): number;
    /** Returns the current section name for the player (subjective sequence id) */
    getSectionName(): string;
    /** Returns the current section seconds for the player (subjective sequence id) */
    getSectionSeconds(): number;
    /** Returns the current section KOs for the player (points/Kos) */
    getSectionKos(): number;
    /** Returns the current deaths for the player (lost points/deaths) */
    getSectionDeaths(): number;
    /** Returns the section attempts the player's current section */
    getSectionAttempts(): number;
    /** Returns the player's Tasks Seen and Seconds */
    getTasksSeen(): Map<string, number>;
    /** Returns the player's Task Steps Seen for a given task and their seconds */
    getTaskStepsSeen(taskKey: string): Map<string, number>;
    /** Returns the total time spent in the task by the player in seconds */
    getTaskSeconds(taskKey: string): number;
    /** Returns the total time spent in the task step by the player in seconds */
    getTaskStepSeconds(taskKey: string, taskStepKey: string): number;
    /** Returns the current team of the player if assigned */
    getTeam(): string;
    /** Retrieves the total event counts for the Turbo Player */
    getTotalEventCounts(): number;
    /** Retrieves the weapons seen by the Turbo Player */
    getWeaponsSeen(): Map<string, number>;
    /** Retrieves the weapons current set of keys for the Turbo Player */
    getWeaponsCurrent(): Set<string>;
    /** Retrieves the weapons current set of keys for the Turbo Player in their right hand */
    getWeaponsCurrentLeft(): Set<string>;
    /** Retrieves the weapons current set of keys for the Turbo Player in their left hand */
    getWeaponsCurrentRight(): Set<string>;
    /** Retrieves the wearables seen map for the Turbo Player */
    getWearablesSeen(): Map<string, number>;
    /** Retrieves the wearables current set of keys for the Turbo Player */
    getWearablesCurrent(): Set<string>;
    /** Rate Limits: Updates for Event Counters and killswitch for TurboPlayer */
    incrementEventCounter(action: Action): void;
    /** Updates the player's state based on the manager's state
     * @remarks WARN: Do not use directly. This is called from the manager's update() method
     */
    update(deltaTime: number): void;
    /** Checks Total Event counts for the Turbo Player and if exceeding a Max, performs a killswitch (bit-flip) */
    private checkSessionRateLimits;
    private getQuotaUsage;
    private sendFrictionNoKOs;
}
/**
 * A set of tools for debugging and testing Turbo implementations.
 *
 * @remarks
 * To use Turbo debugging, you must enable it by setting the
 * {@link ITurboSettings.debug} property to `true`.
 */
export declare class TurboDebug {
    /**
     * An event subscription that delivers enriched analytics payloads to event
     * listeners.
     */
    static events: {
        onDebugTurboPlayerEvent: hz.LocalEvent<{
            player: hz.Player;
            eventData: EventData;
            action: Action;
        }>;
    };
}
declare type GameStateData = {
    gameStateEnum: GameStateEnum;
    gameIsActive: boolean;
    gameRoundId: number;
    gameRoundName: string;
    gameRoundSeconds: number;
    gameRoundActivePlayers: Array<string>;
    gameMode: string;
};
declare const getGameStateSymbol: unique symbol;
declare const sendDebugBroadcastSymbol: unique symbol;
declare const setTurboStateOnExitAFKSymbol: unique symbol;
declare const gameRoundStartSymbol: unique symbol;
declare const gameRoundEndSymbol: unique symbol;
/**
 * TurboManager is the main interface for managing Analytics Events
 */
declare class TurboManager {
    private ready;
    private registeredEntity;
    private _registeredComponent;
    private turboPlayers;
    private configs;
    private secondsSinceLastUpdate;
    private gameStateManager;
    /** Returns the registered component (i.e. Analytics Manager) if registered
     * @remarks useful for sending async events with timeouts
     */
    get registeredComponent(): hz.Component | undefined;
    /** Registers and binds Turbo to lifecycle of the component
     * @param component - the component to register Turbo to
     * @returns true if successfully registered, false if already registered
     * @remarks This method should be called in the component's start() method
     */
    register(component: hz.Component, configs: Partial<ITurboSettings>): boolean;
    /** Returns the current Turbo Configs set */
    getConfigs(): ITurboSettings;
    /** Debug - broadcasts event with the final payload for downstream consumers after each action */
    [sendDebugBroadcastSymbol](player: hz.Player, eventData: EventData, action: Action): void;
    /** Set Turbo Configs - default settings + overrides */
    private setConfigs;
    /** Gets TurboPlayer from map */
    protected getTurboPlayer(player: hz.Player): TurboPlayer | undefined;
    /** Returns the world seconds for the player */
    getWorldSeconds(player: hz.Player): number;
    /** Turbo is enabled and is ready to receive events */
    isReady(): boolean;
    [getGameStateSymbol](): GameStateData;
    protected getGameState(): GameStateData;
    protected set gameState(data: GameStateData);
    private setTurboState;
    private getHeartbeatCustomAction;
    /** Sets the turboPlayer's Participation State (turboState) based on heuristics */
    [setTurboStateOnExitAFKSymbol](player: hz.Player): void;
    /** Main Turbo Event Handler for TurboPlayer State Management and Turbo Analytics Logging */
    send<TPayload, TPayloadArg extends TPayload>(event: BaseTurboEvent<TPayload>, payload: TPayloadArg extends TPayload ? TPayload extends TPayloadArg ? TPayloadArg : TPayload : TPayload): boolean;
    /** TurboDataService - returns the number of currently tracked players  */
    protected getTurboPlayerCount(): number;
    /** Game Round Start - starts the game-level round timer and increments the round id and related state
     * @remarks - includes option to generate the round start event for specfied players
     */
    [gameRoundStartSymbol](players: Array<hz.Player>, sendPlayerRoundStart?: boolean, gameStartData?: {
        gameMode?: string;
        roundName?: string;
        teamByPlayer?: Map<hz.Player, string>;
        roleByPlayer?: Map<hz.Player, string>;
    }): boolean;
    /** */
    [gameRoundEndSymbol](playersLeftInRound: Array<hz.Player>, sendPlayerRoundEnd?: boolean): void;
    private subscribeToEvents;
    /** Adds all existing players to Turbo in case they entered before registration */
    private addExistingPlayers;
    /** Creates a TurboPlayer and adds to map */
    private createTurboPlayer;
    /** Removes TurboPlayer from map */
    private removeTurboPlayer;
    /** Retrieves a TurboPlayer from the map or creates one as needed  */
    protected getOrCreateTurboPlayer(player: hz.Player): TurboPlayer;
    /** AFK Enter - Automatic */
    private onAFKEnter;
    /** AFK Exit - Automatic */
    private onAFKExit;
    /** WORLD ENTER: Adds player  */
    private onWorldEnter;
    /** WORLD EXIT: Removes player */
    private onWorldExit;
    /** Timer updates from AnalyticsManager - subscribed to hz.World.onUpdate() */
    private tick;
    private sendHeartbeat;
    /** Updates TurboManager internal game state  */
    private updateSelf;
    /** Updates all players in the map and other config-based updates */
    private updatePlayers;
}
/**
 * TurboDataStore data access patterns to get live data from the Turbo Engine
 */
declare class TurboDataServiceClass {
    /** For Rate Limiting - determines if additional events can be logged for the player */
    canPlayerLogEvents(player: hz.Player): boolean;
    /** Retrieves the Total Event Counts for the player */
    getTotalEventCounts(player: hz.Player): number;
    /** Retrieves the Action Event Counts for the player */
    getActionCounts(player: hz.Player, action: Action): number;
    getWorldSeconds(player: hz.Player): number;
    /** Returns the Abilities Seen Map for the player */
    getAbilitiesSeen(player: hz.Player): Map<string, number>;
    /** Returns the Abilities Used Map for the player */
    getAbilitiesUsed(player: hz.Player): Map<string, number>;
    /** Returns the Current Abilities (keys) for the player */
    getAbilitiesCurrent(player: hz.Player): Array<string>;
    /** Returns the Current Armor Body (keys) for the player */
    getArmorBodyCurrent(player: hz.Player): Array<string>;
    /** Returns the Current Armor Helm (keys) for the player */
    getArmorHelmCurrent(player: hz.Player): Array<string>;
    /** Returns the Areas Seen (keys) for the player thus far in the session */
    getAreasSeen(player: hz.Player): Set<string>;
    /** Returns the number of times a player has seen a specific friction item */
    getAreasSeenCount(player: hz.Player): number;
    /** Returns the total seconds the player has spent in the area this session */
    getAreaSessionSeconds(player: hz.Player, area: string): number;
    /** Returns the seconds the player has spent in the area in their latest interval (most recent or current) */
    getAreaLatestIntervalSeconds(player: hz.Player, area: string): number;
    /**Get the current area (key/name) for the player  */
    getCurrentArea(player: hz.Player): string;
    /** Returns the Discoveries Seen Map for the player */
    getDiscoveriesSeen(player: hz.Player): Map<string, number>;
    /** Returns the number of times a player has seen a specific discovery item */
    getDiscoveryItemSeenCount(player: hz.Player, discoveryItemKey: string): number;
    /** Returns the Frictions Seen Map for the player */
    getFrictionsSeen(player: hz.Player): Map<string, number>;
    /** Returns the Frictions Caused Seen Map for the player */
    getFrictionCausedSeen(player: hz.Player): Map<string, number>;
    /** Returns the number of times a player has seen a specific friction item */
    getFrictionItemSeenCount(player: hz.Player, frictionItemKey: string): number;
    /** Returns the current 'turboState' of the player (lobby, game, etc)
     * @remarks 'turboState' is the logging field in Meta's backend represented by a ParticipationEnum
     * the nomenclature uses the original name to ensure transmission isn't lost */
    getParticipationState(player: hz.Player): ParticipationEnum;
    /** Returns the total session time a player has been AFK (in seconds) */
    getAFKSessionSeconds(player: hz.Player): number;
    /** Returns the total amount of damage dealt in the session */
    getTotalDamageDealt(player: hz.Player): number;
    /** Returns the latest interval seconds timer value of no KOs
     * @remarks represents seconds without a KO if in round
     */
    getFrictionNoKosLatestSeconds(player: hz.Player): number;
    /** Returns the session seconds timer value of no KOs
     * @remarks represents session-level (most recent, across rounds) seconds without a KO
     */
    getFrictionNoKosSessionSeconds(player: hz.Player): number;
    /** Returns the player's game mode
     * @remarks Game mode can be unique per player, but is commonly shared by all players
     * within a round at the GameManager level
     */
    getGameMode(player: hz.Player): string;
    /** Returns the overall game state from Game Manager shared across players */
    getGameStateEnum(): GameStateEnum;
    /** Returns the overall game round Id from Game Manager since session start */
    getGameRoundId(): number;
    /** Returns the overall game round name from Game Manager since session start */
    getGameRoundName(): string;
    /** Returns whether a game/round is active regardless of player participation */
    isGameActive(): boolean;
    /** Returns the list of game round active player names */
    getGameRoundActivePlayers(): Array<string>;
    /** Returns the game round duration in seconds (game clock) regardless of player time spent */
    getGameRoundSeconds(): number;
    /** Returns the total seconds the player has spent in the lobby overall this session */
    getLobbyOverallSeconds(player: hz.Player): number;
    /** Returns the current player level */
    getPlayerLevel(player: hz.Player): number;
    /** Returns the current player title */
    getPlayerTitle(player: hz.Player): string;
    /** Returns the Quests unlocked (keys) by the player in the session */
    getQuestsUnlocked(player: hz.Player): Array<string>;
    /** Returns the map of Rewards earned by the player x type */
    getRewardsEarnedByType(player: hz.Player): Map<string, number>;
    /** Returns the list of reward types 'seen' (earned) by the player */
    getRewardsSeenKeys(player: hz.Player): Array<string>;
    /** Returns the player's current role */
    getRole(player: hz.Player): string;
    /** Returns the player's latest subjective participating round id
     * @remarks if round is inactive, will represent 'latest' */
    getRoundId(player: hz.Player): number;
    /** Returns the player's latest round name
     * @remarks if not provided/named will default to 'Round ' + roundId
     */
    getRoundName(player: hz.Player): string;
    /** Returns the player's round KO/scores count */
    getRoundKOs(player: hz.Player): number;
    /** Returns the player's round deaths/losses count */
    getRoundDeaths(player: hz.Player): number;
    /** Returns the player's current round seconds */
    getRoundSeconds(player: hz.Player): number;
    /** Returns the Map of Round Weapons held seconds for the player */
    getRoundWeaponsSeenSeconds(player: hz.Player): Map<string, number>;
    /** Returns the player's latest subjective participating stage id
     * @remarks if stage is inactive, will represent 'latest' */
    getStageId(player: hz.Player): number;
    /** Returns the player's latest stage name
     * @remarks if not provided/named will default to 'Stage ' + stageId
     */
    getStageName(player: hz.Player): string;
    /** Returns the player's stage KO/scores count */
    getStageKOs(player: hz.Player): number;
    /** Returns the player's stage deaths/losses count */
    getStageDeaths(player: hz.Player): number;
    /** Returns the player's current stage seconds */
    getStageSeconds(player: hz.Player): number;
    /** Returns the player's stage attempts/trials for the current stage */
    getStageAttempts(player: hz.Player): number;
    /** Returns the player's latest subjective participating section id
     * @remarks if section is inactive, will represent 'latest' */
    getSectionId(player: hz.Player): number;
    /** Returns the player's latest section name
     * @remarks if not provided/named will default to 'Section ' + sectionId
     */
    getSectionName(player: hz.Player): string;
    /** Returns the player's section KO/scores count */
    getSectionKOs(player: hz.Player): number;
    /** Returns the player's section deaths/losses count */
    getSectionDeaths(player: hz.Player): number;
    /** Returns the player's current section seconds */
    getSectionSeconds(player: hz.Player): number;
    /** Returns the player's section attempts/trials for the current section */
    getSectionAttempts(player: hz.Player): number;
    /** Returns the player's Tasks Seen and Seconds */
    getTasksSeen(player: hz.Player): Map<string, number>;
    /** Returns the player's Task Steps Seen for a given task and their seconds */
    getTaskStepsSeen(player: hz.Player, taskKey: string): Map<string, number>;
    /** Returns the total time spent in the task by the player in seconds */
    getTaskSeconds(player: hz.Player, taskKey: string): number;
    /** Returns the total time spent in the task step by the player in seconds */
    getTaskStepSeconds(player: hz.Player, taskKey: string, taskStepKey: string): number;
    /** Returns the player's current team */
    getTeam(player: hz.Player): string;
    /** Returns the number of times a weapon has been 'seen' (equipped) by the player */
    getWeaponsSeen(player: hz.Player): Map<string, number>;
    /** Returns the current list of weapon keys equipped by the player */
    getWeaponsCurrent(player: hz.Player): Array<string>;
    /** Returns the current list of weapon keys equipped by the player in their left hand */
    getWeaponsCurrentLeft(player: hz.Player): Set<string>;
    /** Returns the current list of weapon keys equipped by the player in their right hand */
    getWeaponsCurrentRight(player: hz.Player): Set<string>;
    /** Returns the Map of Wearables seen in the session by the player */
    getWearablesSeen(player: hz.Player): Map<string, number>;
    /** Returns the number of times a wearable has been 'seen' (equipped) by the player */
    getWearableSeenCount(player: hz.Player, wearableKey: string): number;
    /** Returns the Array of Wearables seen (keys) in the session by the player */
    getWearablesCurrent(player: hz.Player): Array<string>;
    /** Returns whether or not the player is currrently AFK */
    isPlayerAFK(player: hz.Player): boolean;
    /** Returns whether or not a player is marked for deletion */
    isPlayerMarkedForDeletion(player: hz.Player): boolean;
    private getTurboPlayer;
}
/**
 * A service that retrieves live Turbo analytics data for maintaining
 * statistics and performing debugging.
 */
export declare const TurboDataService: TurboDataServiceClass;
/**
 * Represents an analytics managers for sending analytics data to the In-World Analytics system
 * for logging. This variable is a shared instance of the `TurboManager` class.
 *
 * @remarks
 * The `Turbo` instance is used to implement an analytics manager in TypeScript for sending
 * analytics events directly to the server for logging.
 *
 * The `Turbo` instance provides several important methods to call from your
 * analytics manager: the `Turbo.register(component, configs)` and
 * `Turbo.send(event, payload)` methods.
 *
 * Before using the `Turbo` instance to create an analytics manager, you must complete
 * these steps:
 *
 * 1. In Desktop Editor, enable the horizon/analytics setting in Script
 * Settings.
 *
 * 2. Optional but helpful: In Desktop Editor, enable TurboAnalytics in the Asset Library.
 *
 * 3. Add an {@link core#Entity | entity} to your world that you can attach to the
 * the Analytics API in your script. This can be an empty entity.
 *
 * To create your analytics manager, do the following in your script:
 *
 * 1. Create a class for your analytics manager by extending the {@link core#Component} class.
 *
 * 3. If you aren't using the {@link TurboDefaultSettings | default}
 * Turbo settings, configure the analytics categories you want to capture in
 * the {@link ITurboSettings} interface.
 *
 * 4. In a script, register your analytics manager with the Turbo interface by calling
 * the `Turbo.register(component, configs)` method. When you call this method, pass in your component and Turbo
 * settings.
 *
 * 5. Add `Turbo.send(event, payload)` calls to the event subscriptions that you want to log with
 * In-World Analytics. When you call this method, pass in the event name from the {@link TurboEvents} variable and the payload
 * objects to log. For available payloads, see the Type Alias section of the API documentation. The
 * name of the payload type will correspond to the event name in the  {@link TurboEvents} variable.
 *
 * 6. Add a `player: string` field to the payload. For example `player: this.serverPlayer`. This
 * field is not defined in {@link TurboEvents} because it is defined in the underlying type, so it
 * is required.
 *
 * For more information on using In-World Analytics, see the
 * {@link https://developers.meta.com/horizon-worlds/learn/documentation/performance-best-practices-and-tooling/advanced/using-in-world-analytics | In-World Analytics} guide.
 *
 * @example
 * This example script implements a custom analytics manager that sends the OnAreaEnter event
 * when the current player enters the lobby area of the world.
 * ```
 * import * as hz from 'horizon/core';
 * import {Turbo, TurboDefaultSettings, TurboEvents, AreaEnterPayload} from 'horizon/analytics';
 *
 * // Creates the analytics event to send.
 * export const areaEntered = new hz.LocalEvent<{ player: hz.Player, area: string }>("areaEntered");
 *
 * // Creates an analytics manager.
 * export class AnalyticsManager extends hz.Component {
 *  static propsDefinition = {
 *    overrideDebug: { type: hz.PropTypes.Boolean, default: false },
 *  };
 *  static s_instance: AnalyticsManager;
 *  serverPlayer!: hz.Player;
 *  serverPlayerID!: number;
 *  overrideDebug!: boolean;
 *
 *  start() {
 *    // Registers the analytics manager with the Turbo interface.
 *    Turbo.register(this, TurboDefaultSettings);
 *    AnalyticsManager.s_instance = this;
 *    this.subscribeToEvents();
 *   }
 *
 *  // You can group event subscriptions in this method.
 *  private subscribeToEvents() {
 *    // Creates the event payload to send.
 *    const areaEnterPayload: AreaEnterPayload = {
 *      actionArea: `CombatTutorial`,
 *      actionAreaIsLobbySection: false,
 *      actionAreaIsPlayerReadyZone: true,
 *      turboState: ParticipationEnum.IN_ROUND,
 *      nextArea: {
 *        actionArea: `Stage1`,
 *        actionAreaIsLobbySection: false,
 *        actionAreaIsPlayerReadyZone: true,
 *      },
 *      player: this.serverPlayer
 *    };
 *
 *    // The event subscription to track.
 *    this.connectLocalBroadcastEvent(areaEntered, (data) => {
 *      // This call sends the analytics event for logging.
 *      Turbo.send(TurboEvents.OnAreaEnter, areaEnterPayload);
 *  }
 * }
 * ```
 */
export declare const Turbo: TurboManager;
export {};

}