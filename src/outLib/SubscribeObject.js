"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeObject = void 0;
const Pipe_1 = require("./Pipe");
const FunctionLibs_1 = require("./FunctionLibs");
class SubscribeObject extends Pipe_1.Pipe {
    isMarkedForUnsubscribe = false;
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
        this.chainHandlers.length = 0;
    }
    send(value) {
        try {
            this.pipeData.payload = value;
            this.pipeData.isBreakChain = false;
            processValue(value, this);
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
}
exports.SubscribeObject = SubscribeObject;
function processValue(value, subsObj) {
    const listener = subsObj.listener;
    if (!listener)
        return subsObj.unsubscribe();
    if (!subsObj.observable)
        return subsObj.unsubscribe();
    if (subsObj.isPaused)
        return;
    if (!subsObj.isPipe)
        return listener(value);
    for (let i = 0; i < subsObj.chainHandlers.length; i++) {
        subsObj.pipeData.isNeedUnsubscribe = false;
        subsObj.pipeData.isAvailable = false;
        subsObj.chainHandlers[i]();
        if (subsObj.pipeData.isNeedUnsubscribe)
            return subsObj.unsubscribe();
        if (!subsObj.pipeData.isAvailable)
            return;
        if (subsObj.pipeData.isBreakChain)
            break;
    }
    return listener(subsObj.pipeData.payload);
}
