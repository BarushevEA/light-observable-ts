import { Observable, SubscribeObject } from "./Observable";
import { ICallback, IListener, IOrdered, IOrderedSetup, IOrderedSubscribe, IOrderedSubscriptionLike } from "./Types";
export declare class OrderedSubscribeObject<T> extends SubscribeObject<T> {
    constructor(observable: OrderedObservable<T> | IOrdered<T>, listener?: IListener<T>, isPipe?: boolean);
    get order(): number;
    set order(value: number);
    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T>;
    setOnce(): IOrderedSubscribe<T>;
    unsubscribeByNegative(condition: ICallback<any>): IOrderedSubscribe<T>;
    unsubscribeByPositive(condition: ICallback<any>): IOrderedSubscribe<T>;
    emitByNegative(condition: ICallback<any>): IOrderedSubscribe<T>;
    emitByPositive(condition: ICallback<any>): IOrderedSubscribe<T>;
    emitMatch(condition: ICallback<any>): IOrderedSubscribe<T>;
}
export declare class OrderedObservable<T> extends Observable<T> implements IOrdered<T> {
    sortByOrder(): void;
    subscribe(listener: IListener<T>): IOrderedSubscriptionLike<T> | undefined;
    pipe(): IOrderedSetup<T> | undefined;
}
