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
        payload: null,
        listener: undefined,
        index: 0
    };
    push(callback) {
        this.chain.push(callback);
        return this;
    }
    once() {
        return this.push((data) => {
            if (data.listener)
                data.listener(data.payload);
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
            if (data.listener)
                data.listener(data.payload);
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
        return this.push((data) => { if (condition(data.payload))
            data.isAvailable = true; });
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
            data.debounceValue = data.payload;
            data.debounceIndex = data.index + 1;
            const len = this.chain.length;
            clearTimeout(data.debounceTimer);
            data.debounceTimer = setTimeout(() => {
                try {
                    data.payload = data.debounceValue;
                    data.isBreak = false;
                    this.runChain(data.debounceIndex, len, data);
                }
                catch (err) {
                    const errorHandler = this.errorHandler;
                    if (errorHandler)
                        errorHandler(data.payload, err);
                }
            }, ms);
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
    runChain(startIndex, len, data) {
        const chain = this.chain;
        for (let i = startIndex; i < len; i++) {
            data.index = i;
            data.isUnsubscribe = false;
            data.isAvailable = false;
            data.debounceMs = 0;
            chain[i](data);
            if (data.isUnsubscribe)
                return this.unsubscribe();
            if (data.debounceMs > 0)
                return;
            if (!data.isAvailable)
                return;
            if (data.isBreak)
                break;
        }
        if (data.listener)
            data.listener(data.payload);
    }
    processChain(listener) {
        const data = this.flow;
        data.listener = listener;
        data.isBreak = false;
        this.runChain(0, this.chain.length, data);
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
