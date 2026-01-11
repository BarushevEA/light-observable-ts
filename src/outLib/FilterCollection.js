"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSwitchCase = exports.FilterCollection = void 0;
const AbstractSwitchCase_1 = require("./AbstractSwitchCase");
class FilterCollection {
    chain = [];
    flow = { isBreak: false, isAvailable: false, payload: null };
    response = { isOK: false, payload: undefined };
    errHandler;
    get isEmpty() {
        return !this.chain.length;
    }
    push(callback) {
        this.chain.push(callback);
        return this;
    }
    and(condition) {
        return this.push((data) => condition(data.payload) && (data.isAvailable = true));
    }
    allOf(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.and(conditions[i]);
        return this;
    }
    choice() {
        return new FilterSwitchCase(this);
    }
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
    addErrorHandler(errorHandler) {
        this.errHandler = errorHandler;
    }
}
exports.FilterCollection = FilterCollection;
class FilterSwitchCase extends AbstractSwitchCase_1.SwitchCase {
}
exports.FilterSwitchCase = FilterSwitchCase;
