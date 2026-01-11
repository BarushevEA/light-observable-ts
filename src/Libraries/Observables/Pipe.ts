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
    flow: IPipePayload = {isBreak: false, isUnsubscribe: false, isAvailable: false, payload: null};

    /**
     * Subscribes a listener to observe changes or updates. Can optionally handle errors during the subscription process.
     *
     * @param {IListener<T> | ISetObservableValue} listener - The listener or handler that will receive notifications of updates.
     * @param {IErrorCallback} [errorHandler] - An optional callback to handle errors that occur during subscription.
     * @return {ISubscriptionLike | undefined} An object representing the subscription, or undefined if the subscription could not be created.
     */
    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;

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
            (data: IPipePayload): void => condition(data.payload) && (data.isAvailable = true) as any
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
     *
     * @param {IListener<T>} listener - The listener to be executed after the chain is processed.
     *                                   Receives the payload of the flow data.
     * @return {void} This method does not return a value.
     */
    processChain(listener: IListener<T>): void {
        const chain = this.chain;
        const data = this.flow;
        const len = chain.length;
        for (let i = 0; i < len; i++) {
            data.isUnsubscribe = false;
            data.isAvailable = false;

            chain[i](data);
            if (data.isUnsubscribe) return (<any>this).unsubscribe();
            if (!data.isAvailable) return;
            if (data.isBreak) break;
        }

        return listener(data.payload);
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
    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined {
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
