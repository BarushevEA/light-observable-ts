import { PipeSwitchCase } from "./Pipe";
import { ICallback, IPause, IOrder, ISend } from "./CoreTypes";
import { ISubscribe, IOrderedSubscribe, ISubscriptionLike, IGroupSubscription } from "./SubscriptionTypes";
export type ISwitch<T> = {
    choice(): PipeSwitchCase<T>;
};
export type IGroup<T> = {
    group(): IGroupSubscription<T>;
};
export type IOrderedGroup<T> = {
    group(): IGroupSubscription<T>;
};
export type IOnce<T> = {
    once(): ISubscribe<T>;
};
export type IOrderedOnce<T> = {
    once(): IOrderedSubscribe<T>;
};
export type ITake<T> = {
    take(n: number): ISubscribe<T>;
};
export type IOrderedTake<T> = {
    take(n: number): IOrderedSubscribe<T>;
};
export type ISkip<T> = {
    skip(n: number): ISetup<T>;
};
export type IOrderedSkip<T> = {
    skip(n: number): IOrderedSetup<T>;
};
export type IScan<T> = {
    scan<K>(fn: (accumulator: K, value: T) => K, seed: K): ISetup<K>;
};
export type IOrderedScan<T> = {
    scan<K>(fn: (accumulator: K, value: T) => K, seed: K): IOrderedSetup<K>;
};
export type IUnsubscribeByPositive<T> = {
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
};
export type IOrderedUnsubscribeByPositive<T> = {
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
};
export type IEmitByPositive<T> = {
    and(condition: ICallback<T>): ISetup<T>;
    allOf(conditions: ICallback<T>[]): ISetup<T>;
};
export type IOrderedEmitByPositive<T> = {
    and(condition: ICallback<any>): ISetup<T>;
    allOf(conditions: ICallback<any>[]): ISetup<T>;
};
export type ITransform<T> = {
    map<K>(condition: ICallback<T>): ISetup<K>;
};
export type IThrottle<T> = {
    throttle(ms: number): ISetup<T>;
};
export type IDebounce<T> = {
    debounce(ms: number): ISetup<T>;
};
export type IDistinctUntilChanged<T> = {
    distinctUntilChanged(comparator?: (previous: T, current: T) => boolean): ISetup<T>;
};
export type ITap<T> = {
    tap(fn: ICallback<T>): ISetup<T>;
};
export type ISerialisation = {
    toJson(): ISetup<string>;
    fromJson<K>(): ISetup<K>;
};
export type ISetup<T> = IUnsubscribeByPositive<T> & IEmitByPositive<T> & IOnce<T> & ITake<T> & ISkip<T> & IScan<T> & ISwitch<T> & ITransform<T> & IThrottle<T> & IDebounce<T> & IDistinctUntilChanged<T> & ITap<T> & ISerialisation & IGroup<T> & ISubscribe<T>;
export type IOrderedSetup<T> = IOrderedUnsubscribeByPositive<T> & IOrderedEmitByPositive<T> & IOrderedOnce<T> & IOrderedTake<T> & IOrderedSkip<T> & IOrderedScan<T> & ISwitch<T> & ITransform<T> & IThrottle<T> & IDebounce<T> & IDistinctUntilChanged<T> & ITap<T> & ISerialisation & IOrderedGroup<T> & IOrderedSubscribe<T>;
export type ISubscribeObject<T> = ISubscriptionLike & IPause & IOrder & ISend<T> & ISetup<T>;
export type IPipeCase<T> = ISubscribe<T> & {
    or(condition: ICallback<any>): IPipeCase<T> & ISubscribe<T>;
    anyOf(conditions: ICallback<any>[]): IPipeCase<T> & ISubscribe<T>;
    group(): IGroupSubscription<T>;
};
