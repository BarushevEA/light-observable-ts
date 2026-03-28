import { ICallback, IChainCallback, IErrorCallback, IGroupSubscription, IListener, IPipeCase, IPipePayload, ISetObservableValue, ISetup, ISubscribe, ISubscriptionLike } from "./Types";
import { SwitchCase } from "./AbstractSwitchCase";
export declare abstract class Pipe<T> implements ISubscribe<T> {
    chain: IChainCallback[];
    flow: IPipePayload;
    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    private push;
    once(): ISubscribe<T>;
    take(n: number): ISubscribe<T>;
    skip(n: number): ISetup<T>;
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
    and(condition: ICallback<T>): ISetup<T>;
    allOf(conditions: ICallback<any>[]): ISetup<T>;
    choice(): PipeSwitchCase<T>;
    map<K>(condition: ICallback<T>): ISetup<K>;
    scan<K>(fn: (accumulator: K, value: T) => K, seed: K): ISetup<K>;
    tap(fn: ICallback<T>): ISetup<T>;
    throttle(ms: number): ISetup<T>;
    debounce(ms: number): ISetup<T>;
    distinctUntilChanged(comparator?: (previous: T, current: T) => boolean): ISetup<T>;
    toJson(): ISetup<string>;
    fromJson<K>(): ISetup<K>;
    group(): IGroupSubscription<T>;
    processChain(listener?: IListener<T>): void;
}
export declare class PipeSwitchCase<T> extends SwitchCase<T, Pipe<T>, IPipeCase<T>> implements ISubscribe<T> {
    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    group(): IGroupSubscription<T>;
}
