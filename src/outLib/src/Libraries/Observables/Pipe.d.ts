import { ICallback, IChainCallback, IErrorCallback, IListener, IPipeCase, IPipePayload, ISetObservableValue, ISetup, ISubscribe, ISubscriptionLike } from "./Types";
import { SwitchCase } from "./AbstractSwitchCase";
/**
 * An abstract class that provides a flexible pipeline mechanism to process and transform streamed data.
 * The `Pipe` class allows chaining of operations, conditional transformations, and controlled subscription handling.
 *
 * @template T The type of data handled by this pipeline.
 */
export declare abstract class Pipe<T> implements ISubscribe<T> {
    chain: IChainCallback[];
    flow: IPipePayload;
    /**
     * Subscribes a listener to observe changes or updates. Can optionally handle errors during the subscription process.
     *
     * @param {IListener<T> | ISetObservableValue} listener - The listener or handler that will receive notifications of updates.
     * @param {IErrorCallback} [errorHandler] - An optional callback to handle errors that occur during subscription.
     * @return {ISubscriptionLike | undefined} An object representing the subscription, or undefined if the subscription could not be created.
     */
    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    private push;
    /**
     * Subscribes to an event and ensures the listener is called only once.
     * After the listener is invoked, it unsubscribes automatically.
     *
     * @return {ISubscribe<T>} The subscription instance allowing further chaining or management.
     */
    setOnce(): ISubscribe<T>;
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
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
    /**
     * Applies a refinement condition to the workflow pipeline.
     *
     * @param {ICallback<T>} condition - A callback function that evaluates a condition
     *                                    on the payload data and returns a boolean.
     * @return {ISetup<T>} Returns the updated setup with the refined condition applied.
     */
    refine(condition: ICallback<T>): ISetup<T>;
    /**
     * Adds an array of conditions to be processed by the refinement function.
     *
     * @param {ICallback<any>[]} conditions - An array of callback functions to be refined.
     * @return {ISetup<T>} The current setup instance after processing the conditions.
     */
    pushRefiners(conditions: ICallback<any>[]): ISetup<T>;
    /**
     * Creates and returns a new instance of the PipeSwitchCase class,
     * enabling conditional logic or case-switch handling for the current context.
     *
     * @return {PipeSwitchCase<T>} A new instance of PipeSwitchCase associated with the current context.
     */
    switch(): PipeSwitchCase<T>;
    /**
     * Registers a condition callback to be executed within the pipeline and modifies the payload of the current data.
     * The condition is applied to the current payload and sets a flag indicating its availability.
     *
     * @param {ICallback<T>} condition - The callback function to execute on the current payload. It processes the payload and returns a new value.
     * @return {ISetup<K>} An instance of the setup interface, allowing further chaining of operations.
     */
    then<K>(condition: ICallback<T>): ISetup<K>;
    /**
     * Serializes the payload of the given data object into a JSON string and
     * sets the `isAvailable` property to true.
     *
     * @return {ISetup<string>} The modified setup instance with the serialized payload.
     */
    serialize(): ISetup<string>;
    /**
     * Deserializes the payload of the provided data into a JavaScript object using JSON.parse
     * and marks the data as available.
     *
     * @template K - The type of the setup to be returned.
     * @return {ISetup<K>} The setup instance after deserializing the payload.
     */
    deserialize<K>(): ISetup<K>;
    /**
     * Processes a chain of functions with the given listener and flow data.
     *
     * @param {IListener<T>} listener - The listener to be executed after the chain is processed.
     *                                   Receives the payload of the flow data.
     * @return {void} This method does not return a value.
     */
    processChain(listener: IListener<T>): void;
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
export declare class PipeSwitchCase<T> extends SwitchCase<T, Pipe<T>, IPipeCase<T>> implements ISubscribe<T> {
    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
}
