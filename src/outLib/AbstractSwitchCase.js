"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCase = void 0;
/**
 * Abstract class representing a Switch-Case control structure for handling
 * conditional chains of operations.
 *
 * @template T - The type of the input payload expected by the conditions.
 * @template P - The type extending IChainContainer, representing the container for the chain of operations.
 * @template W - The type of the subclass or the expected return type for method chaining.
 */
class SwitchCase {
    pipe;
    counter;
    /**
     * Creates an instance of the class and initializes the pipe and counter.
     *
     * @param {P} pipe - The pipe object used for initialization.
     * @return {void}
     */
    constructor(pipe) {
        this.pipe = pipe;
        this.counter = pipe.chain.length ? pipe.chain.length : 0;
    }
    /**
     * Adds a conditional case to the processing chain. The case determines
     * whether further processing should continue based on the provided condition.
     *
     * @param {ICallback<any>} condition - A callback function that takes a payload
     * and evaluates a condition. If the condition is met, further processing may be stopped.
     * @return {W} Returns the current instance for method chaining.
     */
    case(condition) {
        this.counter++;
        const id = this.counter;
        const chain = this.pipe.chain;
        chain.push((data) => {
            data.isAvailable = true;
            if (condition(data.payload))
                data.isBreak = true;
            if (id === chain.length && !data.isBreak)
                data.isAvailable = false;
        });
        return this;
    }
    /**
     * Adds an array of conditions to the current instance by iterating through the provided array
     * and adding each individual condition using the `case` method of the instance.
     *
     * @param {ICallback<any>[]} conditions - An array of callback functions representing conditions to be added.
     * @return {W} The current instance after all conditions have been added.
     */
    pushCases(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.case(conditions[i]);
        return this;
    }
}
exports.SwitchCase = SwitchCase;
