/**
 * Defines a callback function type that can be invoked with an optional value of type `T`.
 * The function can perform any operation and optionally return a value of any type.
 *
 * @template T - The type of the parameter that the callback function may receive.
 * @param {T} [value] - An optional parameter of type `T` passed to the callback function.
 * @returns {any} - The return type of the callback function is not specified and can be of any type.
 */
export type ICallback<T> = (value?: T) => any;

/**
 * Represents a callback function to handle error scenarios.
 *
 * This type defines a function signature that accepts error-related data
 * and a descriptive error message as parameters and performs an operation.
 *
 * @callback IErrorCallback
 * @param {any} errorData - The data or object representing the error.
 * @param {any} errorMessage - A descriptive message providing details about the error.
 */
export type IErrorCallback = (errorData: any, errorMessage: any) => void;

/**
 * Represents a listener interface that extends the functionality of `ICallback`.
 * This type is designed to handle events, callbacks, or notifications with a specific type `T`.
 *
 * Generic:
 * @template T - The type of data that the listener will handle.
 */
export type IListener<T> = ICallback<T>;

/**
 * IDestroy represents an interface for objects that can be destroyed to release resources.
 * It provides a method to perform the destroy operation and a property to indicate if the object is already destroyed.
 *
 * Members:
 * - destroy(): A method to perform cleanup and release resources associated with the object.
 * - isDestroyed: A boolean property that reflects whether the object has been destroyed.
 */
export type IDestroy = {
    destroy(): void;
    isDestroyed: boolean;
};

/**
 * Represents an order with a specific numerical value.
 * Defines a structure to hold the order information as a numeric value.
 */
export type IOrder = {
    order: number;
};

/**
 * Interface representing an observable value that can be updated by emitting a new value.
 *
 * ISetObservableValue provides a `next` method that allows sending new values to be observed by subscribers.
 */
export type ISetObservableValue = {
    next(value: any): void;
};

/**
 * Represents an interface for pausing and resuming operations.
 *
 * The IPause interface provides methods to pause and resume a process or operation.
 * It can be used as a structure for implementing functionality where halting and continuing an activity is required.
 *
 * Method Summary:
 * - `pause`: Invokes a pause in the operation.
 * - `resume`: Resumes the operation from a paused state.
 */
export type IPause = {
    pause(): void;
    resume(): void;
};

/**
 * Represents a counter interface for subscriptions.
 * An ISubscribeCounter instance provides methods to query the size
 * of the collection or group being managed.
 */
export type ISubscribeCounter = {
    size(): number;
};

/**
 * Represents a generic stream interface for processing arrays of type T.
 *
 * This interface defines a method to input and handle data streams.
 * Mirrors for...of semantics — emits array elements one by one.
 *
 * @template T The type of the data elements to be streamed.
 * @typedef {Object} IStream
 * @property {(value: T[]) => void} of A method to emit array elements one by one.
 */
export type IStream<T> = {
    of(value: T[]): void;
}

/**
 * Interface ISend represents a contract for sending a value of a generic type.
 *
 * This interface declares a single method, `send`, which is responsible
 * for handling the transmission or processing of the provided value.
 *
 * @template T - The type of the value that can be sent using this interface.
 */
export type ISend<T> = {
    send(value: T): void;
};

/**
 * Represents a container for a chain of elements.
 *
 * This interface defines a structure that holds an array of elements.
 * It is used to manage and interact with a sequential chain of items.
 *
 * Properties:
 * - chain: An array representing the chain, where each element can be of any type.
 */
export type IChainContainer = {
    chain: any[];
}

/**
 * Represents the payload structure used within a pipe system.
 *
 * This type defines the fields necessary for managing the flow and control
 * within a pipe operation, including breaking, unsubscribing, availability
 * status, and the actual payload to be processed or transmitted.
 */
export type IPipePayload = { isBreak: boolean, isUnsubscribe: boolean, isAvailable: boolean, debounceMs: number, debounceTimer: any, debounceValue: any, debounceIndex: number, payload: any };

/**
 * Represents a callback function interface for handling chain-related operations.
 * This function is typically invoked with a payload to perform specific operations
 * in a chain or pipeline.
 *
 * @callback IChainCallback
 * @param {IPipePayload} data - The payload passed to the callback function
 *                              containing the necessary data for processing.
 */
export type IChainCallback = (data: IPipePayload) => void;

/**
 * Represents a combined subscriber that can either be a listener or a setter for observable values.
 *
 * @template T - The type of the value to be handled by the subscriber.
 */
export type ICombinedSubscriber<T> = IListener<T> | ISetObservableValue;

/**
 * Represents a type definition for a group of subscriptions.
 *
 * This type can be either a single `ICombinedSubscriber` instance or an array of `ICombinedSubscriber` instances.
 *
 * @template T The type of data that the subscriber(s) will handle.
 */
export type ISubscribeGroup<T> =
    ICombinedSubscriber<T> |
    ICombinedSubscriber<T>[];
