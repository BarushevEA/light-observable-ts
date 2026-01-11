import { ICallback, IChainCallback, IErrorCallback, IGroupSubscription, IListener, IPipeCase, IPipePayload, ISetObservableValue, ISetup, ISubscribe, ISubscriptionLike } from "./Types";
import { SwitchCase } from "./AbstractSwitchCase";
export declare abstract class Pipe<T> implements ISubscribe<T> {
    chain: IChainCallback[];
    flow: IPipePayload;
    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    private push;
    once(): ISubscribe<T>;
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
    and(condition: ICallback<T>): ISetup<T>;
    allOf(conditions: ICallback<any>[]): ISetup<T>;
    choice(): PipeSwitchCase<T>;
    map<K>(condition: ICallback<T>): ISetup<K>;
    toJson(): ISetup<string>;
    fromJson<K>(): ISetup<K>;
    group(): IGroupSubscription<T>;
    processChain(listener: IListener<T>): void;
}
export declare class PipeSwitchCase<T> extends SwitchCase<T, Pipe<T>, IPipeCase<T>> implements ISubscribe<T> {
    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    group(): IGroupSubscription<T>;
}
