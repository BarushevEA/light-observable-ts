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
        if (!listener) {
            this.unsubscribe();
            return;
        }
        if (!this.observer || this.paused)
            return;
        if (!this.piped) {
            try {
                listener(value);
            }
            catch (err) {
                this.errorHandler(value, err);
            }
            return;
        }
        try {
            this.flow.payload = value;
            this.flow.isBreak = false;
            this.processChain(listener);
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
