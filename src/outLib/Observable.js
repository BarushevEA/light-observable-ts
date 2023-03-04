"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = exports.SubscribeObject = void 0;
const FunctionLibs_1 = require("./FunctionLibs");
class SubscribeObject {
    constructor(observable, listener, isPipe) {
        this.isMarkedForUnsubscribe = false;
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
        this.listener = listener;
        this.isPipe = !!isPipe;
    }
    static callbackSend(value, subsObj) {
        const listener = subsObj.listener;
        if (!listener || !subsObj.observable) {
            subsObj.unsubscribe();
            return;
        }
        switch (true) {
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
                if (!subsObj.unsubscribeByNegativeCondition()) {
                    subsObj.unsubscribeByNegativeCondition = null;
                    subsObj.unsubscribe();
                    return;
                }
                listener(value);
                break;
            case !!subsObj.unsubscribeByPositiveCondition:
                if (subsObj.unsubscribeByPositiveCondition()) {
                    subsObj.unsubscribeByPositiveCondition = null;
                    subsObj.unsubscribe();
                    return;
                }
                listener(value);
                break;
            case !!subsObj.emitByNegativeCondition:
                !subsObj.emitByNegativeCondition() && listener(value);
                break;
            case !!subsObj.emitByPositiveCondition:
                subsObj.emitByPositiveCondition() && listener(value);
                break;
            case !!subsObj.emitMatchCondition:
                (subsObj.emitMatchCondition() === value) && listener(value);
                break;
        }
    }
    subscribe(listener) {
        this.listener = listener;
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
            console.log('(Unit of SubscribeObject).send(value: T) ERROR:', err);
        }
    }
    setOnce() {
        this.once.isOnce = true;
        return this;
    }
    unsubscribeByNegative(condition) {
        if (typeof condition !== "function")
            condition = () => false;
        this.unsubscribeByNegativeCondition = condition;
        return this;
    }
    unsubscribeByPositive(condition) {
        if (typeof condition !== "function")
            condition = () => true;
        this.unsubscribeByPositiveCondition = condition;
        return this;
    }
    emitByNegative(condition) {
        if (typeof condition !== "function")
            condition = () => true;
        this.emitByNegativeCondition = condition;
        return this;
    }
    emitByPositive(condition) {
        if (typeof condition !== "function")
            condition = () => false;
        this.emitByPositiveCondition = condition;
        return this;
    }
    emitMatch(condition) {
        if (typeof condition !== "function")
            condition =
                () => `ERROR CONDITION TYPE ${typeof condition},  CONTROL STATE ${this.observable && !this.observable.getValue()}`;
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
        this.value = value;
        this.isNextProcess = true;
        const length = this.listeners.length;
        for (let i = 0; i < length; i++) {
            const listener = this.listeners[i];
            listener.send(value);
        }
        this.isNextProcess = false;
        this.listenersForUnsubscribe.length && this.handleListenersForUnsubscribe();
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
        if (this.isNextProcess) {
            const marker = listener;
            !marker.isMarkedForUnsubscribe && this.listenersForUnsubscribe.push(listener);
            marker.isMarkedForUnsubscribe = true;
            return;
        }
        this.listeners && FunctionLibs_1.deleteFromArray(this.listeners, listener);
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
        const listeners = this.listeners;
        const length = listeners.length;
        for (let i = 0; i < length; i++) {
            const subscriber = listeners.pop();
            subscriber && subscriber.unsubscribe();
        }
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
    subscribe(listener) {
        if (this._isDestroyed)
            return undefined;
        if (!listener)
            return undefined;
        const subscribeObject = new SubscribeObject(this, listener, false);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    pipe() {
        if (this._isDestroyed)
            return undefined;
        const subscribeObject = new SubscribeObject(this, undefined, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
}
exports.Observable = Observable;
