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
    refine(condition) {
        return this.emitByPositive(condition);
    }
    then(condition) {
        const data = this.pipeData;
        this.chainHandlers.push(() => {
            data.payload = condition(data.payload);
            data.isAvailable = true;
        });
        return this;
    }
    pushRefiners(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.emitByPositive(conditions[i]);
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
    processChain(listener) {
        const chain = this.chainHandlers;
        const data = this.pipeData;
        for (let i = 0; i < chain.length; i++) {
            data.isNeedUnsubscribe = false;
            data.isAvailable = false;
            chain[i]();
            if (data.isNeedUnsubscribe)
                return this.unsubscribe();
            if (!data.isAvailable)
                return;
            if (data.isBreakChain)
                break;
        }
        return listener(data.payload);
    }
}
exports.Pipe = Pipe;
class SwitchCase {
    pipe;
    caseCounter;
    constructor(pipe) {
        this.pipe = pipe;
        this.caseCounter = pipe.chainHandlers.length ? pipe.chainHandlers.length : 0;
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
    pushCases(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.case(conditions[i]);
        return this;
    }
}
exports.SwitchCase = SwitchCase;
