"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeSwitchCase = exports.Pipe = void 0;
const AbstractSwitchCase_1 = require("./AbstractSwitchCase");
class Pipe {
    chain = [];
    flow = {
        isBreak: false,
        isUnsubscribe: false,
        isAvailable: false,
        debounceMs: 0,
        debounceTimer: 0,
        debounceValue: undefined,
        debounceIndex: 0,
        payload: null
    };
    push(callback) {
        this.chain.push(callback);
        return this;
    }
    once() {
        return this.push((data) => {
            this.listener(data.payload);
            data.isUnsubscribe = true;
        });
    }
    take(n) {
        if (n < 0)
            n = 0;
        let count = 0;
        return this.push((data) => {
            if (count >= n) {
                data.isUnsubscribe = true;
                return;
            }
            count++;
            this.listener(data.payload);
            if (count >= n)
                data.isUnsubscribe = true;
        });
    }
    skip(n) {
        if (n < 0)
            n = 0;
        let count = 0;
        return this.push((data) => {
            if (count < n) {
                count++;
                return;
            }
            data.isAvailable = true;
        });
    }
    unsubscribeBy(condition) {
        return this.push((data) => {
            data.isAvailable = true;
            if (condition(data.payload))
                data.isUnsubscribe = true;
        });
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
        return new PipeSwitchCase(this);
    }
    map(condition) {
        return this.push((data) => {
            data.payload = condition(data.payload);
            data.isAvailable = true;
        });
    }
    scan(fn, seed) {
        let accumulator = seed;
        return this.push((data) => {
            accumulator = fn(accumulator, data.payload);
            data.payload = accumulator;
            data.isAvailable = true;
        });
    }
    tap(fn) {
        return this.push((data) => {
            fn(data.payload);
            data.isAvailable = true;
        });
    }
    throttle(ms) {
        let lastEmitTime = 0;
        return this.push((data) => {
            const now = Date.now();
            if (now - lastEmitTime >= ms) {
                lastEmitTime = now;
                data.isAvailable = true;
            }
        });
    }
    debounce(ms) {
        return this.push((data) => {
            data.isAvailable = true;
            data.debounceMs = ms;
        });
    }
    distinctUntilChanged(comparator) {
        let hasPrevious = false;
        let previousValue;
        return this.push((data) => {
            const current = data.payload;
            if (hasPrevious) {
                const isSame = comparator
                    ? comparator(previousValue, current)
                    : previousValue === current;
                if (isSame)
                    return;
            }
            hasPrevious = true;
            previousValue = current;
            data.isAvailable = true;
        });
    }
    toJson() {
        return this.push((data) => {
            data.payload = JSON.stringify(data.payload);
            data.isAvailable = true;
        });
    }
    fromJson() {
        return this.push((data) => {
            data.payload = JSON.parse(data.payload);
            data.isAvailable = true;
        });
    }
    group() {
        return this;
    }
    processChain(listener) {
        const chain = this.chain;
        const data = this.flow;
        const len = chain.length;
        for (let i = 0; i < len; i++) {
            data.isUnsubscribe = false;
            data.isAvailable = false;
            data.debounceMs = 0;
            chain[i](data);
            if (data.isUnsubscribe)
                return this.unsubscribe();
            if (data.debounceMs > 0) {
                data.debounceValue = data.payload;
                data.debounceIndex = i + 1;
                const continueChain = () => {
                    data.debounceTimer = 0;
                    data.payload = data.debounceValue;
                    data.isBreak = false;
                    for (let j = data.debounceIndex; j < len; j++) {
                        data.isUnsubscribe = false;
                        data.isAvailable = false;
                        data.debounceMs = 0;
                        chain[j](data);
                        if (data.isUnsubscribe)
                            return this.unsubscribe();
                        if (data.debounceMs > 0) {
                            data.debounceValue = data.payload;
                            data.debounceIndex = j + 1;
                            clearTimeout(data.debounceTimer);
                            data.debounceTimer = setTimeout(continueChain, data.debounceMs);
                            return;
                        }
                        if (!data.isAvailable)
                            return;
                        if (data.isBreak)
                            break;
                    }
                    if (listener)
                        listener(data.payload);
                };
                clearTimeout(data.debounceTimer);
                data.debounceTimer = setTimeout(continueChain, data.debounceMs);
                return;
            }
            if (!data.isAvailable)
                return;
            if (data.isBreak)
                break;
        }
        data.isAvailable = true;
        if (listener)
            listener(data.payload);
    }
}
exports.Pipe = Pipe;
class PipeSwitchCase extends AbstractSwitchCase_1.SwitchCase {
    subscribe(listener, errorHandler) {
        return this.pipe.subscribe(listener, errorHandler);
    }
    group() {
        return this.pipe;
    }
}
exports.PipeSwitchCase = PipeSwitchCase;
