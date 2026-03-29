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
        clearTimeout(this.flow.debounceTimer);
        this.observer.unSubscribe(this);
        this.observer = undefined;
        this.listener = undefined;
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
            return;
        }
        try {
            this.flow.payload = value;
            this.flow.isBreak = false;
            if (hasGroupListeners) {
                const groupListeners = this.listeners;
                const groupErrorHandlers = this.errorHandlers;
                this.processChain((value) => {
                    if (listener)
                        listener(value);
                    for (let i = 0; i < groupListeners.length; i++) {
                        try {
                            groupListeners[i](value);
                        }
                        catch (err) {
                            groupErrorHandlers[i](value, err);
                        }
                    }
                });
            }
            else {
                this.processChain(listener);
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
