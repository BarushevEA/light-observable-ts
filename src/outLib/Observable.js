"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
const SubscribeObject_1 = require("./SubscribeObject");
const FilterCollection_1 = require("./FilterCollection");
/**
 * Observable is a generic class that represents an entity capable of emitting values
 * over time to subscribers. It provides mechanisms for managing subscribers and controlling
 * the flow of emitted data through filters and utility functions.
 *
 * @template T The type of the data managed by the Observable.
 *
 * Implements:
 * - IObserver<T>: For observing value changes.
 * - IStream<T>: For emitting streams of values.
 * - IAddFilter<T>: For adding and managing filters in the value processing.
 *
 * The Observable class provides the following key features:
 *
 * - Allows subscribers to listen for emitted values.
 * - Provides methods for enabling/disabling value emissions.
 * - Supports applying filters to process or validate values before emission.
 * - Allows streaming multiple values sequentially.
 * - Supports safe termination of resources through unsubscription and destruction.
 * - Handles asynchronous cleanup when active operations are in progress.
 */
class Observable {
    subs = [];
    enabled = true;
    killed = false;
    process = false;
    trash = [];
    filters = new FilterCollection_1.FilterCollection();
    _value;
    constructor(value) {
        this._value = value;
    }
    /**
     * Adds an error handler filter to the current filter setup.
     *
     * @param {IErrorCallback} [errorHandler] - An optional error handler callback to handle errors in the filter.
     * @return {IFilterSetup<T>} The updated filter setup object with the specified error handler added.
     */
    addFilter(errorHandler) {
        if (errorHandler)
            this.filters.addErrorHandler(errorHandler);
        return this.filters;
    }
    /**
     * Disables the current instance or functionality associated with this method.
     * Updates the internal state to reflect that it is no longer active or enabled.
     *
     * @return {void} This method does not return a value.
     */
    disable() {
        this.enabled = false;
    }
    /**
     * Enables the current feature or functionality by setting its state to active.
     * Updates the internal state to indicate that it is enabled.
     *
     * @return {void} No return value.
     */
    enable() {
        this.enabled = true;
    }
    /**
     * Indicates whether the current object or feature is enabled.
     *
     * @return {boolean} Returns true if enabled, otherwise false.
     */
    get isEnable() {
        return this.enabled;
    }
    /**
     * Processes the given value and sends it to all subscribers, respecting the enabled status, filters, and processing state.
     *
     * @param {T} value - The value to be processed and passed to subscribers.
     * @return {void} This method does not return a value.
     */
    next(value) {
        if (this.killed)
            return;
        if (!this.enabled)
            return;
        if (!this.subs.length)
            return;
        if (!this.filters.isEmpty && !this.filters.processChain(value).isOK)
            return;
        this.process = true;
        this._value = value;
        const subs = this.subs;
        const len = subs.length;
        for (let i = 0; i < len; i++)
            subs[i].send(value);
        this.process = false;
        this.trash.length && this.clearTrash();
    }
    /**
     * Processes an array of values and triggers the next method for each value if the stream
     * is not killed or disabled.
     *
     * @param {T[]} values - An array of values to be processed by the stream.
     * @return {void} This method does not return a value.
     */
    stream(values) {
        if (this.killed)
            return;
        if (!this.enabled)
            return;
        for (let i = 0; i < values.length; i++)
            this.next(values[i]);
    }
    /**
     * Clears all items in the `trash` array by unsubscribing each item and resetting the array length to zero.
     *
     * @return {void} No return value.
     */
    clearTrash() {
        const length = this.trash.length;
        for (let i = 0; i < length; i++)
            this.unSubscribe(this.trash[i]);
        this.trash.length = 0;
    }
    /**
     * Unsubscribes the provided listener by removing it from the subscribers' list
     * or marking it for cleanup if the process is currently active.
     *
     * @param {ISubscriptionLike} listener - The subscription listener to be unsubscribed.
     * @return {void} No return value.
     */
    unSubscribe(listener) {
        if (this.killed)
            return;
        if (this.process && listener) {
            this.trash.push(listener);
            return;
        }
        this.subs && !(0, FunctionLibs_1.quickDeleteFromArray)(this.subs, listener);
    }
    /**
     * Cleans up resources and terminates any ongoing processes or subscriptions associated with the instance.
     *
     * Sets the internal state to indicate it has been destroyed. If a process is associated, waits until the process is no longer active
     * before clearing internal data and subscriptions.
     *
     * @return {void} Does not return any value.
     */
    destroy() {
        if (this.killed)
            return;
        this.killed = true;
        if (!this.process) {
            this._value = null;
            this.subs.length = 0;
            return;
        }
        Promise.resolve().then(() => {
            this._value = null;
            this.subs.length = 0;
        });
    }
    /**
     * Unsubscribes from all active subscriptions by clearing the subscriptions list.
     * Prevents further operations if the instance has already been marked as killed.
     * Safe to call during next() - uses deferred cleanup mechanism.
     *
     * @return {void} Does not return a value.
     */
    unsubscribeAll() {
        if (this.killed)
            return;
        if (this.process) {
            // Defer removal until next() completes
            const subs = this.subs;
            for (let i = 0; i < subs.length; i++)
                this.trash.push(subs[i]);
            return;
        }
        this.subs.length = 0;
    }
    /**
     * Retrieves the current value if the instance is active.
     * If the instance is marked as killed, undefined is returned.
     *
     * @return {T | undefined} The current value or undefined if the instance is killed.
     */
    getValue() {
        if (this.killed)
            return undefined;
        return this._value;
    }
    /**
     * Calculates and returns the size based on the current state.
     *
     * @return {number} The size, which is the number of subscriptions if not killed; otherwise, 0.
     */
    size() {
        if (this.killed)
            return 0;
        return this.subs.length;
    }
    /**
     * Subscribes an observer to this instance, monitoring its changes and handling errors if any.
     *
     * @param observer The observer object that implements the ISubscribeGroup interface which will be subscribed.
     * @param errorHandler Optional callback function to handle errors encountered during the subscription process.
     * @return An object implementing the ISubscriptionLike interface that represents the subscription,
     *         or undefined if the subscription is not successful.
     */
    subscribe(observer, errorHandler) {
        if (this.killed)
            return undefined;
        if (!this.isListener(observer))
            return undefined;
        const subscribeObject = new SubscribeObject_1.SubscribeObject(this, false);
        this.addObserver(subscribeObject, observer, errorHandler);
        return subscribeObject;
    }
    /**
     * Adds an observer to the subscribe object and associates it with a potential error handler.
     * The subscribe object is added to the list of subscriptions for tracking purposes.
     *
     * @param {SubscribeObject<T>} subscribeObject - The object that manages the subscription to observers.
     * @param {ISubscribeGroup<T>} observer - The observer to be subscribed to the subscribe object.
     * @param {IErrorCallback} [errorHandler] - Optional error handler callback to handle errors during subscription.
     * @return {void} This method does not return a value.
     */
    addObserver(subscribeObject, observer, errorHandler) {
        subscribeObject.subscribe(observer, errorHandler);
        this.subs.push(subscribeObject);
    }
    /**
     * Determines if the provided object is a valid listener.
     *
     * @param listener An instance of ISubscribeGroup of type T to validate as a listener.
     * @return Returns true if the provided listener is valid and the object is not marked as killed; otherwise, returns false.
     */
    isListener(listener) {
        if (this.killed)
            return false;
        return !!listener;
    }
    /**
     * Handles the creation and management of a SubscribeObject if the current instance is active.
     * It returns an `ISetup<T>` object to allow additional configurations or operations.
     * If the instance is in a "killed" state, it will not proceed and returns undefined.
     *
     * @return {ISetup<T> | undefined} The created SubscribeObject wrapped in an ISetup<T> interface if the instance is active, otherwise undefined.
     */
    pipe() {
        if (this.killed)
            return undefined;
        const subscribeObject = new SubscribeObject_1.SubscribeObject(this, true);
        this.subs.push(subscribeObject);
        return subscribeObject;
    }
    /**
     * Determines if the object has been destroyed.
     *
     * @return {boolean} True if the object is destroyed, false otherwise.
     */
    get isDestroyed() {
        return this.killed;
    }
}
exports.Observable = Observable;
