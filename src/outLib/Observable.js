"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = exports.SubscribeObject = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
class SubscribeObject {
    constructor(observable, isPipe) {
        this.isMarkedForUnsubscribe = false;
        this.errorHandler = (errorData, errorMessage) => {
            console.log(`(Unit of SubscribeObject).send(${errorData}) ERROR:`, errorMessage);
        };
        this._order = 0;
        this.isListenPaused = false;
        this.once = { isOnce: false, isFinished: false };
        this.unsubscribeByNegativeCondition = null;
        this.unsubscribeByPositiveCondition = null;
        this.emitByNegativeCondition = null;
        this.emitByPositiveCondition = null;
        this.emitMatchCondition = null;
        this.isPipe = false;
        this.observable = observable;
        this.isPipe = !!isPipe;
    }
    static callbackSend(value, subsObj) {
        const listener = subsObj.listener;
        if (!listener) {
            subsObj.unsubscribe();
            return;
        }
        switch (true) {
            case !subsObj.observable:
                subsObj.unsubscribe();
                return;
            case subsObj.isListenPaused:
                return;
            case !subsObj.isPipe:
                listener(value);
                return;
            case subsObj.once.isOnce:
                subsObj.once.isFinished = true;
                listener(value);
                subsObj.unsubscribe();
                break;
            case !!subsObj.unsubscribeByNegativeCondition:
                if (!subsObj.unsubscribeByNegativeCondition(value)) {
                    subsObj.unsubscribeByNegativeCondition = null;
                    subsObj.unsubscribe();
                    return;
                }
                listener(value);
                break;
            case !!subsObj.unsubscribeByPositiveCondition:
                if (subsObj.unsubscribeByPositiveCondition(value)) {
                    subsObj.unsubscribeByPositiveCondition = null;
                    subsObj.unsubscribe();
                    return;
                }
                listener(value);
                break;
            case !!subsObj.emitByNegativeCondition:
                !subsObj.emitByNegativeCondition(value) && listener(value);
                break;
            case !!subsObj.emitByPositiveCondition:
                subsObj.emitByPositiveCondition(value) && listener(value);
                break;
            case !!subsObj.emitMatchCondition:
                (subsObj.emitMatchCondition(value) === value) && listener(value);
                break;
        }
    }
    subscribe(listener, errorHandler) {
        this.listener = listener;
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }
    unsubscribe() {
        if (this.observable) {
            this.observable.unSubscribe(this);
            this.observable = 0;
            this.listener = 0;
        }
    }
    send(value) {
        try {
            SubscribeObject.callbackSend(value, this);
        }
        catch (err) {
            this.errorHandler(value, err);
        }
    }
    setOnce() {
        this.once.isOnce = true;
        return this;
    }
    unsubscribeByNegative(condition) {
        this.unsubscribeByNegativeCondition = !!condition ? condition : FunctionLibs_1.negativeCallback;
        return this;
    }
    unsubscribeByPositive(condition) {
        this.unsubscribeByPositiveCondition = !!condition ? condition : FunctionLibs_1.positiveCallback;
        return this;
    }
    emitByNegative(condition) {
        this.emitByNegativeCondition = !!condition ? condition : FunctionLibs_1.positiveCallback;
        return this;
    }
    emitByPositive(condition) {
        this.emitByPositiveCondition = !!condition ? condition : FunctionLibs_1.negativeCallback;
        return this;
    }
    emitMatch(condition) {
        const type = typeof condition;
        if (type !== "function") {
            condition = () => `ERROR CONDITION TYPE ${type},  CONTROL STATE ${this.observable && !this.observable.getValue()}`;
        }
        this.emitMatchCondition = condition;
        return this;
    }
    resume() {
        this.isListenPaused = false;
    }
    pause() {
        this.isListenPaused = true;
    }
    get order() {
        return this._order;
    }
    set order(value) {
        this._order = value;
    }
}
exports.SubscribeObject = SubscribeObject;
class Observable {
    constructor(value) {
        this.value = value;
        this.listeners = [];
        this._isEnable = true;
        this._isDestroyed = false;
        this.isNextProcess = false;
        this.listenersForUnsubscribe = [];
    }
    disable() {
        this._isEnable = false;
    }
    enable() {
        this._isEnable = true;
    }
    get isEnable() {
        return this._isEnable;
    }
    next(value) {
        if (this._isDestroyed)
            return;
        if (!this._isEnable)
            return;
        this.isNextProcess = true;
        this.value = value;
        const length = this.listeners.length;
        for (let i = 0; i < length; i++) {
            this.listeners[i].send(value);
        }
        this.isNextProcess = false;
        this.listenersForUnsubscribe.length && this.handleListenersForUnsubscribe();
    }
    stream(values) {
        if (this._isDestroyed)
            return;
        if (!this._isEnable)
            return;
        for (let i = 0; i < values.length; i++) {
            this.next(values[i]);
        }
    }
    handleListenersForUnsubscribe() {
        const length = this.listenersForUnsubscribe.length;
        for (let i = 0; i < length; i++) {
            const listener = this.listenersForUnsubscribe[i];
            this.unSubscribe(listener);
        }
        this.listenersForUnsubscribe.length = 0;
    }
    unSubscribe(listener) {
        if (this._isDestroyed)
            return;
        if (this.isNextProcess && listener) {
            const marker = listener;
            !marker.isMarkedForUnsubscribe && this.listenersForUnsubscribe.push(listener);
            marker.isMarkedForUnsubscribe = true;
            return;
        }
        this.listeners && !(0, FunctionLibs_1.deleteFromArray)(this.listeners, listener);
    }
    destroy() {
        this.value = 0;
        this.unsubscribeAll();
        this.listeners = 0;
        this._isDestroyed = true;
    }
    unsubscribeAll() {
        if (this._isDestroyed)
            return;
        this.listeners.length = 0;
    }
    getValue() {
        if (this._isDestroyed)
            return undefined;
        return this.value;
    }
    size() {
        if (this._isDestroyed)
            return 0;
        return this.listeners.length;
    }
    subscribe(listener, errorHandler) {
        if (this._isDestroyed)
            return undefined;
        if (!listener)
            return undefined;
        const subscribeObject = new SubscribeObject(this, false);
        subscribeObject.subscribe(listener, errorHandler);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    pipe() {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new SubscribeObject(this, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
}
exports.Observable = Observable;
