"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedObservable = exports.OrderedSubscribeObject = void 0;
var Observable_1 = require("./Observable");
var OrderedSubscribeObject = /** @class */ (function (_super) {
    __extends(OrderedSubscribeObject, _super);
    function OrderedSubscribeObject(observable, listener) {
        return _super.call(this, observable, listener) || this;
    }
    Object.defineProperty(OrderedSubscribeObject.prototype, "order", {
        get: function () {
            return this._order;
        },
        set: function (value) {
            if (!this.observable ||
                (this.observable && this.observable.isDestroyed)) {
                this._order = undefined;
                return;
            }
            this._order = value;
            this.observable.sortByOrder();
        },
        enumerable: false,
        configurable: true
    });
    OrderedSubscribeObject.prototype.subscribe = function (listener) {
        this.listener = listener;
        return this;
    };
    return OrderedSubscribeObject;
}(Observable_1.SubscribeObject));
exports.OrderedSubscribeObject = OrderedSubscribeObject;
var OrderedObservable = /** @class */ (function (_super) {
    __extends(OrderedObservable, _super);
    function OrderedObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderedObservable.prototype.sortByOrder = function () {
        if (this._isDestroyed)
            return undefined;
        this.listeners.sort(function (a, b) {
            if (a.order > b.order)
                return 1;
            if (a.order < b.order)
                return -1;
            return 0;
        });
    };
    OrderedObservable.prototype.subscribe = function (listener) {
        if (this._isDestroyed)
            return undefined;
        var subscribeObject = new OrderedSubscribeObject(this, listener);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    };
    OrderedObservable.prototype.pipe = function () {
        if (this._isDestroyed)
            return undefined;
        var subscribeObject = new OrderedSubscribeObject(this);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    };
    return OrderedObservable;
}(Observable_1.Observable));
exports.OrderedObservable = OrderedObservable;
//# sourceMappingURL=OrderedObservable.js.map