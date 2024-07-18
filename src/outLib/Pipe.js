"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCase = exports.Pipe = void 0;
class Pipe {
    chainHandlers = [];
    pipeData = { isBreakChain: false, isNeedUnsubscribe: false, isAvailable: false, payload: null };
    push(callback) {
        this.chainHandlers.push(callback);
        return this;
    }
    setOnce() {
        return this.push((data) => {
            this.listener(data.payload);
            data.isNeedUnsubscribe = true;
        });
    }
    unsubscribeByNegative(condition) {
        return this.push((data) => {
            data.isAvailable = true;
            if (!condition(data.payload))
                data.isNeedUnsubscribe = true;
        });
    }
    unsubscribeByPositive(condition) {
        return this.push((data) => {
            data.isAvailable = true;
            if (condition(data.payload))
                data.isNeedUnsubscribe = true;
        });
    }
    unsubscribeBy(condition) {
        return this.unsubscribeByPositive(condition);
    }
    emitByNegative(condition) {
        return this.push((data) => {
            if (!condition(data.payload))
                data.isAvailable = true;
        });
    }
    emitByPositive(condition) {
        return this.push((data) => {
            if (condition(data.payload))
                data.isAvailable = true;
        });
    }
    refine(condition) {
        return this.emitByPositive(condition);
    }
    pushRefiners(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.emitByPositive(conditions[i]);
        return this;
    }
    emitMatch(condition) {
        return this.push((data) => {
            if (condition(data.payload) == data.payload)
                data.isAvailable = true;
        });
    }
    switch() {
        return new SwitchCase(this);
    }
    then(condition) {
        return this.push((data) => {
            data.payload = condition(data.payload);
            data.isAvailable = true;
        });
    }
    serialize() {
        return this.push((data) => {
            data.payload = JSON.stringify(data.payload);
            data.isAvailable = true;
        });
    }
    deserialize() {
        return this.push((data) => {
            data.payload = JSON.parse(data.payload);
            data.isAvailable = true;
        });
    }
    processChain(listener) {
        const chain = this.chainHandlers;
        const data = this.pipeData;
        for (let i = 0; i < chain.length; i++) {
            data.isNeedUnsubscribe = false;
            data.isAvailable = false;
            chain[i](data);
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
        const chain = this.pipe.chainHandlers;
        chain.push((data) => {
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
