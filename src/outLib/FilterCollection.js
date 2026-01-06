"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSwitchCase = exports.FilterCollection = void 0;
const AbstractSwitchCase_1 = require("./AbstractSwitchCase");
/**
 * FilterCollection is a generic class implementing the IFilter and IFilterSwitch interfaces.
 * It is designed to handle a series of filtering operations on a given payload, structured as a chain of filter methods.
 * The class allows addition of filters, chaining of multiple filters, and provides mechanisms for handling payload processing flow.
 *
 * @template T The type of data that the filters will operate upon.
 */
class FilterCollection {
    chain = [];
    flow = { isBreak: false, isAvailable: false, payload: null };
    response = { isOK: false, payload: undefined };
    errHandler;
    /**
     * Determines whether the chain is empty.
     * @return {boolean} Returns true if the chain contains no elements, otherwise false.
     */
    get isEmpty() {
        return !this.chain.length;
    }
    /**
     * Adds a callback to the filter chain and returns the current instance.
     *
     * @param {IFilterChainCallback} callback - The callback function to be added to the filter chain.
     * @return {IFilterSetup<T>} The current instance of IFilterSetup.
     */
    push(callback) {
        this.chain.push(callback);
        return this;
    }
    /**
     * Filters the data based on the given condition.
     *
     * @param {ICallback<any>} condition - A callback function that determines whether a data item should be included.
     *                                      Should return a truthy value to include the item.
     * @return {IFilterSetup<T>} - The updated filter setup after applying the condition.
     */
    filter(condition) {
        return this.push((data) => condition(data.payload) && (data.isAvailable = true));
    }
    /**
     * Adds an array of filter conditions to the current filter setup.
     *
     * @param {ICallback<any>[]} conditions - An array of callback functions representing filter conditions.
     * @return {IFilterSetup<T>} The updated filter setup instance.
     */
    pushFilters(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.filter(conditions[i]);
        return this;
    }
    /**
     * Creates and returns a new instance of the `FilterSwitchCase` class to handle switch case logic with the current context.
     *
     * @return {FilterSwitchCase<T>} A new instance of `FilterSwitchCase` initialized with the current context.
     */
    switch() {
        return new FilterSwitchCase(this);
    }
    /**
     * Processes a chain of functions with the given input value and manages the execution flow through the chain.
     *
     * @param {T} value - The input value to be processed through the chain.
     * @return {IFilterResponse} The final response containing the processing status and payload.
     */
    processChain(value) {
        const chain = this.chain;
        const data = this.flow;
        const response = this.response;
        response.isOK = false;
        response.payload = undefined;
        data.payload = value;
        data.isBreak = false;
        try {
            const len = chain.length;
            for (let i = 0; i < len; i++) {
                data.isAvailable = false;
                chain[i](data);
                if (!data.isAvailable)
                    return response;
                if (data.isBreak)
                    break;
            }
        }
        catch (err) {
            if (this.errHandler) {
                this.errHandler(err, "Filter.processChain ERROR:");
            }
            else {
                console.log("Filter.processChain ERROR:", err);
            }
            return response;
        }
        response.isOK = true;
        response.payload = data.payload;
        return response;
    }
    /**
     * Assigns an error handler function to manage errors within the application.
     *
     * @param {IErrorCallback} errorHandler - A callback function that will handle error events.
     * @return {void}
     */
    addErrorHandler(errorHandler) {
        this.errHandler = errorHandler;
    }
}
exports.FilterCollection = FilterCollection;
/**
 * The FilterSwitchCase class extends the SwitchCase class and represents a specific type of switch case
 * logic applied to a collection of filters. It is used for branching logic based on filter cases.
 *
 * @template T - The type of the elements being processed by the filters.
 */
class FilterSwitchCase extends AbstractSwitchCase_1.SwitchCase {
}
exports.FilterSwitchCase = FilterSwitchCase;
