"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tickGenerator = void 0;
var Observable_1 = require("./Observables/Observable");
var listeners = [];
var tickDelay = 10;
var tickIndex = 0, secondFPSIndex = 0, optimizeCounter = 0, optimizeNumber = 1000, tick10$ = new Observable_1.Observable(0), tick100$ = new Observable_1.Observable(0), secondFPS$ = new Observable_1.Observable(0), tick1000$ = new Observable_1.Observable(0);
var TickGenerator = /** @class */ (function () {
    function TickGenerator() {
        this.counter100 = 0;
        this.counter1000 = 0;
        this.isDestroyProcessed = false;
        this._isDestroyed = false;
        this.init();
    }
    TickGenerator.prototype.init = function () {
        var _this = this;
        if (!secondFPSIndex) {
            secondFPSIndex = setInterval(function () { return secondFPS$.next(-1); }, 1000);
        }
        if (!tickIndex) {
            tickIndex = setInterval(function () {
                _this.counter100 += 10;
                if (_this.counter100 >= 100)
                    _this.counter100 = 0;
                _this.counter1000 += 10;
                if (_this.counter1000 >= 1000)
                    _this.counter1000 = 0;
                tick10$.next(10);
                if (!_this.counter100)
                    tick100$.next(100);
                if (!_this.counter1000)
                    tick1000$.next(1000);
                _this.handleTimeOutListeners();
            }, tickDelay);
        }
    };
    TickGenerator.prototype.executeSecondInterval = function (cb, time) {
        var number = time;
        return tick1000$.subscribe(function () {
            if (time > 0)
                time--;
            if (!time) {
                cb();
                time = number;
            }
        });
    };
    TickGenerator.prototype.execute100MsInterval = function (cb, time) {
        var number = time;
        return tick100$.subscribe(function () {
            if (time > 0)
                time--;
            if (!time) {
                cb();
                time = number;
            }
        });
    };
    TickGenerator.prototype.handleTimeOutListeners = function () {
        var isNeedToOptimize = false;
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            if (!listener) {
                continue;
            }
            if (listener.isDestroy) {
                listeners[i] = 0;
                isNeedToOptimize = true;
            }
            else {
                if (listener.counter >= listener.delay) {
                    listener.callback();
                    listeners[i] = 0;
                    isNeedToOptimize = true;
                }
                else {
                    listener.counter += tickDelay;
                }
            }
        }
        this.optimizeKeys(isNeedToOptimize);
    };
    TickGenerator.prototype.optimizeKeys = function (isNeedToOptimize) {
        if (!isNeedToOptimize)
            return;
        optimizeCounter++;
        if (optimizeCounter < optimizeNumber)
            return;
        optimizeCounter = 0;
        var tmpListeners = [];
        var length = listeners.length;
        for (var i = 0; i < length; i++)
            if (listeners[i])
                tmpListeners.push(listeners[i]);
        listeners.length = 0;
        listeners = tmpListeners;
        tmpListeners.length = 0;
    };
    Object.defineProperty(TickGenerator.prototype, "isDestroyed", {
        get: function () {
            return this._isDestroyed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TickGenerator.prototype, "tick10$", {
        get: function () {
            return tick10$;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TickGenerator.prototype, "tick100$", {
        get: function () {
            return tick100$;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TickGenerator.prototype, "tick1000$", {
        get: function () {
            return tick1000$;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TickGenerator.prototype, "secondFPS$", {
        get: function () {
            return secondFPS$;
        },
        enumerable: false,
        configurable: true
    });
    TickGenerator.prototype.executeTimeout = function (cb, time) {
        var listener = {
            counter: 0,
            delay: time,
            callback: cb,
            isDestroy: false
        };
        listeners.push(listener);
        return listener;
    };
    TickGenerator.prototype.clearTimeout = function (id) {
        if (!id)
            return;
        id.isDestroy = true;
        id.callback = function () { return console.log('listener has been destroyed'); };
    };
    TickGenerator.prototype.destroy = function () {
        if (this.isDestroyProcessed)
            return;
        this.isDestroyProcessed = true;
        this.counter100 = 0;
        this.counter1000 = 0;
        clearInterval(tickIndex);
        clearInterval(secondFPSIndex);
        tickIndex = 0;
        secondFPSIndex = 0;
        this.resetListeners(tick10$);
        this.resetListeners(tick100$);
        this.resetListeners(tick1000$);
        this.resetListeners(secondFPS$);
        tick10$ = 0;
        tick100$ = 0;
        tick1000$ = 0;
        secondFPS$ = 0;
        this._isDestroyed = true;
    };
    TickGenerator.prototype.resetListeners = function (observable) {
        if (observable)
            observable.unsubscribeAll();
    };
    return TickGenerator;
}());
exports.tickGenerator = new TickGenerator();
//# sourceMappingURL=TickGenerator.js.map