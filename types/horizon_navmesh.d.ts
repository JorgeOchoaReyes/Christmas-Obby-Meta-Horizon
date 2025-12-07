declare module 'horizon/navmesh' {
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
import { Entity, HorizonProperty, ReadableHorizonProperty, Vec3, World } from 'horizon/core';
/**
 * The name of the API.
 */
export declare const ApiName = "navmesh";
/**
 * The collision data returned when a raycast is performed on a {@link NavMesh}
 * object by the {@link NavMesh.raycast} method.
 *
 * @remarks Variables:
 *
 * position: The ending location where the raycast collided with the
 * NavMesh.
 *
 * normal: The normal vector at the point of impact for the raycast.
 *
 * distance: The distance traveled when the raycast was performed.
 *
 * hit: true if the raycast hit any obstructions or edges during the
 * calculation; otherwise, false.
 *
 * navMesh: The NavMesh the raycast was performed on.
 */
export declare type NavMeshHit = {
    position: Vec3;
    normal: Vec3;
    distance: number;
    hit: boolean;
    navMesh: INavMesh;
};
/**
 * Defines the pathfinding calculation results retrieved by the
 * {@link NavMesh.getPath} property.
 *
 * @remarks Variables:
 *
 * waypoints: The list of waypoints for the generated path.
 *
 * startPos: The origin point for the generated path.
 *
 * endPos: The terminal point for the generated path. This might not be the same
 * as the query destination.
 *
 * destinationPos: The requested terminal point for the generated path. This may
 * not be reachable, and can differ from endPos.
 *
 * pathReachesDestination: true if the endPos reaches the destinationPos, false
 * if an incomplete path is returned.
 */
export declare type NavMeshPath = {
    /**
     * The list of waypoints for the generated path.
     */
    waypoints: Vec3[];
    /**
     * The origin point for the generated path.
     */
    startPos: Vec3;
    /**
     * The terminal point for the generated path. This might not be the same
     * as the query destination.
     */
    endPos: Vec3;
    /**
     * The requested terminal point for the generated path. This may
     * not be reachable, and can differ from endPos.
     */
    destinationPos: Vec3;
    /**
     * true if the endPos reaches the destinationPos, false if an incomplete
     * path is returned.
     */
    pathReachesDestination: boolean;
};
/**
 * The configuration for a navigation {@link NavMesh.profile}.
 *
 * @remarks Variables:
 *
 * typeId: The Unique ID for this profile type (provided by the backend
 * server).
 *
 * name: The name of the profile entity in World Builder.
 *
 * color: The color of the given profile as defined in World Builder.
 *
 * agentRadius: The radius for the agent's navmesh calculations.
 *
 * agentMaxSlope: The maximum angle on a slope the agent can traverse.
 *
 * navMesh: The NavMesh the agent is running a calculation against.
 */
export declare type NavMeshProfile = {
    typeId: number;
    name: string;
    color: string;
    agentRadius: number;
    agentMaxSlope: number;
    navMesh: INavMesh;
};
/**
 * Detailed information about a waypoint returned by the {@link navmesh.getPathAlongSurface}
 * method. Contains both position and normal data.
 */
export declare type NavMeshWaypoint = {
    position: Vec3;
    normal: Vec3;
};
/**
 * Defines the pathfinding calculation results for the {@link navmesh.getPathAlongSurface}
 * property. This contains slightly more information than the {@link Navmesh.getPath} property.
 *
 * @remarks
 * Variables:
 *
 * waypoints: The list of waypoints for the generated path. Contains position and normal data.
 *
 * startPos: The origin point for the generated path.
 *
 * endPos: The terminal point for the generated path. This might not be the same
 * as the query destination.
 *
 * destinationPos: The requested terminal point for the generated path. This may
 * not be reachable, and can differ from endPos.
 *
 * pathReachesDestination: true if the endPos reaches the destinationPos, false
 * if an incomplete path is returned.
 */
export declare type NavMeshDetailedPath = Omit<NavMeshPath, 'waypoints'> & {
    /**
     * The generated path waypoints for this query. It's possible this array is empty,
     * or it may not reach the actual destination.
     */
    waypoints: NavMeshWaypoint[];
};
/**
 * The possible state values for the {@link NavMeshInstanceInfo} type.
 */
export declare enum NavMeshState {
    /**
     * The instance hasn't been initialized yet.
     */
    Uninitialized = "Uninitialized",
    /**
     * Details are being loaded for this navigation mesh.
     */
    Loading = "Loading",
    /**
     * The instance is initialized and ready to use.
     */
    Ready = "Ready",
    /**
     * The navigation mesh is being rebuilt.
     */
    Baking = "Baking"
}
/**
 * Data about the {@link NavMesh.getState | state} of a {@link NavMesh} instance.
 *
 * @remarks Variables:
 *
 * profile: The current navigation profile associated with the navigation mesh.
 *
 * currentBake: A promise that contains the result of the current rebuild
 * operation of the navigation mesh; otherwise, null.
 *
 * state: The state of the navigation mesh instance, such as whether it is ready
 * to use or being rebuilt.
 */
export declare type NavMeshInstanceInfo = {
    profile: NavMeshProfile;
    currentBake: Promise<boolean> | null;
    state: NavMeshState;
};
/**
 * Data about a {@link NavMesh.rebuild} call on a {@link NavMesh} object.
 *
 * @remarks Variables:
 *
 * - success: true if the rebuild operation of the navigation mesh succeeds;
 * otherwise, false.
 */
export declare type NavMeshBakeInfo = {
    success: boolean;
};
/**
 * A reference to a navigation mesh instance, which scripts can use to query
 * paths, raycasts, and nearest points. Each NavMesh instance represents a profile
 * already defined in the editor; you can't define or modify profiles at runtime.
 * As such, the NavMesh class is considered read-only.
 *
 * @remarks There can only be one instance of a given NavMesh for each profile.
 * For example, if multiple scripts retrieve the same reference, their operations
 * are performed on the same NavMesh instance. This ensures your NavMesh reference
 * can be safely passed between elements such as classes and functions.
 *
 * For information about usage, see the
 * {@link https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/npcs/navigation-mesh-generation | NavMesh generation} guide.
 */
export interface INavMesh {
    /**
     * The attached profile for this NavMesh instance.
     */
    profile: NavMeshProfile;
    /**
     * Calculates any viable or partially-viable path between a start position and
     * target destination.
     *
     * @remarks If either the start position or destination position
     * don't lie on the given NavMesh, no path is returned. If both points lie on
     * the mesh but don't have a viable path between them, a partial path is
     * returned with waypoints from the start position to the closest possible
     * point to the destination.
     *
     * We recommend using the {@link getNearestPoint} method to filter the parameters
     * for this method, so the start and target paths are always valid.
     *
     * @param start - The starting position of the desired path.
     * @param destination - The target destination of the desired path.
     *
     * @returns A NavMeshPath object containing the path information. Otherwise,
     * if there's no path available, returns null.
     */
    getPath(start: Vec3, destination: Vec3): null | NavMeshPath;
    /**
     * Calculates any viable or partially-viable path between a start position and
     * target destination, returning significant waypoints which are aligned with
     * the underlying geometry surface.
     *
     * @remarks Output is similar to {@link getPath}, but returns more detailed
     * waypoint information. This is slightly more computationally expensive than
     * {@link getPath}.
     *
     * We recommend using {@link getPath} instead when the returned waypoint output is
     * used in conjunction with other NavMesh APIs such as {@link raycast}.
     */
    getPathAlongSurface(start: Vec3, destination: Vec3): null | NavMeshDetailedPath;
    /**
     * Performs a raycast from an origin position that travels in the given
     * direction along the navigation mesh. The ray travels until it has either hit
     * something or reaches the max range.
     *
     * You can use this function to check if an agent can walk unobstructed between
     * two points on the NavMesh.
     *
     * @remarks This raycast is different from a physics ray cast because it works
     * in 2.5D on the navigation mesh. A NavMesh raycast can detect all kinds of
     * navigation obstructions, such as holes in the ground, and can also climb up
     * slopes if the area is navigable. A physics raycast, in comparison, typically
     * travels linearly through 3D space.
     *
     * @param origin - The starting position of the raycast.
     * @param direction - The direction for the raycast to travel in 3D space.
     * @param range - The maximum distance the raycast should travel.
     *
     * @returns Data about the raycast calculation, such as if a collision occurred
     * and the distance from the origin.
     */
    raycast(origin: Vec3, direction: Vec3, range: number): NavMeshHit;
    /**
     * Performs a raycast between a start and end position on a navigation mesh.
     *
     * @remarks This raycast is different from a physics ray cast because it works
     * in 2.5D on the navigation mesh. A NavMesh raycast can detect all kinds of
     * navigation obstructions, such as holes in the ground, and can also climb up
     * slopes if the area is navigable. A physics raycast, in comparison, typically
     * travels linearly through 3D space.
     *
     * @param startPoint - The start position of the raycast.
     * @param endPoint - The destination of the raycast.
     *
     * @returns Data about the raycast calculation, such as if a collision occurred
     * and the distance from the origin.
     */
    raycast(startPoint: Vec3, endPoint: Vec3): NavMeshHit;
    /**
     * Gets the nearest point on the navigation mesh within the range of the target
     * position, even if the target isn't on the navigation mesh.
     *
     * @remarks This is useful for filtering input parameters for other NavMesh
     * queries. For example, if we want to navigate towards a player that is
     * standing on a box (and therefore off the NavMesh), we can use this call to
     * find the closest valid position for a NavMesh query.
     *
     * @param position - The target position to check for the nearest point.
     * @param range - The maximum distance for the calculation.
     *
     * @returns The nearest Vec3 position within the range, or null if no point is
     * available.
     */
    getNearestPoint(position: Vec3, range: number): null | Vec3;
    /**
     * Requests that the server rebuilds the navigation mesh.
     *
     * @remarks
     * This allows you to rebuild a navigation profile's mesh at runtime in order
     * to respond to loading and placing assets or as a result of an obstacle in the
     * world moving.
     *
     * @returns A promise containing the result of the rebake request.
     */
    rebake(): Promise<NavMeshBakeInfo>;
    /**
     * Gets information about the navmesh instance, such as its profile and
     * current bake status.
     */
    getStatus(): NavMeshInstanceInfo;
}
/**
 * Stores and retrieves references to {@link NavMesh} instances.
 *
 * @remarks {@link NavMesh} instances are cached to ensure that retrieving their
 * profile multiple times with a script only generates one class reference. This is
 * useful for updating navigation mesh profiles at runtime.
 */
export default class NavMeshManager {
    world: World;
    private cache;
    private static worldDirectories;
    /**
     * Gets a NavMeshManager directory that stores the references to {@link NavMesh}
     * instances.
     */
    static getInstance(world: World): NavMeshManager;
    private constructor();
    /**
     * Gets a set of {@link NavMeshReference} instances from the cache.
     */
    getNavMeshes: () => Promise<NavMesh[]>;
    /**
     * Gets a reference to a {@link NavMeshReference} instance based on a
     * profile name.
     *
     * @remarks If no matching profile is found, returns `null`.
     */
    getByName: (name: string) => Promise<NavMesh | null>;
}
/**
 * A reference to a navigation mesh instance, which scripts can use to query paths, raycasts, and
 * nearest points. Each NavMesh instance represents a profile already defined in the editor; you
 * can't define or modify profiles at runtime. As such, the NavMesh class is considered read-only.
 *
 * @remarks There can only be one instance of a given NavMesh for each profile. For example, if
 * multiple scripts retrieve the same reference, their operations are performed on the same
 * NavMesh instance. This ensures your NavMesh reference can be safely passed between elements
 * such as classes and functions.
 *
 * For information about usage, see the
 * {@link https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/npcs/navigation-mesh-generation | NavMesh generation} guide.
 */
export declare class NavMesh implements INavMesh {
    /**
     * The attached profile for this NavMesh instance.
     */
    profile: NavMeshProfile;
    private state;
    private initializationPromise;
    private currentBakePromise;
    constructor(profileData: Partial<NavMeshProfile>);
    private requestInitialState;
    /**
     * Requests that the server rebuilds the navigation mesh.
     *
     * This allows you to rebuild a navigation profile's mesh at runtime in order
     * to respond to loading and placing assets or as a result of an obstacle in the
     * world moving.
     *
     * @returns A promise containing the result of the rebake request.
     */
    rebake: () => Promise<{
        success: boolean;
    }>;
    /**
     * Calculates any viable or partially-viable path between a start position and
     * target destination.
     *
     * @remarks If either the start position or destination position
     * don't lie on the given NavMesh, no path is returned. If both points lie on
     * the mesh but don't have a viable path between them, a partial path is
     * returned with waypoints from the start position to the closest possible
     * point to the destination.
     *
     * We recommend using the {@link getNearestPoint} method to filter the parameters
     * for this method, so the start and target paths are always valid.
     *
     * @param start - The starting position of the desired path.
     * @param end - The target destination of the desired path.
     *
     * @returns A NavMeshPath object containing the path information. Otherwise,
     * if there's no path available, returns null.
     */
    getPath: (start: Vec3, end: Vec3) => NavMeshPath | null;
    /**
     * Calculates any viable or partially-viable path between a start position and
     * target destination, returning significant waypoints which are aligned with
     * the underlying geometry surface.
     *
     * @remarks Output is similar to {@link getPath}, but returns more detailed
     * waypoint information. This is slightly more computationally expensive than
     * {@link getPath}.
     *
     * We recommend using {@link getPath} instead when the returned waypoint output is
     * used in conjunction with other NavMesh APIs such as {@link raycast}.
     *
     * @param start - The starting position of the desired path.
     * @param end - The target destination of the desired path.
     *
     * @returns A NavMeshPath object containing detailed path information. Otherwise,
     * if there's no path available, returns null.
     */
    getPathAlongSurface: (start: Vec3, end: Vec3) => NavMeshDetailedPath | null;
    /**
     * Performs a raycast between a start and end position on a navigation mesh.
     *
     * @remarks This raycast is different from a physics ray cast because it works
     * in 2.5D on the navigation mesh. A NavMesh raycast can detect all kinds of
     * navigation obstructions, such as holes in the ground, and can also climb up
     * slopes if the area is navigable. A physics raycast, in comparison, typically
     * travels linearly through 3D space.
     *
     * @param startPoint - The start position of the raycast.
     * @param endPoint - The destination of the raycast.
     *
     * @returns Data about the raycast calculation, such as if a collision occurred
     * and the distance from the origin.
     */
    raycast(startPoint: Vec3, endPoint: Vec3): NavMeshHit;
    /**
     * Performs a raycast from an origin position that travels in the given
     * direction along the navigation mesh. The ray travels until it has either hit
     * something or reaches the max range.
     *
     * @remarks This raycast is different from a physics ray cast because it works in
     * 2.5D on the navigation mesh. A NavMesh raycast can detect all kinds of navigation
     * obstructions, such as holes in the ground, and can also climb up slopes if
     * the area is navigable. A physics raycast, in comparison, typically travels
     * linearly through 3D space.
     *
     * You can use this function to check if an agent can walk unobstructed between
     * two points on the NavMesh.
     *
     * @param origin - The starting position of the raycast.
     * @param direction - The direction for the raycast to travel in 3D space.
     * @param range - The maximum distance the raycast should travel.
     *
     * @returns Data about the raycast calculation, such as if a collision occurred
     * and the distance from the origin.
     */
    raycast(origin: Vec3, direction: Vec3, range: number): NavMeshHit;
    /**
     * Gets the nearest point on the navigation mesh within the range of the target
     * position, even if the target isn't on the navigation mesh.
     *
     * @remarks This is useful for filtering input parameters for other NavMesh
     * queries. For example, if we want to navigate towards a player that is
     * standing on a box (and therefore off the NavMesh), we can use this call to
     * find the closest valid position for a NavMesh query.
     *
     * @param position - The target position to check for the nearest point.
     * @param range - The maximum distance for the calculation.
     *
     * @returns The nearest Vec3 position within the range, or null if no point is
     * available.
     */
    getNearestPoint: (position: Vec3, range: number) => Vec3 | null;
    /**
     * Gets information about the navmesh instance, such as its profile and
     * current bake status.
     */
    getStatus: () => NavMeshInstanceInfo;
}
/**
 * The possible orientation values for {@link NavMeshAgent} locomotion.
 *
 * @remarks See the {@link NavMeshAgent.alignmentMode} property for usage.
 */
export declare const enum NavMeshAgentAlignment {
    /**
     * The agent does not change orientation as it travels.
     */
    None = 0,
    /**
     * The agent rotates to face its current direction of travel. (Default)
     */
    CurrentVelocity = 1,
    /**
     * The agent rotates to face the next waypoint of its current path.
     */
    NextWaypoint = 2,
    /**
     * The agent rotates to face the final waypoint of its current path.
     * This may be different than its destination, for instance, if the
     * path is incomplete.
     */
    FinalWaypoint = 3,
    /**
     * The agent rotates to face its target destination. This may be
     * different than its final waypoint; for instance, if the path
     * is incomplete.
     */
    Destination = 4
}
/**
 * An entity with locomotion and pathfinding capabilities.
 *
 * @remarks
 * For more information, see the
 * {@link https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/npcs/nav-mesh-agents | NavMesh agents} guide.
 */
export interface INavMeshAgent {
    /**
     * The radius used for the agent when calculating collision avoidance.
     *
     * @remarks
     * Default: The attached navigation profile radius.
     */
    avoidanceRadius: HorizonProperty<number>;
    /**
     * The distance from the agent's center to the surface of its attached NavMesh, in meters. Use this to produce psuedo-flying agents.
     *
     * @remarks
     * This value affects collision avoidance; agents with higher values will avoid other agents with similar base offsets.
     *
     * Default: 0
     */
    baseOffset: HorizonProperty<number>;
    /**
     * The max travel speed for the agent.
     *
     * @remarks
     * To change how fast the agent reaches its max speed, use the {@link acceleration} property.
     *
     * Default: 5 meters per second
     */
    maxSpeed: HorizonProperty<number>;
    /**
     * The distance where the agent considers itself within an acceptable range of its destination.
     *
     * @remarks
     * Agents automatically decelerate and then stop when reaching this distance.
     *
     * Default: 0 meters
     */
    stoppingDistance: HorizonProperty<number>;
    /**
     * The rate in degrees pers second, at which the agent rotates towards its desired orientation.
     *
     * @remarks
     * The agent's desired orientation is determined by its {@link alignmentMode} property.
     *
     * Default: 120 degrees per second
     */
    turnSpeed: HorizonProperty<number>;
    /**
     * The name of the Navigation Profile attached to the agent.
     *
     * @remarks
     * Setting this value causes the agent to use the new profile's NavMesh for pathfinding operations.
     */
    profileName: HorizonProperty<string | null>;
    /**
     * The destination of the agent.
     *
     * @remarks
     * In Play Mode, agents move towards their destination until reached. When the position is outside
     * the navigable surface, the agent will not be able to find path to the destination.
     * If it is the intention to move towards a position outside the navigable surface, use the
     * {@link getNearestPoint} method to get a valid target location.
     */
    destination: HorizonProperty<Vec3 | null>;
    /**
     * This method is deprecated.
     *
     * @deprecated Use `destination.set(null)` instead!
     */
    clearDestination(): void;
    /**
     * The acceleration rate for the agent. This is used to propel the agent forward until
     * it reaches its max speed.
     *
     * @remarks
     * This should be a positive number. The default value is `10 m/s^2`.
     */
    acceleration: HorizonProperty<number>;
    /**
     * The deceleration rate for the agent. This is used to slow the agent
     * as it approaches the final waypoint of its path.
     *
     * @remarks
     * This should be a negative number.
     *
     * Default: `-10 m/s^2`
     */
    deceleration: HorizonProperty<number>;
    /**
     * A bitmask that represents the avoidance layer used to perform collision avoidance calculations for
     * the navigation mesh agent.
     *
     * @remarks
     * Each agent belongs to an avoidance layer. These layers are taken into consideration during
     * collision avoidance calculations to identify which agents to avoid.
     *
     * In tandem with the layer is the avoidance mask, which is a bitmask representing the layers which this
     * agent should take into consideration during collision avoidance calculations.
     *
     * This property only sets the agent's avoidance layer. If you want to set the mask,
     * see {@link avoidanceMask}.
     *
     * @example
     * ```
     * enum MyGroups {
     *   Red = 1 << 1,
     *   Green = 1 << 2,
     *   Blue = 1 << 3,
     * }
     *
     * agent.avoidanceLayer.set(MyGroups.Red); // Join the Red layer
     * agent.avoidanceMask.set(MyGroups.Red); // Ignore other Reds
     * ```
     */
    avoidanceLayer: HorizonProperty<number>;
    /**
     * A bitmask that represents the layers the navigation mesh agent should avoid colliding with.
     *
     * @remarks
     * Each agent belongs to an avoidance layer. These layers are taken into consideration during
     * collision avoidance calculations, to identify which agents to avoid.
     *
     * In tandem with the layer is the avoidance mask, a bitmask representing the layers which this
     * agent should take into consideration during collision avoidance calculations.
     *
     * This method only sets the agent's avoidance mask. If you want to set the layer, see {@link avoidanceLayer}.
     *
     * @example
     * ```
     * enum MyGroups {
     *   Red = 1 << 1,
     *   Green = 1 << 2,
     *   Blue = 1 << 3,
     * }
     *
     * agent.avoidanceLayer.set(MyGroups.Red); // Join the Red layer
     * agent.avoidanceMask.set(MyGroups.Red); // Ignore other Reds
     *
     * // You can use the bitwise OR operator to combine layers:
     * agent.avoidanceMask.set(MyGroups.Red | MyGroups.Blue);
     *
     * // You can use the bitwise AND/NOT operators to remove layers:
     * const currentMask = agent.avoidanceMask.get();
     * agent.avoidanceMask.set(currentMask & ~MyGroups.Green); // Remove Green
     * ```
     *
     * @example
     * If you change the avoidance mask, be sure to include `Constants.LAYER_PLAYERS` in the mask.
     * This ensures your agents still avoid human players.
     * ```
     * agent.avoidanceMask.set(MyGroups.Red | NavMeshAgent.Constants.LAYER_PLAYERS);
     * ```
     */
    avoidanceMask: HorizonProperty<number>;
    /**
     * The orientation faced by the agent when traveling.
     *
     * @remarks
     * When travelling, agents default to facing towards their next waypoint. To change
     * the orientation of the agent as it is moving, you can use this property.
     *
     * See {@link NavMeshAgentAlignment} for more information on the available modes.
     *
     * Default: `NavMeshAgentAlignment.NextWaypoint`
     */
    alignmentMode: HorizonProperty<NavMeshAgentAlignment>;
    /**
     * The surface snapping setting for the agent, which determines whether the agent uses the
     * navmesh or the world's physical surface to determine its surface position.
     *
     * @remarks
     * By default, the agent uses the navigation mesh to determine its surface position.
     * The surface position is used when moving the agent to ensure it is attached to the navigation mesh
     * at all times.
     *
     * The navigation mesh is a simplified representation of the world, so it may not be totally accurate,
     * particularly along slopes or curves. In some cases, you'd want the actual physical surface position
     * to be used instead.
     *
     * This setting allows you to toggle this physical surface snapping on/off.
     *
     * Enabling this setting icurs a per-frame performance cost for the agent.
     *
     * Default: false
     */
    usePhysicalSurfaceSnapping: HorizonProperty<boolean>;
    /**
     * Indicates whether the agent is immobile and unable avoid collisions.
     *
     * @remarks
     * By default, an agent attempts to avoid impending collisions with other agents or players.
     * However, if you want your agent to plant itself and not avoid collisions with anything,
     * you can use this property. Other agents will try to navigate around it. However, if the world geometry doesn't allow for it,
     * it's possible other agents will collide with this agent or get stuck trying to move past it.
     *
     * The agent will not move at all unless `isImmobile` is set to `false`, even if the {@link destination} property is set.
     *
     * Default: false
     */
    isImmobile: HorizonProperty<boolean>;
    /**
     * The required alignment, in degrees, between the agent's destination and the direction they are facing, at which
     * point the agent can start moving towards the target direction.
     *
     * @remarks
     * When traveling, it is possible the agent starts to move in a different direction than it is currently facing.
     * For instance, when navigating to a destination behind the agent, it will begin travelling while turning to face the proper direction.
     *
     * You can leverage this property to ensure that an agent only travels forward when it is generally facing the correct direction.
     * We recommend that you keep this value higher than ~10.
     *
     * Default: 360 degrees
     */
    requiredForwardAlignment: HorizonProperty<number>;
    /**
     * The agent's current velocity, in meters per second.
     */
    currentVelocity: ReadableHorizonProperty<Vec3>;
    /**
     * The agent's current speed, in meters per second.
     */
    currentSpeed: ReadableHorizonProperty<number>;
    /**
     * The agent's remaining distance in its current path.
     *
     * @remarks
     * This may not be the same distance to its intended target. For example, if the
     * path to the destination is incomplete or blocked.
     */
    remainingDistance: ReadableHorizonProperty<number>;
    /**
     * The agent's next target waypoint.
     */
    nextWaypoint: ReadableHorizonProperty<Vec3 | null>;
    /**
     * The agent's current path and the associated information.
     */
    path: ReadableHorizonProperty<Vec3[]>;
    /**
     * A reference to the NavMesh associated with the agent.
     */
    getNavMesh: () => Promise<INavMesh | null>;
    /**
     * A reference to the navigation profile associated with the agent.
     */
    getNavProfile: () => Promise<NavMeshProfile | null>;
}
/**
 * Represents an entity with locomotion and pathfinding capabilities.
 *
 * @remarks
 * For more information, see the
 * {@link https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/npcs/nav-mesh-agents | NavMesh agents} guide.
 */
export declare class NavMeshAgent extends Entity implements INavMeshAgent {
    /**
     * List of common constants used when setting the avoidance layer and mask.
     *
     * @remarks
     * Constants:
     *
     * `LAYER_DEFAULT: 1 << 0` - Represents the default layer that agents belong to upon creation.
     * For use with the `avoidanceLayer` property.
     *
     * `MASK_DEFAULT: (1 << 0) | (1 << 30)` - Represents the default masks that agents apply upon
     * creation. For use with the `avoidanceMask` property.
     *
     * `LAYER_PLAYERS: 1 << 30` - Represents the collision layer for human players. For use with
     * the `avoidanceLayer` property.
     *
     * `MASK_IGNORE_ALL: -1` - Ensure an agent ignores all other agents during collision avoidance,
     * regardless of the layer they are on. For use with the `avoidanceMask` property.
     */
    static Constants: {
        /**
         * Represents the default layer that agents belong to upon creation. For use with
         * the `avoidanceLayer` property.
         */
        LAYER_DEFAULT: number;
        /**
         * Represents the default masks that agents apply upon creation. For use with the `avoidanceMask`
         * property.
         */
        MASK_DEFAULT: number;
        /**
         * Represents the collision layer for human players. For use with the `avoidanceLayer` property.
         */
        LAYER_PLAYERS: number;
        /**
         * Ensures an agent ignores all other agents during collision avoidance,
         * regardless of the layer they are on. For use with the `avoidanceMask` property.
         */
        MASK_IGNORE_ALL: number;
    };
    /**
     * Creates a human-readable representation of the NavMeshAgent.
     * @returns A string representation of the NavMeshAgent.
     */
    toString(): string;
    private genericGetField;
    private genericSetField;
    /**
     * The radius used for the agent when calculating collision avoidance.
     *
     * @remarks
     * Default: The attached navigation profile radius.
     */
    avoidanceRadius: HorizonProperty<number>;
    /**
     * The distance from the agent's center to the surface of its attached NavMesh, in meters. Use this to produce psuedo-flying agents.
     *
     * @remarks
     * This value affects collision avoidance; agents with higher values will avoid other agents with similar base offsets.
     *
     * Default: 0
     */
    baseOffset: HorizonProperty<number>;
    /**
     * The max travel speed for the agent.
     *
     * @remarks
     * To change how fast the agent reaches its max speed, use the {@link acceleration} property.
     *
     * Default: 5 meters per second
     */
    maxSpeed: HorizonProperty<number>;
    /**
     * The distance where the agent considers itself within an acceptable range of its destination.
     *
     * @remarks
     * Agents automatically decelerate and then stop when reaching this distance.
     *
     * Default: 0 meters
     */
    stoppingDistance: HorizonProperty<number>;
    /**
     * The rate in degrees pers second, at which the agent rotates towards its desired orientation.
     *
     * @remarks
     * The agent's desired orientation is determined by its {@link alignmentMode} property.
     *
     * Default: 120 degrees per second
     */
    turnSpeed: HorizonProperty<number>;
    /**
     * The name of the Navigation Profile attached to the agent.
     *
     * @remarks
     * Setting this value causes the agent to use the new profile's NavMesh for pathfinding operations.
     */
    profileName: HorizonProperty<string | null>;
    /**
     * The destination of the agent.
     *
     * @remarks
     * In Play Mode, agents move towards their destination until reached. When the position is outside
     * the navigable surface, the agent will not be able to find path to the destination.
     * If it is the intention to move towards a position outside the navigable surface, use the
     * {@link getNearestPoint} method to get a valid target location.
     */
    destination: HorizonProperty<Vec3 | null>;
    /**
     * This method is deprecated.
     *
     * @deprecated Use `destination.set(null)` instead!
     */
    clearDestination(): void;
    /**
     * The acceleration rate for the agent. This is used to propel the agent forward until
     * it reaches its max speed.
     *
     * @remarks
     * This should be a positive number. The default value is `10 m/s^2`.
     */
    acceleration: HorizonProperty<number>;
    /**
     * The deceleration rate for the agent. This is used to slow the agent
     * as it approaches the final waypoint of its path.
     *
     * @remarks
     * This should be a negative number.
     *
     * Default: `-10 m/s^2`
     */
    deceleration: HorizonProperty<number>;
    /**
     * A bitmask that represents the avoidance layer used to perform collision avoidance calculations for
     * the navigation mesh agent.
     *
     * @remarks
     * Each agent belongs to an avoidance layer. These layers are taken into consideration during
     * collision avoidance calculations to identify which agents to avoid.
     *
     * In tandem with the layer is the avoidance mask, which is a bitmask representing the layers which this
     * agent should take into consideration during collision avoidance calculations.
     *
     * This property only sets the agent's avoidance layer. If you want to set the mask,
     * see {@link avoidanceMask}.
     */
    avoidanceLayer: HorizonProperty<number>;
    /**
     * A bitmask that represents the layers the navigation mesh agent should avoid colliding with.
     *
     * @remarks
     * Each agent belongs to an avoidance layer. These layers are taken into consideration during
     * collision avoidance calculations, to identify which agents to avoid.
     *
     * In tandem with the layer is the avoidance mask, a bitmask representing the layers which this
     * agent should take into consideration during collision avoidance calculations.
     *
     * This method only sets the agent's avoidance mask. If you want to set the layer, see {@link avoidanceLayer}.
     */
    avoidanceMask: HorizonProperty<number>;
    /**
     * The orientation faced by the agent when traveling.
     *
     * @remarks
     * When travelling, agents default to facing towards their next waypoint. To change
     * the orientation of the agent as it is moving, you can use this property.
     *
     * See {@link NavMeshAgentAlignment} for more information on the available modes.
     *
     * Default: `NavMeshAgentAlignment.NextWaypoint`
     */
    alignmentMode: HorizonProperty<NavMeshAgentAlignment>;
    /**
     * The surface snapping setting for the agent, which determines whether the agent uses the
     * navmesh or the world's physical surface to determine its surface position.
     *
     * @remarks
     * By default, the agent uses the navigation mesh to determine its surface position.
     * The surface position is used when moving the agent to ensure it is attached to the navigation mesh
     * at all times.
     *
     * The navigation mesh is a simplified representation of the world, so it may not be totally accurate,
     * particularly along slopes or curves. In some cases, you'd want the actual physical surface position
     * to be used instead.
     *
     * This setting allows you to toggle this physical surface snapping on/off.
     *
     * Enabling this setting icurs a per-frame performance cost for the agent.
     *
     * Default: false
     */
    usePhysicalSurfaceSnapping: HorizonProperty<boolean>;
    /**
     * Indicates whether the agent is immobile and unable avoid collisions.
     *
     * @remarks
     * By default, an agent attempts to avoid impending collisions with other agents or players.
     * However, if you want your agent to plant itself and not avoid collisions with anything,
     * you can use this property. Other agents will try to navigate around it. However, if the world geometry doesn't allow for it,
     * it's possible other agents will collide with this agent or get stuck trying to move past it.
     *
     * The agent will not move at all unless `isImmobile` is set to `false`, even if the {@link destination} property is set.
     *
     * Default: false
     */
    isImmobile: HorizonProperty<boolean>;
    /**
     * The required alignment, in degrees, between the agent's destination and the direction they are facing, at which
     * point the agent can start moving towards the target direction.
     *
     * @remarks
     * When traveling, it is possible the agent starts to move in a different direction than it is currently facing.
     * For instance, when navigating to a destination behind the agent, it will begin travelling while turning to face the proper direction.
     *
     * You can leverage this property to ensure that an agent only travels forward when it is generally facing the correct direction.
     * We recommend that you keep this value higher than ~10.
     *
     * Default: 360 degrees
     */
    requiredForwardAlignment: HorizonProperty<number>;
    /**
     * The current velocity of the agent, in meters per second.
     */
    currentVelocity: ReadableHorizonProperty<Vec3>;
    /**
     * The current speed of the agent, in meters per second.
     */
    currentSpeed: ReadableHorizonProperty<number>;
    /**
     * The agent's remaining distance in its current path, accounting for the agent's stopping distance.
     *
     * @remarks
     * This may not be the same distance to its intended target. For example, if the
     * path to the destination is incomplete or blocked.
     */
    remainingDistance: ReadableHorizonProperty<number>;
    /**
     * The next waypoint on the agent's current path.
     */
    nextWaypoint: ReadableHorizonProperty<Vec3 | null>;
    /**
     * The current path the agent is using.
     */
    path: ReadableHorizonProperty<Vec3[]>;
    private static placeholderWorld;
    private navMeshReference;
    private ensureNavMeshReady;
    /**
     * Gets a reference to the current navigation mesh the agent is using.
     *
     * @returns A reference to the navigation mesh instance.
     */
    getNavMesh: () => Promise<INavMesh | null>;
    /**
     * Gets a reference to the current navigation mesh profile the agent is using.
     *
     * @returns A reference to the navigation mesh profile instance.
     */
    getNavProfile: () => Promise<NavMeshProfile | null>;
}

}