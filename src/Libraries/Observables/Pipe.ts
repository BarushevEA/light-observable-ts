import {
    ICallback,
    IChainCallback,
    IErrorCallback,
    IGroupSubscription,
    IListener,
    IPipeCase,
    IPipePayload,
    ISetObservableValue,
    ISetup,
    ISubscribe,
    ISubscriptionLike
} from "./Types";
import {SwitchCase} from "./AbstractSwitchCase";

/**
 * An abstract class that provides a flexible pipeline mechanism to process and transform streamed data.
 * The `Pipe` class allows chaining of operations, conditional transformations, and controlled subscription handling.
 *
 * @template T The type of data handled by this pipeline.
 */
export abstract class Pipe<T> implements ISubscribe<T> {
    chain: IChainCallback [] = [];
    flow: IPipePayload = {
        isBreak: false,
        isUnsubscribe: false,
        isAvailable: false,
        debounceMs: 0,
        debounceTimer: 0,
        debounceValue: undefined,
        debounceIndex: 0,
        payload: null};

    /**
     * Subscribes a listener to observe changes or updates. Can optionally handle errors during the subscription process.
     *
     * @param {IListener<T> | ISetObservableValue} listener - The listener or handler that will receive notifications of updates.
     * @param {IErrorCallback} [errorHandler] - An optional callback to handle errors that occur during subscription.
     * @return {ISubscriptionLike | undefined} An object representing the subscription, or undefined if the subscription could not be created.
     */
    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike;

    private push(callback: IChainCallback): ISetup<T> {
        this.chain.push(callback);
        return this;
    }

    /**
     * Subscribes to an event and ensures the listener is called only once.
     * After the listener is invoked, it unsubscribes automatically.
     *
     * @return {ISubscribe<T>} The subscription instance allowing further chaining or management.
     */
    once(): ISubscribe<T> {
        return this.push(
            (data: IPipePayload): void => {
                (<IListener<T>>(<any>this).listener)(data.payload);
                data.isUnsubscribe = true;
            }
        );
    }

    /**
     * Passes the first N values through the pipe, then automatically unsubscribes.
     * Generalization of `once()` — `once()` is equivalent to `take(1)`.
     *
     * @param {number} n - The number of values to receive before unsubscribing.
     * @return {ISubscribe<T>} The subscription instance allowing further chaining or management.
     */
    take(n: number): ISubscribe<T> {
        if (n < 0) n = 0;
        let count = 0;
        return this.push(
            (data: IPipePayload): void => {
                if (count >= n) {
                    data.isUnsubscribe = true;
                    return;
                }
                count++;
                (<IListener<T>>(<any>this).listener)(data.payload);
                if (count >= n) data.isUnsubscribe = true;
            }
        );
    }

    /**
     * Ignores the first N values in the pipe, then passes all subsequent values through.
     * Mirror of `take(n)` — skip drops the head, take drops the tail.
     *
     * @param {number} n - The number of values to ignore before passing values through.
     * @return {ISetup<T>} The current setup instance for chaining purposes.
     */
    skip(n: number): ISetup<T> {
        if (n < 0) n = 0;
        let count = 0;
        return this.push(
            (data: IPipePayload): void => {
                if (count < n) {
                    count++;
                    return;
                }
                data.isAvailable = true;
            }
        );
    }

    /**
     * Unsubscribes based on a given condition. The condition is evaluated against
     * the payload, and if the condition returns true, the subscription is marked
     * for unsubscription.
     *
     * @param {ICallback<T>} condition - A callback function that determines whether a
     * subscription should be unsubscribed. It receives the payload as an argument
     * and should return a boolean value.
     * @return {ISetup<T>} The current setup instance for chaining purposes.
     */
    unsubscribeBy(condition: ICallback<T>): ISetup<T> {
        return this.push(
            (data: IPipePayload): void => {
                data.isAvailable = true;
                if (condition(data.payload)) data.isUnsubscribe = true;
            }
        );
    }

    /**
     * Applies an AND-logic filter condition to the workflow pipeline.
     *
     * @param {ICallback<T>} condition - A callback function that evaluates a condition
     *                                    on the payload data and returns a boolean.
     * @return {ISetup<T>} Returns the updated setup with the filter condition applied.
     */
    and(condition: ICallback<T>): ISetup<T> {
        return this.push(
            (data: IPipePayload): void => { if (condition(data.payload)) data.isAvailable = true; }
        );
    }

    /**
     * Applies multiple AND-logic filter conditions (all must pass).
     *
     * @param {ICallback<any>[]} conditions - An array of callback functions to be applied.
     * @return {ISetup<T>} The current setup instance after processing the conditions.
     */
    allOf(conditions: ICallback<any>[]): ISetup<T> {
        if (!Array.isArray(conditions)) return this;
        for (let i = 0; i < conditions.length; i++) this.and(conditions[i]);
        return this;
    }

    /**
     * Creates and returns a new instance of the PipeSwitchCase class,
     * enabling OR-logic branching for the current context.
     *
     * @return {PipeSwitchCase<T>} A new instance of PipeSwitchCase associated with the current context.
     */
    choice(): PipeSwitchCase<T> {
        return new PipeSwitchCase<T>(this);
    }

    /**
     * Transforms the payload using the provided callback and changes the data type.
     * The condition is applied to the current payload and sets a flag indicating its availability.
     *
     * @param {ICallback<T>} condition - The callback function to execute on the current payload. It processes the payload and returns a new value.
     * @return {ISetup<K>} An instance of the setup interface, allowing further chaining of operations.
     */
    map<K>(condition: ICallback<T>): ISetup<K> {
        return <any>this.push(
            (data: IPipePayload): void => {
                data.payload = condition(data.payload);
                data.isAvailable = true;
            }
        ) as ISetup<K>;
    }

    /**
     * Accumulator operator — each value passes through a reducer function,
     * the accumulated result is emitted. Like `Array.reduce()` for streams.
     *
     * @template K The type of the accumulated value.
     * @param {function} fn - Reducer function `(accumulator, value) => newAccumulator`.
     * @param {K} seed - Initial value of the accumulator.
     * @return {ISetup<K>} An instance of the setup interface with the accumulated type.
     */
    scan<K>(fn: (accumulator: K, value: T) => K, seed: K): ISetup<K> {
        let accumulator = seed;
        return <any>this.push(
            (data: IPipePayload): void => {
                accumulator = fn(accumulator, data.payload);
                data.payload = accumulator;
                data.isAvailable = true;
            }
        ) as ISetup<K>;
    }

    /**
     * Executes a side-effect function on the current payload without modifying it.
     * The value passes through unchanged to the next operator in the chain.
     * Useful for logging, debugging, or triggering external actions mid-pipeline.
     *
     * @param {ICallback<T>} fn - Side-effect function called with the current payload.
     * @return {ISetup<T>} The current setup instance for chaining purposes.
     */
    tap(fn: ICallback<T>): ISetup<T> {
        return this.push(
            (data: IPipePayload): void => {
                fn(data.payload);
                data.isAvailable = true;
            }
        );
    }

    /**
     * Throttles emissions using a leading-edge strategy.
     * The first value passes immediately; subsequent values within the
     * cooldown interval are silently dropped.
     *
     * @param {number} ms - Minimum interval between emissions in milliseconds.
     * @return {ISetup<T>} The current setup instance for chaining purposes.
     */
    throttle(ms: number): ISetup<T> {
        let lastEmitTime = 0;
        return this.push(
            (data: IPipePayload): void => {
                const now = Date.now();
                if (now - lastEmitTime >= ms) {
                    lastEmitTime = now;
                    data.isAvailable = true;
                }
            }
        );
    }

    /**
     * Debounces emissions using a trailing-edge strategy.
     * Each new value resets the timer. The value is emitted after `ms`
     * milliseconds of silence (no new values).
     *
     * @param {number} ms - Delay in milliseconds after the last value before emission.
     * @return {ISetup<T>} The current setup instance for chaining purposes.
     */
    debounce(ms: number): ISetup<T> {
        return this.push(
            (data: IPipePayload): void => {
                data.isAvailable = true;
                data.debounceMs = ms;
            }
        );
    }

    /**
     * Suppresses consecutive duplicate values.
     * A value is emitted only when it differs from the previously emitted value.
     * The first value always passes through.
     *
     * @param {function} [comparator] - Optional function `(previous, current) => boolean`.
     *   Returns `true` when values are considered equal (suppressed). Defaults to `===`.
     * @return {ISetup<T>} The current setup instance for chaining purposes.
     */
    distinctUntilChanged(comparator?: (previous: T, current: T) => boolean): ISetup<T> {
        let hasPrevious = false;
        let previousValue: T;
        return this.push(
            (data: IPipePayload): void => {
                const current = data.payload;
                if (hasPrevious) {
                    const isSame = comparator
                        ? comparator(previousValue, current)
                        : previousValue === current;
                    if (isSame) return;
                }
                hasPrevious = true;
                previousValue = current;
                data.isAvailable = true;
            }
        );
    }

    /**
     * Converts the payload to a JSON string and
     * sets the `isAvailable` property to true.
     *
     * @return {ISetup<string>} The modified setup instance with the JSON payload.
     */
    toJson(): ISetup<string> {
        return <any>this.push(
            (data: IPipePayload): void => {
                data.payload = JSON.stringify(data.payload);
                data.isAvailable = true;
            }
        ) as ISetup<string>;
    }

    /**
     * Parses the payload from JSON string into a JavaScript object using JSON.parse
     * and marks the data as available.
     *
     * @template K - The type of the setup to be returned.
     * @return {ISetup<K>} The setup instance after parsing the JSON payload.
     */
    fromJson<K>(): ISetup<K> {
        return <any>this.push(
            (data: IPipePayload): void => {
                data.payload = JSON.parse(data.payload);
                data.isAvailable = true;
            }
        ) as ISetup<K>;
    }

    /**
     * Converts this pipe to a group subscription for optimized multi-listener pattern.
     * Acts as a type finalizer - prevents further operator chaining via TypeScript type system.
     *
     * @return {IGroupSubscription<T>} A group subscription interface with add() and unsubscribe() methods.
     */
    group(): IGroupSubscription<T> {
        return this as any as IGroupSubscription<T>;
    }

    /**
     * Processes a chain of functions with the given listener and flow data.
     * Sets `data.isAvailable = true` when chain completes successfully.
     *
     * @param {IListener<T>} [listener] - Optional listener executed after chain completes.
     * @return {void} This method does not return a value.
     */
    processChain(listener?: IListener<T>): void {
        const chain = this.chain;
        const data = this.flow;
        const len = chain.length;
        for (let i = 0; i < len; i++) {
            data.isUnsubscribe = false;
            data.isAvailable = false;
            data.debounceMs = 0;

            chain[i](data);
            if (data.isUnsubscribe) return (<any>this).unsubscribe();

            if (data.debounceMs > 0) {
                data.debounceValue = data.payload;
                data.debounceIndex = i + 1;

                const continueChain = () => {
                    data.debounceTimer = 0;
                    data.payload = data.debounceValue;
                    data.isBreak = false;
                    for (let j = data.debounceIndex; j < len; j++) {
                        data.isUnsubscribe = false;
                        data.isAvailable = false;
                        data.debounceMs = 0;
                        chain[j](data);
                        if (data.isUnsubscribe) return (<any>this).unsubscribe();
                        if (data.debounceMs > 0) {
                            data.debounceValue = data.payload;
                            data.debounceIndex = j + 1;
                            clearTimeout(data.debounceTimer);
                            data.debounceTimer = setTimeout(continueChain, data.debounceMs);
                            return;
                        }
                        if (!data.isAvailable) return;
                        if (data.isBreak) break;
                    }
                    if (listener) listener(data.payload);
                };

                clearTimeout(data.debounceTimer);
                data.debounceTimer = setTimeout(continueChain, data.debounceMs);
                return;
            }

            if (!data.isAvailable) return;
            if (data.isBreak) break;
        }

        data.isAvailable = true;
        if (listener) listener(data.payload);
    }
}

/**
 * The `PipeSwitchCase` class extends the functionality of the `SwitchCase`
 * class, tailored for use with `Pipe` objects. It provides a mechanism for
 * managing and subscribing to a pipeline of transformations or processes
 * conditioned by specific cases.
 *
 * This class also implements `ISubscribe` to allow subscription to the
 * underlying pipeline for observing or reacting to its events or values.
 *
 * @template T The type of the data being handled by the `PipeSwitchCase`.
 * @extends {SwitchCase<T, Pipe<T>, IPipeCase<T>>}
 * @implements {ISubscribe<T>}
 */
export class PipeSwitchCase<T> extends SwitchCase<T, Pipe<T>, IPipeCase<T>> implements ISubscribe<T> {
    /**
     * Subscribes a listener to the underlying pipe, delegating to the pipe's subscribe method.
     *
     * @param {IListener<T> | ISetObservableValue} listener - The listener or handler that will receive notifications.
     * @param {IErrorCallback} [errorHandler] - An optional callback to handle errors during subscription.
     * @return {ISubscriptionLike | undefined} An object representing the subscription, or undefined if the subscription could not be created.
     */
    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike {
        return this.pipe.subscribe(listener, errorHandler);
    }

    /**
     * Converts this switch-case pipe to a group subscription for optimized multi-listener pattern.
     * Acts as a type finalizer - prevents further operator chaining via TypeScript type system.
     *
     * @return {IGroupSubscription<T>} A group subscription interface with add() and unsubscribe() methods.
     */
    group(): IGroupSubscription<T> {
        return this.pipe as any as IGroupSubscription<T>;
    }
}
