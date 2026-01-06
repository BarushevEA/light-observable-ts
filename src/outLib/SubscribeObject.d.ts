import { IErrorCallback, IListener, IObserver, ISubscribeGroup, ISubscribeObject, ISubscriptionLike } from "./Types";
import { Pipe } from "./Pipe";
/**
 * A class that represents an observable object with subscription, pausing,
 * and piping functionalities. It allows subscribing to updates, handling errors,
 * and processing values through a chain.
 *
 * @template T The type of values handled by SubscribeObject.
 * @extends Pipe<T>
 * @implements ISubscribeObject<T>
 */
export declare class SubscribeObject<T> extends Pipe<T> implements ISubscribeObject<T> {
    observer: IObserver<T> | undefined;
    listener: IListener<T> | undefined;
    /**
     * A callback function used for handling errors in the context of the SubscribeObject.
     * This function logs the provided error data and error message to the console for debugging purposes.
     *
     * @type {IErrorCallback}
     * @param {any} errorData - The data related to the error encountered.
     * @param {any} errorMessage - A descriptive message detailing the error.
     */
    errorHandler: IErrorCallback;
    _order: number;
    paused: boolean;
    piped: boolean;
    /**
     * Constructs an instance of the class.
     *
     * @param {IObserver<T>} [observable] - The observer instance to be assigned. Optional parameter.
     * @param {boolean} [isPipe=false] - Determines whether the instance is piped. Defaults to false.
     * @return {void}
     */
    constructor(observable?: IObserver<T>, isPipe?: boolean);
    /**
     * Subscribes an observer to the current instance and optionally assigns an error handler.
     *
     * @param {ISubscribeGroup<T>} observer - The observer group to subscribe.
     * @param {IErrorCallback} [errorHandler] - Optional callback to handle errors.
     * @return {ISubscriptionLike} An instance representing the subscription.
     */
    subscribe(observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike;
    /**
     * Unsubscribes the current instance from the associated observer, clears the listener,
     * and resets the internal chain.
     * This method ensures that the instance is properly cleaned up and no longer receives updates.
     *
     * @return {void} Does not return a value.
     */
    unsubscribe(): void;
    /**
     * Sends the specified value for processing and updates the flow state.
     *
     * @param {T} value - The value to be sent and processed.
     * @return {void} Does not return a value.
     */
    send(value: T): void;
    /**
     * Resumes the current process or operation from a paused state.
     * Updates the internal state to indicate that it is no longer paused.
     *
     * @return {void} Does not return a value.
     */
    resume(): void;
    /**
     * Pauses the current operation or process by setting the paused state to true.
     *
     * @return {void} No value is returned.
     */
    pause(): void;
    /**
     * Retrieves the current order value.
     *
     * @return {number} The current value of the order.
     */
    get order(): number;
    /**
     * Sets the order value.
     *
     * @param {number} value - The numerical value to set as the order.
     */
    set order(value: number);
}
