import {FilterSwitchCase} from "./FilterCollection";
import {ICallback} from "./CoreTypes";

/**
 * Represents the structure of a filter payload.
 */
export type IFilterPayload = { isBreak: boolean, isAvailable: boolean, payload: any };

/**
 * Represents a callback function that is invoked during a filter chain operation.
 *
 * @callback IFilterChainCallback
 * @param {IFilterPayload} data - The payload data to be processed by the callback during the filter chain execution.
 */
export type IFilterChainCallback = (data: IFilterPayload) => void;

/**
 * Represents the response format for a filtering operation.
 */
export type IFilterResponse = {
    isOK: boolean;
    payload: any;
};

/**
 * Represents a generic filtering interface that applies conditions to a data set.
 *
 * @template T The type of data this filter will operate on.
 */
export type IFilter<T> = {
    and(condition: ICallback<any>): IFilterSetup<T>;
    allOf(conditions: ICallback<any>[]): IFilterSetup<T>;
};

/**
 * Represents a setup for filtering that combines the functionality of IFilter and IFilterSwitch interfaces.
 *
 * @template T The type of the items to be filtered by the setup.
 */
export type IFilterSetup<T> = IFilter<T> & IFilterSwitch<T>;

/**
 * Interface representing a filter switch mechanism.
 *
 * @template T Type of the context or condition used by the filter switch.
 */
export type IFilterSwitch<T> = {
    choice(): FilterSwitchCase<T>;
};

/**
 * Represents a filtering construct that allows chaining of conditional cases.
 *
 * @template T - The type of the elements to be filtered.
 */
export type IFilterCase<T> = {
    or(condition: ICallback<any>): IFilterCase<T>;
    anyOf(conditions: ICallback<any>[]): IFilterCase<T>;
};

/**
 * Represents an interface for adding a filter to a specific setup or configuration.
 *
 * @template T - The type that the filter setup operates on.
 */
export type IAddFilter<T> = {
    addFilter(): IFilterSetup<T>;
}
