import {
    ICallback,
    IChainCallback,
    IErrorCallback,
    IListener,
    IPipePayload,
    ISetup,
    ISubscribe,
    ISubscriptionLike
} from "./Types";

export abstract class AbstractPipe<T> {
    chainHandlers: IChainCallback<T> [] = [];
    pipeData: IPipePayload = {isNeedUnsubscribe: false, isAvailable: false, payload: null};

    abstract subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;

    setOnce(): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: AbstractPipe<T>): void => {
                (<any>(<any>pipeObj).listener)(pipeObj.pipeData.payload);
                pipeObj.pipeData.isNeedUnsubscribe = true;
            }
        );
        return this;
    }

    unsubscribeByNegative(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: AbstractPipe<T>): void => {
                if (!condition(pipeObj.pipeData.payload)) pipeObj.pipeData.isNeedUnsubscribe = true;
            }
        );
        return this
    }

    unsubscribeByPositive(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: AbstractPipe<T>): void => {
                if (condition(pipeObj.pipeData.payload)) pipeObj.pipeData.isNeedUnsubscribe = true;
            }
        );
        return this;
    }

    emitByNegative(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: AbstractPipe<T>): void => {
                if (!condition(pipeObj.pipeData.payload)) pipeObj.pipeData.isAvailable = true;
            }
        );
        return this;
    }

    emitByPositive(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: AbstractPipe<T>): void => {
                if (condition(pipeObj.pipeData.payload)) pipeObj.pipeData.isAvailable = true;
            }
        );
        return this;
    }

    emitMatch(condition: ICallback<T>): ISetup<T> {
        this.chainHandlers.push(
            (pipeObj: AbstractPipe<T>): void => {
                if (condition(pipeObj.pipeData.payload) == pipeObj.pipeData.payload) pipeObj.pipeData.isAvailable = true;
            }
        );
        return this;
    }
}
