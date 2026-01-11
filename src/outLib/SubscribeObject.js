"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeObject = void 0;
const Pipe_1 = require("./Pipe");
const FunctionLibs_1 = require("./FunctionLibs");
class SubscribeObject extends Pipe_1.Pipe {
    observer;
    listener;
    errorHandler = (errorData, errorMessage) => {
        console.log(`(Unit of SubscribeObject).send(${errorData}) ERROR:`, errorMessage);
    };
    _order = 0;
    paused = false;
    piped = false;
    listeners;
    errorHandlers;
    constructor(observable, isPipe) {
        super();
        this.observer = observable;
        this.piped = !!isPipe;
    }
    subscribe(observer, errorHandler) {
        this.listener = (0, FunctionLibs_1.getListener)(observer);
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }
    add(listener, errorHandler) {
        if (!this.listeners) {
            this.listeners = [];
            this.errorHandlers = [];
        }
        if (Array.isArray(listener)) {
            for (let i = 0; i < listener.length; i++) {
                this.listeners.push(listener[i]);
                const handler = (errorHandler && Array.isArray(errorHandler))
                    ? (errorHandler[i] ?? this.errorHandler)
                    : (errorHandler || this.errorHandler);
                this.errorHandlers.push(handler);
            }
        }
        else {
            this.listeners.push(listener);
            const handler = (errorHandler && !Array.isArray(errorHandler))
                ? errorHandler
                : this.errorHandler;
            this.errorHandlers.push(handler);
        }
        return this;
    }
    unsubscribe() {
        if (!this.observer)
            return;
        this.observer.unSubscribe(this);
        this.observer = null;
        this.listener = null;
        this.chain.length = 0;
    }
    send(value) {
        const listener = this.listener;
        const hasGroupListeners = this.listeners && this.listeners.length > 0;
        if (!listener && !hasGroupListeners) {
            this.unsubscribe();
            return;
        }
        if (!this.observer || this.paused)
            return;
        if (!this.piped) {
            if (listener) {
                try {
                    listener(value);
                }
                catch (err) {
                    this.errorHandler(value, err);
                }
            }
            if (hasGroupListeners) {
                for (let i = 0; i < this.listeners.length; i++) {
                    try {
                        this.listeners[i](value);
                    }
                    catch (err) {
                        this.errorHandlers[i](value, err);
                    }
                }
            }
            return;
        }
        try {
            this.flow.payload = value;
            this.flow.isBreak = false;
            if (listener) {
                this.processChain(listener);
            }
            else {
                const chain = this.chain;
                const data = this.flow;
                const len = chain.length;
                data.isAvailable = len === 0;
                for (let i = 0; i < len; i++) {
                    data.isUnsubscribe = false;
                    data.isAvailable = false;
                    chain[i](data);
                    if (data.isUnsubscribe) {
                        this.unsubscribe();
                        return;
                    }
                    if (!data.isAvailable)
                        return;
                    if (data.isBreak)
                        break;
                }
            }
            if (hasGroupListeners) {
                const processedValue = this.flow.payload;
                for (let i = 0; i < this.listeners.length; i++) {
                    try {
                        this.listeners[i](processedValue);
                    }
                    catch (err) {
                        this.errorHandlers[i](processedValue, err);
                    }
                }
            }
        }
        catch (err) {
            this.errorHandler(value, err);
        }
    }
    resume() {
        this.paused = false;
    }
    pause() {
        this.paused = true;
    }
    get order() {
        return this._order;
    }
    set order(value) {
        this._order = value;
    }
}
exports.SubscribeObject = SubscribeObject;
