"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeSwitchCase = exports.Pipe = void 0;
const AbstractSwitchCase_1 = require("./AbstractSwitchCase");
class Pipe {
    chain = [];
    flow = { isBreak: false, isUnsubscribe: false, isAvailable: false, payload: null };
    push(callback) {
        this.chain.push(callback);
        return this;
    }
    setOnce() {
        return this.push((data) => {
            this.listener(data.payload);
            data.isUnsubscribe = true;
        });
    }
    unsubscribeBy(condition) {
        return this.push((data) => {
            data.isAvailable = true;
            if (condition(data.payload))
                data.isUnsubscribe = true;
        });
    }
    refine(condition) {
        return this.push((data) => {
            if (condition(data.payload))
                data.isAvailable = true;
        });
    }
    pushRefiners(conditions) {
        if (!Array.isArray(conditions))
            return this;
        for (let i = 0; i < conditions.length; i++)
            this.refine(conditions[i]);
        return this;
    }
    switch() {
        return new PipeSwitchCase(this);
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
        const chain = this.chain;
        const data = this.flow;
        for (let i = 0; i < chain.length; i++) {
            data.isUnsubscribe = false;
            data.isAvailable = false;
            chain[i](data);
            if (data.isUnsubscribe)
                return this.unsubscribe();
            if (!data.isAvailable)
                return;
            if (data.isBreak)
                break;
        }
        return listener(data.payload);
    }
}
exports.Pipe = Pipe;
class PipeSwitchCase extends AbstractSwitchCase_1.SwitchCase {
    subscribe(listener, errorHandler) {
        return this.pipe.subscribe(listener, errorHandler);
    }
}
exports.PipeSwitchCase = PipeSwitchCase;
