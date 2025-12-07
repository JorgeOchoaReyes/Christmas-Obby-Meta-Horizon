declare module 'horizon/performance' {
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
export declare const ApiName = "performance";
/**
 * A trace sampler that tracks the duration of function calls.
 */
export declare class HorizonDurationSampler {
    private samplerName;
    /**
     * Constructs a new instance of the `HorizonDurationSampler` class.
     *
     * @param samplerName - The name of the `HorizonDurationSampler` instance.
     */
    constructor(samplerName: string);
    /**
     * Tracks the duration of the given function call.
     *
     * @param fn - The function call to track.
     */
    trace(fn: () => void): void;
}
/**
 * A trace sampler that tracks the frequency of events.
 */
export declare class HorizonCountSampler {
    private samplerName;
    /**
     * Constructs a new instance of the `HorizonCountSampler` class.
     *
     * @param samplerName - The name of the `HorizonCountSampler` instance.
     */
    constructor(samplerName: string);
    /**
     * Tracks the number of trace events that occured.
     *
     * @param amount - The type of trace event to track.
     */
    count(amount: number): void;
}
/**
 * A trace sampler that flags events.
 *
 * @remarks
 * Events flagged by this sampler aggregate to 1 if invoked and 0 if not.
 */
export declare class HorizonMarkerSampler {
    private samplerName;
    /**
     * Constructs a new instance of the `HorizonMarkerSampler` class.
     *
     * @param samplerName - The name of the `HorizonMarkerSampler` instance.
     */
    constructor(samplerName: string);
    /**
     * Flags an event, which aggregates to 1 if the event is called and 0 if
     * it's not called.
     */
    mark(): void;
}
/**
 * Coordinates custom performance metrics behaviors including listening for
 * events from the aggregation pipeline, returning event data,
 * and clearing the event buffer.
 */
export declare class CustomMetricsCoordinator {
    private static activeMetrics;
    private static activeSamplers;
    private static intervalID;
    private static traceStartTime;
    private static performanceTraceStartTime;
    private static tracingActive;
    private static readonly MAX_STRING_LENGTH;
    private static clearMetricsAndSamplers;
    private static getTraceStartTime;
    private static getPerfStartTime;
    /**
     * Gets the metrics that are currently being aggregated.
     *
     * @returns An array that contains configurations of the active metrics.
     */
    static getActiveMetrics(): Array<HorizonPerformanceMetricConfig>;
    /**
     * Gets the trace samplers that are running.
     *
     * @returns An array that contains the active trace samplers.
     */
    static getActiveSamplers(): Array<string>;
    /**
     * Sends the contents of {@link CustomMetricsBuffer} to the aggregation pipeline.
     */
    private static sendBuffer;
    private static splitOverlongBufferString;
    /**
     * Adds a metric to the active metrics list if there isn't already a metric
     * with the provided name. Also, adds any samplers that contribute
     * to the metric so they can be accessed at runtime.
     *
     * @param metricConfig - The configuration for new metric to activate.
     */
    static activateMetric(metricConfig: HorizonPerformanceMetricConfig): void;
    /**
     * Indicates whether the trace is running.
     *
     * @returns `true` if tracing is in progress; false otherwise.
     */
    static isTracingActive(): boolean;
}
declare type HzTraceEventsBySampler = {
    samplerName: string;
    samplerType: HorizonTraceEventType;
    events: Array<HorizonTraceEvent>;
};
/**
 * A list that contains a buffer of HorizonTraceEvents to send to the event
 * aggregation pipeline for processing.
 */
export declare class CustomMetricsBuffer {
    private static buffer;
    /**
     * Gets the trace events that are in the trace event buffer.
     *
     * @returns An array that contains the elements in the trace event buffer.
     */
    static getBufferContents(): Array<HzTraceEventsBySampler>;
}
/**
 * A configuration for a custom metric used to capture performance data about
 * scripts at runtime. You can view this data with the
 * {@link https://developers.meta.com/horizon-worlds/learn/documentation/performance-best-practices-and-tooling/performance-tools/performance-scrubbing | Performance Scrubbing}
 * tool or in {@link https://developers.meta.com/horizon-worlds/learn/documentation/performance-best-practices-and-tooling/performance-tools/analyzing-trace-data-with-perfetto | Perfetto}.
 *
 * @remarks
 * For more information about using custom metrics, see the
 * {@link https://developers.meta.com/horizon-worlds/learn/documentation/performance-best-practices-and-tooling/performance-tools/custom-metrics-api | Custom Metrics API} guide.
 *
 * @example
 * ```
 * const hitCounterMetric = new HorizonPerformanceMetricConfig(
 *  "totalHitCounterMetric",
 *  ["normalHit", "glancingHit", "criticalHit"],
 *  HorizonTraceEventType.Counter,
 *  "50",
 * );
 * ```
 */
export declare class HorizonPerformanceMetricConfig {
    /**
     * The name of the metric.
     */
    readonly metricName: string;
    /**
     * The list of samplers that is aggregated to provide the final metric value. Samplers
     * are objects you define in your script that record individual types of metric data.
     *
     * @remarks
     * The available sampler types are {@link HorizonDurationSampler},
     * {@link HorizonMarkerSampler}, and {@link HorizonCountSampler}.
     *
     * You should only use one type of sampler in each `HorizonPerformanceMetricConfig` object,
     * but you can include multiple samplers of the same type. For example, if you include
     * multiple {@link HorizonCountSampler} objects in a configuration, you shouldn't
     * include other types in the same configuration, such as
     * a {@link HorizonMarkerSampler} object.
     */
    readonly samplersList: Array<string>;
    /**
     * The type of trace event for the metric. This value corresponds to the sampler type in
     * the `samplersList` parameter. This value determines the suffix applied to the metric
     * such as "milliseconds" or "none," and how it's processed.
     */
    readonly intendedTraceEventType: HorizonTraceEventType;
    /**
     * The desired metric value per frame. In performance tools, this value is
     * compared to average, minimum, and maximum values.
     */
    readonly targetValue: string;
    /**
     * Constructs a new `HorizonPerformanceMetricConfig` object.
     *
     * @param metricName - The name of the metric.
     *
     * @param samplersList - The list of samplers for the metric.
     *
     * @param intendedTraceEventType - The type of trace event for the metric.
     *
     * @param targetValue - The desired metric value per frame. In performance tools,
     * this value is compared to average, minimum, and maximum values.
     */
    constructor(metricName: string, samplersList: Array<string>, intendedTraceEventType: HorizonTraceEventType, targetValue: string);
}
/**
 * A trace event in Horizon Worlds.
 */
export declare class HorizonTraceEvent {
    /**
     * The name of the trace sampler for the event.
     */
    readonly samplerName: string;
    /**
     * The trace event type.
     */
    readonly type: HorizonTraceEventType;
    /**
     * The timestamp of event.
     */
    readonly timeStamp: number;
    /**
     * The value of the metric.
     */
    readonly value: number;
    /**
     * Constructs a `HorizonTraceEvent` object.
     *
     * @param samplerName - The name of the `HorizonTraceEvent` object.
     *
     * @param type - The type of the sampler.
     *
     * @param value - The value of the trace.
     *
     */
    constructor(samplerName: string, type: HorizonTraceEventType, value: number);
}
/**
 * The suffixes for custom metric values. These are abbreviated in the tools.
 */
export declare enum HorizonMetricSuffixes {
    /**
     * A value measure in seconds.
     */
    Seconds = 0,
    /**
     * A value measure in milliseconds.
     */
    Milliseconds = 1,
    /**
     * The sum of a set of values.
     */
    Count = 2,
    /**
     * A value measure in kilos.
     */
    Kilo = 3,
    /**
     * A value measure in frames per second.
     */
    FramesPerSecond = 4,
    /**
     * A value measure in frames.
     */
    Frames = 5,
    /**
     * A value measure in megabytes.
     */
    Megabytes = 6,
    /**
     * A value measure in kilobytes.
     */
    Kilobytes = 7,
    /**
     * A value measure in bytes.
     */
    Bytes = 8
}
/**
 * The types for Horizon trace events, based on the sampler that
 * produces them.
 */
export declare enum HorizonTraceEventType {
    /**
     * Produced by {@link HorizonCountSampler}.
     */
    Duration = 0,
    /**
     * Produced by {@link HorizonMarkerSampler}.
     */
    Marker = 1,
    /**
     * Produced by {@link HorizonCounterSampler}.
     */
    Counter = 2
}
/**
 * This class is deprecated.
 *
 * @deprecated Use {@link HorizonDurationSampler} instead!
 *
 * @remarks
 * Creates a sampler that can be used to record an event that has a duration.
 */
export declare class DurationSampler {
    private samplerId;
    constructor(name: string);
    trace(fn: () => void): void;
    private begin;
    private end;
}
/**
 * This class is deprecated.
 *
 * @deprecated Use {@link HorizonCountSampler} instead.
 *
 * @remarks
 * Creates a sampler that can be used to record an event for focusing on the event frequency.
 */
export declare class CountSampler {
    private samplerId;
    constructor(name: string);
    /**
     * This method is deprecated.
     *
     * @deprecated Use {@link HorizonCountSampler.count} instead.
     */
    count(amount: number): void;
}
/**
 * This class is deprecated.
 *
 * @deprecated Use {@link HorizonMarkerSampler} instead.
 *
 * @remarks
 * Creates a sampler that can be used to record an event without a duration.
 */
export declare class MarkerSampler {
    private samplerId;
    constructor(name: string);
    /**
     * This method is deprecated.
     *
     * @deprecated Use {@link HorizonMarkerSampler.mark} instead.
     */
    mark(): void;
}
export {};

}