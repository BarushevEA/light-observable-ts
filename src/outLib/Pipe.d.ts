import { ICallback, IChainCallback, IErrorCallback, IListener, IPipeCase, IPipePayload, ISetObservableValue, ISetup, ISubscribe, ISubscriptionLike } from "./Types";
export declare abstract class Pipe<T> implements ISubscribe<T> {
    chainHandlers: IChainCallback[];
    pipeData: IPipePayload;
    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    setOnce(): ISubscribe<T>;
    unsubscribeByNegative(condition: ICallback<T>): ISetup<T>;
    unsubscribeByPositive(condition: ICallback<T>): ISetup<T>;
    emitByNegative(condition: ICallback<T>): ISetup<T>;
    emitByPositive(condition: ICallback<T>): ISetup<T>;
    emitMatch(condition: ICallback<T>): ISetup<T>;
    switch(): SwitchCase<T>;
}
export declare class SwitchCase<T> implements ISubscribe<T>, IPipeCase<T> {
    private pipe;
    private caseCounter;
    constructor(pipe: Pipe<T>);
    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;
    case(condition: ICallback<any>): IPipeCase<T> & ISubscribe<T>;
}
