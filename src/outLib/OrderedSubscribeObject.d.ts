import { SubscribeObject } from "./SubscribeObject";
import { IErrorCallback, IListener, IOrdered, IOrderedSetup, IOrderedSubscribe, IOrderedSubscriptionLike, ISetObservableValue } from "./Types";
import { OrderedObservable } from "./OrderedObservable";
export declare class OrderedSubscribeObject<T> extends SubscribeObject<T> implements IOrderedSetup<T> {
    constructor(observable: OrderedObservable<T> | IOrdered<T>, isPipe?: boolean);
    get order(): number;
    set order(value: number);
    subscribe(observer: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): IOrderedSubscriptionLike;
    once(): IOrderedSubscribe<T>;
    take(n: number): IOrderedSubscribe<T>;
    skip(n: number): IOrderedSetup<T>;
    scan<K>(fn: (accumulator: K, value: T) => K, seed: K): IOrderedSetup<K>;
}
