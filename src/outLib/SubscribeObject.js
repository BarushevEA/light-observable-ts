"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeObject = void 0;
const Pipe_1 = require("./Pipe");
const FunctionLibs_1 = require("./FunctionLibs");
class SubscribeObject extends Pipe_1.Pipe {
    observable;
    listener;
    errorHandler = (errorData, errorMessage) => {
        console.log(`(Unit of SubscribeObject).send(${errorData}) ERROR:`, errorMessage);
    };
    _order = 0;
    isPaused = false;
    isPipe = false;
    constructor(observable, isPipe) {
        super();
        this.observable = observable;
        this.isPipe = !!isPipe;
    }
    subscribe(observer, errorHandler) {
        this.listener = (0, FunctionLibs_1.getListener)(observer);
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }
    unsubscribe() {
        if (!this.observable)
            return;
        this.observable.unSubscribe(this);
        this.observable = null;
        this.listener = null;
        this.chain.length = 0;
    }
    send(value) {
        try {
            this.flow.payload = value;
            this.flow.isBreak = false;
            this.processValue(value);
        }
        catch (err) {
            this.errorHandler(value, err);
        }
    }
    resume() {
        this.isPaused = false;
    }
    pause() {
        this.isPaused = true;
    }
    get order() {
        return this._order;
    }
    set order(value) {
        this._order = value;
    }
    processValue(value) {
        const listener = this.listener;
        if (!listener)
            return this.unsubscribe();
        if (!this.observable)
            return;
        if (this.isPaused)
            return;
        if (!this.isPipe)
            return listener(value);
        return this.processChain(listener);
    }
}
exports.SubscribeObject = SubscribeObject;
