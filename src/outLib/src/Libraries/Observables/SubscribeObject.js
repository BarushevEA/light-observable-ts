"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeObject = void 0;
const Pipe_1 = require("./Pipe");
const FunctionLibs_1 = require("./FunctionLibs");
/**
 * A class that represents an observable object with subscription, pausing,
 * and piping functionalities. It allows subscribing to updates, handling errors,
 * and processing values through a chain.
 *
 * @template T The type of values handled by SubscribeObject.
 * @extends Pipe<T>
 * @implements ISubscribeObject<T>
 */
class SubscribeObject extends Pipe_1.Pipe {
    observer;
    listener;
    /**
     * A callback function used for handling errors in the context of the SubscribeObject.
     * This function logs the provided error data and error message to the console for debugging purposes.
     *
     * @type {IErrorCallback}
     * @param {any} errorData - The data related to the error encountered.
     * @param {any} errorMessage - A descriptive message detailing the error.
     */
    errorHandler = (errorData, errorMessage) => {
        console.log(`(Unit of SubscribeObject).send(${errorData}) ERROR:`, errorMessage);
    };
    _order = 0;
    paused = false;
    piped = false;
    /**
     * Constructs an instance of the class.
     *
     * @param {IObserver<T>} [observable] - The observer instance to be assigned. Optional parameter.
     * @param {boolean} [isPipe=false] - Determines whether the instance is piped. Defaults to false.
     * @return {void}
     */
    constructor(observable, isPipe) {
        super();
        this.observer = observable;
        this.piped = !!isPipe;
    }
    /**
     * Subscribes an observer to the current instance and optionally assigns an error handler.
     *
     * @param {ISubscribeGroup<T>} observer - The observer group to subscribe.
     * @param {IErrorCallback} [errorHandler] - Optional callback to handle errors.
     * @return {ISubscriptionLike} An instance representing the subscription.
     */
    subscribe(observer, errorHandler) {
        this.listener = (0, FunctionLibs_1.getListener)(observer);
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }
    /**
     * Unsubscribes the current instance from the associated observer, clears the listener,
     * and resets the internal chain.
     * This method ensures that the instance is properly cleaned up and no longer receives updates.
     *
     * @return {void} Does not return a value.
     */
    unsubscribe() {
        if (!this.observer)
            return;
        this.observer.unSubscribe(this);
        this.observer = null;
        this.listener = null;
        this.chain.length = 0;
    }
    /**
     * Sends the specified value for processing and updates the flow state.
     *
     * @param {T} value - The value to be sent and processed.
     * @return {void} Does not return a value.
     */
    send(value) {
        const listener = this.listener;
        if (!listener) {
            this.unsubscribe();
            return;
        }
        if (!this.observer || this.paused)
            return;
        // Fast path (no pipe)
        if (!this.piped) {
            try {
                listener(value);
            }
            catch (err) {
                this.errorHandler(value, err);
            }
            return;
        }
        // Slow path (with pipe)
        try {
            this.flow.payload = value;
            this.flow.isBreak = false;
            this.processChain(listener);
        }
        catch (err) {
            this.errorHandler(value, err);
        }
    }
    /**
     * Resumes the current process or operation from a paused state.
     * Updates the internal state to indicate that it is no longer paused.
     *
     * @return {void} Does not return a value.
     */
    resume() {
        this.paused = false;
    }
    /**
     * Pauses the current operation or process by setting the paused state to true.
     *
     * @return {void} No value is returned.
     */
    pause() {
        this.paused = true;
    }
    /**
     * Retrieves the current order value.
     *
     * @return {number} The current value of the order.
     */
    get order() {
        return this._order;
    }
    /**
     * Sets the order value.
     *
     * @param {number} value - The numerical value to set as the order.
     */
    set order(value) {
        this._order = value;
    }
}
exports.SubscribeObject = SubscribeObject;
