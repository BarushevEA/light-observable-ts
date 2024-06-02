"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCase = exports.Pipe = void 0;
class Pipe {
    chainHandlers = [];
    pipeData = { isBreakChain: false, isNeedUnsubscribe: false, isAvailable: false, payload: null };
    setOnce() {
        const data = this.pipeData;
        this.chainHandlers.push(() => {
            this.listener(data.payload);
            data.isNeedUnsubscribe = true;
        });
        return this;
    }
    unsubscribeByNegative(condition) {
        const data = this.pipeData;
        this.chainHandlers.push(() => {
            data.isAvailable = true;
            if (!condition(data.payload))
                data.isNeedUnsubscribe = true;
        });
        return this;
    }
    unsubscribeByPositive(condition) {
        const data = this.pipeData;
        this.chainHandlers.push(() => {
            data.isAvailable = true;
            if (condition(data.payload))
                data.isNeedUnsubscribe = true;
        });
        return this;
    }
    emitByNegative(condition) {
        const data = this.pipeData;
        this.chainHandlers.push(() => {
            if (!condition(data.payload))
                data.isAvailable = true;
        });
        return this;
    }
    emitByPositive(condition) {
        const data = this.pipeData;
        this.chainHandlers.push(() => {
            if (condition(data.payload))
                data.isAvailable = true;
        });
        return this;
    }
    emitMatch(condition) {
        const data = this.pipeData;
        this.chainHandlers.push(() => {
            if (condition(data.payload) == data.payload)
                data.isAvailable = true;
        });
        return this;
    }
    switch() {
        return new SwitchCase(this);
    }
}
exports.Pipe = Pipe;
class SwitchCase {
    pipe;
    caseCounter = 0;
    constructor(pipe) {
        this.pipe = pipe;
    }
    subscribe(listener, errorHandler) {
        return this.pipe.subscribe(listener, errorHandler);
    }
    case(condition) {
        this.caseCounter++;
        const id = this.caseCounter;
        const data = this.pipe.pipeData;
        const chain = this.pipe.chainHandlers;
        chain.push(() => {
            data.isAvailable = true;
            if (condition(data.payload))
                data.isBreakChain = true;
            if (id === chain.length && !data.isBreakChain)
                data.isAvailable = false;
        });
        return this;
    }
}
exports.SwitchCase = SwitchCase;
