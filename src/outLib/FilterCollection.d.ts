import { ICallback, IErrorCallback, IFilter, IFilterCase, IFilterChainCallback, IFilterPayload, IFilterResponse, IFilterSetup, IFilterSwitch } from "./Types";
import { SwitchCase } from "./AbstractSwitchCase";
/**
 * FilterCollection is a generic class implementing the IFilter and IFilterSwitch interfaces.
 * It is designed to handle a series of filtering operations on a given payload, structured as a chain of filter methods.
 * The class allows addition of filters, chaining of multiple filters, and provides mechanisms for handling payload processing flow.
 *
 * @template T The type of data that the filters will operate upon.
 */
export declare class FilterCollection<T> implements IFilter<T>, IFilterSwitch<T> {
    chain: IFilterChainCallback[];
    flow: IFilterPayload;
    response: IFilterResponse;
    private errHandler;
    /**
     * Determines whether the chain is empty.
     * @return {boolean} Returns true if the chain contains no elements, otherwise false.
     */
    get isEmpty(): boolean;
    /**
     * Adds a callback to the filter chain and returns the current instance.
     *
     * @param {IFilterChainCallback} callback - The callback function to be added to the filter chain.
     * @return {IFilterSetup<T>} The current instance of IFilterSetup.
     */
    private push;
    /**
     * Filters the data based on the given condition.
     *
     * @param {ICallback<any>} condition - A callback function that determines whether a data item should be included.
     *                                      Should return a truthy value to include the item.
     * @return {IFilterSetup<T>} - The updated filter setup after applying the condition.
     */
    filter(condition: ICallback<any>): IFilterSetup<T>;
    /**
     * Adds an array of filter conditions to the current filter setup.
     *
     * @param {ICallback<any>[]} conditions - An array of callback functions representing filter conditions.
     * @return {IFilterSetup<T>} The updated filter setup instance.
     */
    pushFilters(conditions: ICallback<any>[]): IFilterSetup<T>;
    /**
     * Creates and returns a new instance of the `FilterSwitchCase` class to handle switch case logic with the current context.
     *
     * @return {FilterSwitchCase<T>} A new instance of `FilterSwitchCase` initialized with the current context.
     */
    switch(): FilterSwitchCase<T>;
    /**
     * Processes a chain of functions with the given input value and manages the execution flow through the chain.
     *
     * @param {T} value - The input value to be processed through the chain.
     * @return {IFilterResponse} The final response containing the processing status and payload.
     */
    processChain(value: T): IFilterResponse;
    /**
     * Assigns an error handler function to manage errors within the application.
     *
     * @param {IErrorCallback} errorHandler - A callback function that will handle error events.
     * @return {void}
     */
    addErrorHandler(errorHandler: IErrorCallback): void;
}
/**
 * The FilterSwitchCase class extends the SwitchCase class and represents a specific type of switch case
 * logic applied to a collection of filters. It is used for branching logic based on filter cases.
 *
 * @template T - The type of the elements being processed by the filters.
 */
export declare class FilterSwitchCase<T> extends SwitchCase<T, FilterCollection<T>, IFilterCase<T>> {
}
