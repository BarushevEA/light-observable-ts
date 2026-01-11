import {IErrorCallback, IGroupSubscription, IListener, IObserver, ISubscribeGroup, ISubscribeObject, ISubscriptionLike} from "./Types";
import {Pipe} from "./Pipe";
import {getListener} from "./FunctionLibs";

/**
 * A class that represents an observable object with subscription, pausing,
 * and piping functionalities. It allows subscribing to updates, handling errors,
 * and processing values through a chain.
 *
 * @template T The type of values handled by SubscribeObject.
 * @extends Pipe<T>
 * @implements ISubscribeObject<T>
 */
export class SubscribeObject<T> extends Pipe<T> implements ISubscribeObject<T> {
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
    errorHandler: IErrorCallback = (errorData: any, errorMessage: any) => {
        console.log(`(Unit of SubscribeObject).send(${errorData}) ERROR:`, errorMessage);
    };
    _order = 0;
    paused = false;
    piped = false;

    /**
     * Additional listeners for group() subscription pattern.
     * Allows multiple listeners to share a single pipe execution.
     *
     * @type {IListener<T>[] | undefined}
     */
    listeners?: IListener<T>[];

    /**
     * Error handlers corresponding to additional listeners.
     * Each error handler is paired with its listener by array index.
     *
     * @type {IErrorCallback[] | undefined}
     */
    errorHandlers?: IErrorCallback[];

    /**
     * Constructs an instance of the class.
     *
     * @param {IObserver<T>} [observable] - The observer instance to be assigned. Optional parameter.
     * @param {boolean} [isPipe=false] - Determines whether the instance is piped. Defaults to false.
     * @return {void}
     */
    constructor(observable?: IObserver<T>, isPipe?: boolean) {
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
    subscribe(observer: ISubscribeGroup<T>, errorHandler?: IErrorCallback): ISubscriptionLike {
        this.listener = getListener(observer);
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }

    /**
     * Adds one or more listeners to this group subscription.
     * Used with the `.group()` operator for optimized multi-listener pattern.
     *
     * @param {IListener<T> | IListener<T>[]} listener - A single listener or array of listeners to add.
     * @param {IErrorCallback | IErrorCallback[]} [errorHandler] - Optional error handler(s) for the listener(s).
     * @return {IGroupSubscription<T>} Returns this instance cast to IGroupSubscription for chaining.
     */
    public add(listener: IListener<T> | IListener<T>[], errorHandler?: IErrorCallback | IErrorCallback[]): IGroupSubscription<T> {
        // Initialize arrays if not exist
        if (!this.listeners) {
            this.listeners = [];
            this.errorHandlers = [];
        }

        // Handle array of listeners
        if (Array.isArray(listener)) {
            for (let i = 0; i < listener.length; i++) {
                this.listeners.push(listener[i]);
                const handler: IErrorCallback = (errorHandler && Array.isArray(errorHandler))
                    ? (errorHandler[i] ?? this.errorHandler)  // Fallback to default if index out of bounds
                    : (errorHandler as IErrorCallback || this.errorHandler);
                this.errorHandlers!.push(handler);
            }
        } else {
            this.listeners.push(listener);
            const handler: IErrorCallback = (errorHandler && !Array.isArray(errorHandler))
                ? errorHandler
                : this.errorHandler;
            this.errorHandlers!.push(handler);
        }

        return this as any as IGroupSubscription<T>;
    }

    /**
     * Unsubscribes the current instance from the associated observer, clears the listener,
     * and resets the internal chain.
     * This method ensures that the instance is properly cleaned up and no longer receives updates.
     *
     * @return {void} Does not return a value.
     */
    public unsubscribe(): void {
        if (!this.observer) return;
        this.observer.unSubscribe(this);
        this.observer = <any>null;
        this.listener = <any>null;
        this.chain.length = 0;
    }

    /**
     * Sends the specified value for processing and updates the flow state.
     *
     * @param {T} value - The value to be sent and processed.
     * @return {void} Does not return a value.
     */
    send(value: T): void {
        const listener = this.listener;
        const hasGroupListeners = this.listeners && this.listeners.length > 0;

        // Unsubscribe only if there's no listener AND no group listeners
        if (!listener && !hasGroupListeners) {
            this.unsubscribe();
            return;
        }
        if (!this.observer || this.paused) return;

        // Fast path (no pipe)
        if (!this.piped) {
            // Call primary listener if exists
            if (listener) {
                try {
                    listener(value);
                } catch (err) {
                    this.errorHandler(value, err);
                }
            }

            // Emit to additional listeners (group pattern)
            if (hasGroupListeners) {
                for (let i = 0; i < this.listeners!.length; i++) {
                    try {
                        this.listeners![i](value);
                    } catch (err) {
                        this.errorHandlers![i](value, err);
                    }
                }
            }

            return;
        }

        // Slow path (with pipe)
        try {
            this.flow.payload = value;
            this.flow.isBreak = false;

            // Process chain with primary listener if exists
            if (listener) {
                this.processChain(listener);
            } else {
                // No primary listener, process chain to filter value for group listeners
                const chain = this.chain;
                const data = this.flow;
                const len = chain.length;

                // If a chain is empty, the value passes through automatically for group listeners
                data.isAvailable = len === 0;

                for (let i = 0; i < len; i++) {
                    data.isUnsubscribe = false;
                    data.isAvailable = false;

                    chain[i](data);
                    if (data.isUnsubscribe) {
                        this.unsubscribe();
                        return;
                    }
                    if (!data.isAvailable) return; // Value rejected by filter
                    if (data.isBreak) break;
                }
            }

            // Emit to additional listeners (group pattern) with processed value
            if (hasGroupListeners) {
                const processedValue = this.flow.payload;
                for (let i = 0; i < this.listeners!.length; i++) {
                    try {
                        this.listeners![i](processedValue);
                    } catch (err) {
                        this.errorHandlers![i](processedValue, err);
                    }
                }
            }
        } catch (err) {
            this.errorHandler(value, err);
        }
    }

    /**
     * Resumes the current process or operation from a paused state.
     * Updates the internal state to indicate that it is no longer paused.
     *
     * @return {void} Does not return a value.
     */
    resume(): void {
        this.paused = false;
    }

    /**
     * Pauses the current operation or process by setting the paused state to true.
     *
     * @return {void} No value is returned.
     */
    pause(): void {
        this.paused = true;
    }

    /**
     * Retrieves the current order value.
     *
     * @return {number} The current value of the order.
     */
    get order(): number {
        return this._order;
    }

    /**
     * Sets the order value.
     *
     * @param {number} value - The numerical value to set as the order.
     */
    set order(value: number) {
        this._order = value;
    }

}
