import { SubscribeObject } from "./SubscribeObject";
import { ICallback, IErrorCallback, IListener, IOrdered, IOrderedSetup, IOrderedSubscribe, IOrderedSubscriptionLike, ISetObservableValue, ISetup } from "./Types";
import { OrderedObservable } from "./OrderedObservable";
export declare class OrderedSubscribeObject<T> extends SubscribeObject<T> implements IOrderedSetup<T> {
    constructor(observable: OrderedObservable<T> | IOrdered<T>, isPipe?: boolean);
    get order(): number;
    set order(value: number);
    subscribe(observer: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): IOrderedSubscriptionLike;
    setOnce(): IOrderedSubscribe<T>;
    unsubscribeByNegative(condition: ICallback<any>): IOrderedSetup<T>;
    unsubscribeByPositive(condition: ICallback<any>): IOrderedSetup<T>;
    emitByNegative(condition: ICallback<any>): IOrderedSetup<T>;
    emitByPositive(condition: ICallback<any>): IOrderedSetup<T>;
    refine(condition: ICallback<any>): ISetup<T>;
    pushRefiners(conditions: ICallback<any>[]): ISetup<T>;
    emitMatch(condition: ICallback<any>): IOrderedSetup<T>;
}
