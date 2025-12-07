declare module 'horizon/unity_asset_bundles' {
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
import { Color, Entity, HorizonProperty, MaterialAsset, NetworkEvent } from 'horizon/core';
/**
 * Represents a Unity AssetBundle, which is an archive of design assets that Unity can load at runtime.
 *
 * @remarks
 * For more information about AssetBundles, see the
 * {@link https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/assets/unity-assetbundles/horizon-unity-assetbundles-overview | Horizon developer guides}
 * and the
 * {@link https://docs.unity3d.com/Manual/AssetBundlesIntro.html | Unity developer guides} (external).
 *
 * @public
 */
export declare class AssetBundleGizmo extends Entity {
    /**
     * Returns the class type and ID of the AssetBundleGizmo.
     *
     * @returns The class type and ID of the AssetBundleGizmo.
     *
     * @public
     */
    toString(): string;
    /**
     * Determines whether a prefab is instantiated and the root reference is ready.
     *
     * @returns true if a prefab is instantiated and the root reference is ready, false otherwise.
     *
     * @public
     */
    isLoaded(): boolean;
    /**
     * Gets an AssetBundleInstanceReference for the main GameObject.
     *
     * @returns A reference to the main GameObject.
     *
     * @public
     */
    getRoot(): AssetBundleInstanceReference;
    /**
     * Gets an AssetBundleInstanceReference for an exposed GameObject in the loaded prefab.
     * These need to be specified at export time in the HorizonUnityAssetReferences MonoBehaviour.
     *
     * @param name - The name of the GameObject.
     *
     * @param throwIfNotExist - Indicates whether to throw an exception if the GameObject does not exist.
     *
     * @returns A reference to the GameObject.
     *
     * @throws {@link Error}
     * Thrown if throwIfNotExist is true and the GameObject does not exist.
     *
     * @public
     */
    getReference(name: string, throwIfNotExist: boolean): AssetBundleInstanceReference;
    /**
     * Loads a prefab from a Unity AssetBundle.
     *
     * @remarks
     * A prefab is a type of preconfigured Unity GameObject that includes its
     * dependent objects and can be stored as a reusable asset.
     *
     * To unload a prefab, see {@link unloadPrefab}.
     *
     * @param name - The name of the prefab to load. The {@link getPrefabNames}
     * method retrieves the prefab names in the AssetBundle.
     *
     * @example
     * Dynamically load a prefab:
     * ```
     * this.entity.as(AssetBundleGizmo).loadPrefab("Prefab01");
     * ```
     *
     * @public
     */
    loadPrefab(name: string): void;
    /**
     * Unloads the {@link loadPrefab | loaded prefab} in the AssetBundleGizmo.
     *
     * @remarks
     * A prefab is a type of preconfigured Unity GameObject that includes its dependent objects and can be stored as a reusable asset.
     *
     * @public
     */
    unloadPrefab(): void;
    /**
     * Get the names of all prefabs in the AssetBundle instance.
     *
     * @returns The names of the prefabs in the AssetBundle instance.
     */
    getPrefabNames(): string[];
}
/**
 * An animation event of the NetworkEvent type.
 *
 * @remarks You can subscribe to this event using the
 * {@link core.Component.connectNetworkBroadcastEvent | connectNetworkBroadcastEvent} method.
 *
 * Parameters:
 *
 * `eventName` - The name of the event.
 *
 * `entityId` - The ID of the event.
 */
export declare const unityAnimationEvent: NetworkEvent<{
    eventName: string;
    entityId: bigint;
}>;
/**
 * Represents a reference to a Unity AssetBundle.
 */
export declare class AssetBundleInstanceReference {
    private entity_;
    private referenceName_;
    style: IEntityStyle;
    /**
     * Creates an instance of AssetBundleInstanceReference.
     * @param entity - The parent entity.
     * @param referenceName - The name of the reference.
     */
    constructor(entity: Entity, referenceName: string);
    /**
     * Determines whether an AssetBundle is loaded.
     *
     * @returns `true` if the AssetBundle is loaded, `false` otherwise.
     *
     * @public
     */
    isLoaded(): boolean;
    /**
     * Gets the parameters for an animation.
     *
     * @returns The names and types of the animation parameters.
     *
     * @public
     */
    getAnimationParameters(): {
        [name: string]: string | string;
    };
    /**
     * Sets the value of a boolean animation parameter.
     *
     * @param name - The name of the animation parameter to set.
     * @param value - The value for the animation parameter.
     * @param localOnly - `true` only sets the value for the local animation; otherwise, sets the value for the global animation.
     *
     * @public
     */
    setAnimationParameterBool(name: string, value: boolean, localOnly?: boolean): void;
    /**
     * Sets the value of a float animation parameter.
     *
     * @param name - The name of the animation parameter to set.
     * @param value - The value for the animation parameter.
     * @param localOnly - `true` only sets the value for the local animation; otherwise, sets the value for the global animation.
     *
     * @public
     */
    setAnimationParameterFloat(name: string, value: number, localOnly?: boolean): void;
    /**
     * Sets the value of an integer animation parameter.
     *
     * @param name - The name of the animation parameter to set.
     * @param value - The value for the animation parameter.
     * @param localOnly - `true` only sets the value for the local animation; otherwise, sets the value for the global animation.
     */
    setAnimationParameterInteger(name: string, value: number, localOnly?: boolean): void;
    /**
     * Activates an animation trigger.
     *
     * @param name - The name of the animation parameter to activate.
     * @param localOnly - `true` only activates the local animation trigger; otherwise, activates the global animation trigger.
     *
     * @public
     */
    setAnimationParameterTrigger(name: string, localOnly?: boolean): void;
    /**
     * Resets the value of the animation parameter with the given name.
     *
     * @param name - The name of the animation parameter to reset.
     * @param localOnly - `true` only resets the local animation; otherwise, resets the global animation.
     */
    resetAnimationParameterTrigger(name: string, localOnly?: boolean): void;
    /**
     * Sets the material of a mesh.
     *
     * @param material - The material name or material asset to set.
     * @param options - The slot index options for the material, which are used to specify the
     * material to update when updating meshes with multiple materials.
     *
     * @remarks
     * Material names reference materials registered in the SwappableMaterials list in Unity.
     *
     * @example
     * ```
     * class Button extends Component<typeof Button> {
     *   static propsDefinition = {
     *     material: {type: PropTypes.Asset},
     *     materialSlot: {type: PropTypes.Number},
     *     targetEntity: {type: PropTypes.Entity},
     *   };
     *
     *   start() {
     *     this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, () => this.onButtonPress());
     *   }
     *
     *   onButtonPress() {
     *     const options = { materialSlot: this.props.materialSlot };
     *     this.props.targetEntity
     *       .as(AssetBundleGizmo)!
     *       .getRoot()
     *       .setMaterial(this.props.material, options);
     *   }
     * }
     * ```
     */
    setMaterial(material: string | MaterialAsset, options?: SetMaterialOptions): void;
    /**
     * Swaps the mesh of an entity with another mesh registered in the SwappableMesh list in Unity.
     * Leave empty to hide the mesh.
     *
     * @param meshName - The name of the mesh to set, or empty string to hide the mesh.
     */
    setMesh(meshName: string): void;
}
/**
 * Options for how {@link setMaterial} is applied.
 * @param materialSlot - The index of the material slot to update. If null, the material is applied to slot 0.
 */
export declare type SetMaterialOptions = {
    materialSlot?: number;
};
/**
 * Represents a style for a Unity AssetBundle.
 *
 * @example
 * ```
 * outColor.rgb = lerp(inColor.rgb, Luminance(inColor.rgb) * tintColor, tintStrength) * brightness;
 * ```
 */
export interface IEntityStyle {
    /**
     * The tint color of the entity.
     * `tintColor` is in RGB range from 0 - 1, defaults to 1, 1, 1 (no tint color).
     */
    tintColor: HorizonProperty<Color>;
    /**
     * The tint strength of the entity.
     * `tintStrength` is from 0 - 1, 0 - no tint, 1 - fully tint, defaults to 0.
     */
    tintStrength: HorizonProperty<number>;
    /**
     * The brightness of the entity.
     * `brightness` is from 0 - 100, 0 - black, 1 - no adjustment, 100 - very bright, defaults to 1.
     */
    brightness: HorizonProperty<number>;
}

}