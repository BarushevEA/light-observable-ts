"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSwitchCase = exports.FilterCollection = void 0;
class FilterCollection {
    chainHandlers = [];
    pipeData = { isBreakChain: false, isAvailable: false, payload: null };
    response = { isOK: false, payload: undefined };
    errorHandler;
    get isEmpty() {
        return !this.chainHandlers.length;
    }
    push(callback) {
        this.chainHandlers.push(callback);
        return this;
    }
    filter(condition) {
        return this.push((data) => {
            if (condition(data.payload))
                data.isAvailable = true;
        });
    }
    pushFilters(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.filter(conditions[i]);
        return this;
    }
    switch() {
        return new FilterSwitchCase(this);
    }
    processChain(value) {
        const chain = this.chainHandlers;
        const data = this.pipeData;
        const response = this.response;
        response.isOK = false;
        response.payload = undefined;
        data.payload = value;
        data.isBreakChain = false;
        try {
            for (let i = 0; i < chain.length; i++) {
                data.isAvailable = false;
                chain[i](data);
                if (!data.isAvailable)
                    return response;
                if (data.isBreakChain)
                    break;
            }
        }
        catch (err) {
            if (this.errorHandler) {
                this.errorHandler(err, "Filter.processChain ERROR:");
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
    addErrorHandler(errorHandler) {
        this.errorHandler = errorHandler;
    }
}
exports.FilterCollection = FilterCollection;
class FilterSwitchCase {
    pipe;
    caseCounter;
    constructor(pipe) {
        this.pipe = pipe;
        this.caseCounter = pipe.chainHandlers.length ? pipe.chainHandlers.length : 0;
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
exports.FilterSwitchCase = FilterSwitchCase;
