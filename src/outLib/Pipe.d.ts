import { ICallback, IChainCallback, IErrorCallback, IListener, IPipeCase, IPipePayload, ISetObservableValue, ISetup, ISubscribe, ISubscriptionLike } from "./Types";
import { SwitchCase } from "./AbstractSwitchCase";
export declare abstract class Pipe<T> implements ISubscribe<T> {
    chain: IChainCallback[];
    flow: IPipePayload;
    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    private push;
    setOnce(): ISubscribe<T>;
    unsubscribeBy(condition: ICallback<T>): ISetup<T>;
    refine(condition: ICallback<T>): ISetup<T>;
    pushRefiners(conditions: ICallback<any>[]): ISetup<T>;
    switch(): PipeSwitchCase<T>;
    then<K>(condition: ICallback<T>): ISetup<K>;
    serialize(): ISetup<string>;
    deserialize<K>(): ISetup<K>;
    processChain(listener: IListener<T>): void;
}
export declare class PipeSwitchCase<T> extends SwitchCase<T, Pipe<T>, IPipeCase<T>> implements ISubscribe<T> {
    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
}
