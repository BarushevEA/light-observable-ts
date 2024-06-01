import {SubscribeObject} from "./SubscribeObject";
import {
    ICallback,
    IErrorCallback,
    IListener,
    IObserver,
    IOrdered,
    IOrderedObservable,
    IOrderedSetup,
    IOrderedSubscribe,
    IOrderedSubscriptionLike
} from "./Types";
import {OrderedObservable} from "./OrderedObservable";

export class OrderedSubscribeObject<T> extends SubscribeObject<T> implements IOrderedSetup<T> {
    constructor(observable: OrderedObservable<T> | IOrdered<T>, isPipe?: boolean) {
        super(<IObserver<T>>observable, isPipe);
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        if (!this.observable ||
            (this.observable && this.observable.isDestroyed)) {
            this._order = <any>undefined;
            return
        }
        this._order = value;
        (<IOrderedObservable><any>this.observable).sortByOrder();
    }

    subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): IOrderedSubscriptionLike {
        this.listener = listener;
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }

    setOnce(): IOrderedSubscribe<T> {
        return <any>super.setOnce();
    }

    unsubscribeByNegative(condition: ICallback<any>): IOrderedSetup<T> {
        return <any>super.unsubscribeByNegative(condition);
    }

    unsubscribeByPositive(condition: ICallback<any>): IOrderedSetup<T> {
        return <any>super.unsubscribeByPositive(condition);
    }

    emitByNegative(condition: ICallback<any>): IOrderedSetup<T> {
        return <any>super.emitByNegative(condition);
    }

    emitByPositive(condition: ICallback<any>): IOrderedSetup<T> {
        return <any>super.emitByPositive(condition);
    }

    emitMatch(condition: ICallback<any>): IOrderedSetup<T> {
        return <any>super.emitMatch(condition);
    }
}
