"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCase = void 0;
class SwitchCase {
    pipe;
    counter;
    constructor(pipe) {
        this.pipe = pipe;
        this.counter = pipe.chain.length ? pipe.chain.length : 0;
    }
    or(condition) {
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
    anyOf(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.or(conditions[i]);
        return this;
    }
}
exports.SwitchCase = SwitchCase;
