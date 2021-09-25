"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
var FunctionLibs_1 = require("../FunctionLibs");
var Collector = /** @class */ (function () {
    function Collector() {
        this.list = [];
        this._isDestroyed = false;
    }
    Collector.prototype.collect = function () {
        var subscriptionLikeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subscriptionLikeList[_i] = arguments[_i];
        }
        if (this._isDestroyed)
            return null;
        for (var i = 0; i < subscriptionLikeList.length; i++) {
            this.list.push(subscriptionLikeList[i]);
        }
    };
    Collector.prototype.unsubscribe = function (subscriptionLike) {
        if (this._isDestroyed)
            return null;
        subscriptionLike && subscriptionLike.unsubscribe();
        (0, FunctionLibs_1.deleteFromArray)(this.list, subscriptionLike);
    };
    Collector.prototype.unsubscribeAll = function () {
        if (this._isDestroyed)
            return null;
        var length = this.list.length;
        for (var i = 0; i < length; i++) {
            this.unsubscribe(this.list.pop());
        }
    };
    Collector.prototype.size = function () {
        if (this._isDestroyed)
            return 0;
        return this.list.length;
    };
    Collector.prototype.destroy = function () {
        this.unsubscribeAll();
        this.list.length = 0;
        this.list = 0;
        this._isDestroyed = true;
    };
    Object.defineProperty(Collector.prototype, "isDestroyed", {
        get: function () {
            return this._isDestroyed;
        },
        enumerable: false,
        configurable: true
    });
    return Collector;
}());
exports.Collector = Collector;
//# sourceMappingURL=Collector.js.map