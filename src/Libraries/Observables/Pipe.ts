import {
    ICallback,
    IChainCallback,
    IErrorCallback,
    IListener,
    IPipeCase,
    IPipePayload,
    ISetObservableValue,
    ISetup,
    ISubscribe,
    ISubscriptionLike
} from "./Types";

export abstract class Pipe<T> implements ISubscribe<T> {
    chainHandlers: IChainCallback<T> [] = [];
    pipeData: IPipePayload = {isBreakChain: false, isNeedUnsubscribe: false, isAvailable: false, payload: null};

    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;

    setOnce(): ISubscribe<T> {
        this.chainHandlers.push(
            (pipeObj: Pipe<T>): void => {
                (<any>(<any>pipeObj).listener)(pipeObj.pipeData.payload);
                pipeObj.pipeData.isNeedUnsubscribe = true;
            }
        );
        return this;
    }

    unsubscribeByNegative(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: Pipe<T>): void => {
                pipeObj.pipeData.isAvailable = true;
                if (!condition(pipeObj.pipeData.payload)) pipeObj.pipeData.isNeedUnsubscribe = true;
            }
        );
        return this
    }

    unsubscribeByPositive(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: Pipe<T>): void => {
                pipeObj.pipeData.isAvailable = true;
                if (condition(pipeObj.pipeData.payload)) pipeObj.pipeData.isNeedUnsubscribe = true;
            }
        );
        return this;
    }

    emitByNegative(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: Pipe<T>): void => {
                if (!condition(pipeObj.pipeData.payload)) pipeObj.pipeData.isAvailable = true;
            }
        );
        return this;
    }

    emitByPositive(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: Pipe<T>): void => {
                if (condition(pipeObj.pipeData.payload)) pipeObj.pipeData.isAvailable = true;
            }
        );
        return this;
    }

    emitMatch(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: Pipe<T>): void => {
                if (condition(pipeObj.pipeData.payload) == pipeObj.pipeData.payload) pipeObj.pipeData.isAvailable = true;
            }
        );
        return this;
    }

    switch(): SwitchCase<T> {
        return new SwitchCase<T>(this);
    }
}

export class SwitchCase<T> implements ISubscribe<T>, IPipeCase<T> {
    private pipe: Pipe<T>;
    private caseCounter = 0;

    constructor(pipe: Pipe<T>) {
        this.pipe = pipe;
    }

    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined {
        return this.pipe.subscribe(listener, errorHandler);
    }

    case(condition: ICallback<any>): IPipeCase<T> & ISubscribe<T> {
        this.caseCounter++;
        const id = this.caseCounter;
        this.pipe.chainHandlers.push(
            (pipeObj: Pipe<T>): void => {
                const pipe = pipeObj.pipeData;
                pipe.isAvailable = true
                if (condition(pipe.payload)) pipe.isBreakChain = true;
                if (id === this.pipe.chainHandlers.length && !pipe.isBreakChain) {
                    pipe.isAvailable = false;
                }
            }
        );
        return this;
    }
}
