import {Observable, SubscribeObject} from "./Observable";
import {
    ICallback,
    IListener,
    IObserver,
    IOrdered,
    IOrderedObservable,
    IOrderedSetup,
    IOrderedSubscribe,
    IOrderedSubscriptionLike
} from "./Types";

export class OrderedSubscribeObject<T> extends SubscribeObject<T> {
    constructor(observable: OrderedObservable<T> | IOrdered<T>, listener?: IListener<T>, isPipe?: boolean) {
        super(<IObserver<T>>observable, listener, isPipe);
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

    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T> {
        this.listener = listener;
        return this;
    }

    setOnce(): IOrderedSubscribe<T> {
        return <any>super.setOnce();
    }

    unsubscribeByNegative(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.unsubscribeByNegative(condition);
    }

    unsubscribeByPositive(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.unsubscribeByPositive(condition);
    }

    emitByNegative(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.emitByNegative(condition);
    }

    emitByPositive(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.emitByPositive(condition);
    }

    emitMatch(condition: ICallback<any>): IOrderedSubscribe<T> {
        return <any>super.emitMatch(condition);
    }
}

export class OrderedObservable<T>
    extends Observable<T> implements IOrdered<T> {
    sortByOrder(): void {
        if (this._isDestroyed) return undefined;
        this.listeners.sort((a, b) => {
            if (a.order > b.order) return 1;
            if (a.order < b.order) return -1;
            return 0;
        });
    }

    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T> | undefined {
        if (this._isDestroyed) return undefined;
        if (!listener) return undefined;
        const subscribeObject = new OrderedSubscribeObject(this, listener, false);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }

    pipe(): IOrderedSetup<T> | undefined {
        if (this._isDestroyed) return undefined;
        const subscribeObject = new OrderedSubscribeObject(this, undefined, true);
        this.listeners.push(subscribeObject);
        return subscribeObject;
    }
}
