import {ICallback, IChainContainer, IPipePayload} from "./Types";

/**
 * Abstract class representing a Switch-Case control structure for handling
 * conditional chains of operations.
 *
 * @template T - The type of the input payload expected by the conditions.
 * @template P - The type extending IChainContainer, representing the container for the chain of operations.
 * @template W - The type of the subclass or the expected return type for method chaining.
 */
export abstract class SwitchCase<T, P extends IChainContainer, W> {
    protected pipe: P;
    protected counter: number;

    /**
     * Creates an instance of the class and initializes the pipe and counter.
     *
     * @param {P} pipe - The pipe object used for initialization.
     * @return {void}
     */
    constructor(pipe: P) {
        this.pipe = pipe;
        this.counter = pipe.chain.length ? pipe.chain.length : 0;
    }

    /**
     * Adds an OR-logic case to the processing chain.
     * Determines whether further processing should continue based on the provided condition.
     *
     * @param {ICallback<any>} condition - A callback function that takes a payload
     * and evaluates a condition. If the condition is met, further processing may be stopped.
     * @return {W} Returns the current instance for method chaining.
     */
    or(condition: ICallback<any>): W {
        this.counter++;
        const id = this.counter;
        const chain = this.pipe.chain;
        chain.push(
            (data: IPipePayload): void => {
                data.isAvailable = true
                if (condition(data.payload as T)) data.isBreak = true;
                if (id === chain.length && !data.isBreak) data.isAvailable = false;
            }
        );
        return this as any;
    }

    /**
     * Adds multiple OR-logic cases (first match wins).
     *
     * @param {ICallback<any>[]} conditions - An array of callback functions representing conditions to be added.
     * @return {W} The current instance after all conditions have been added.
     */
    anyOf(conditions: ICallback<any>[]): W {
        if (!Array.isArray(conditions)) return this as any;
        for (let i = 0; i < conditions.length; i++) this.or(conditions[i]);
        return this as any;
    }
}
