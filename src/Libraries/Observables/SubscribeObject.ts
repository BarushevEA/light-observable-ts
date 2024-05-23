import {
    ICallback,
    IChainCallback,
    IErrorCallback,
    IListener,
    IMarkedForUnsubscribe,
    IObserver,
    IPipePayload,
    ISubscribe,
    ISubscribeObject,
    ISubscriptionLike
} from "./Types";

function callbackSend<T>(value: T, subsObj: SubscribeObject<T>): void {
    const listener = subsObj.listener;
    if (!listener) return subsObj.unsubscribe();
    if (!subsObj.observable) return subsObj.unsubscribe();
    if (subsObj.isPaused) return;
    if (!subsObj.isPipe) return listener(value);

    const pipeData: IPipePayload = {isNeedUnsubscribe: false, isNeedExit: false, payload: value}
    for (let i = 0; i < subsObj.chainHandlers.length; i++) {
        subsObj.chainHandlers[i](pipeData, subsObj);
        if (pipeData.isNeedUnsubscribe) return subsObj.unsubscribe();
        if (pipeData.isNeedExit) return;
    }

    return listener(pipeData.payload);
}

export class SubscribeObject<T> implements ISubscribeObject<T>, IMarkedForUnsubscribe {
    isMarkedForUnsubscribe: boolean = false;
    observable: IObserver<T> | undefined;
    listener: IListener<T> | undefined;
    errorHandler: IErrorCallback = (errorData: any, errorMessage: any) => {
        console.log(`(Unit of SubscribeObject).send(${errorData}) ERROR:`, errorMessage);
    };
    _order = 0;
    isPaused = false;
    isPipe = false;

    chainHandlers: IChainCallback<T> [] = [];

    constructor(observable?: IObserver<T>, isPipe?: boolean) {
        this.observable = observable;
        this.isPipe = !!isPipe;
    }

    subscribe(listener: IListener<T>, errorHandler?: IErrorCallback): ISubscriptionLike {
        this.listener = listener;
        errorHandler && (this.errorHandler = errorHandler);
        return this;
    }

    public unsubscribe(): void {
        if (!this.observable) return;
        this.observable.unSubscribe(this);
        this.observable = <any>null;
        this.listener = <any>null;
        this.chainHandlers.length = 0;
    }

    send(value: T): void {
        try {
            callbackSend(value, this);
        } catch (err) {
            this.errorHandler(value, err);
        }
    }

    setOnce(): ISubscribe<T> {
        this.chainHandlers.push(
            (pipeData: IPipePayload, subsObj?: SubscribeObject<T>): void => {
                (<any>(<any>subsObj).listener)(pipeData.payload);
                pipeData.isNeedUnsubscribe = true;
            }
        );
        return this;
    }

    unsubscribeByNegative(condition: ICallback<T>): ISubscribe<T> {
        this.chainHandlers.push(
            (pipeData: IPipePayload): void => {
                if (!condition(pipeData.payload)) pipeData.isNeedUnsubscribe = true;
            }
        );
        return this
    }

    unsubscribeByPositive(condition: ICallback<T>): ISubscribe<T> {
        this.chainHandlers.push(
            (pipeData: IPipePayload): void => {
                if (condition(pipeData.payload)) pipeData.isNeedUnsubscribe = true;
            }
        );
        return this;
    }

    emitByNegative(condition: ICallback<T>): ISubscribe<T> {
        this.chainHandlers.push(
            (pipeData: IPipePayload): void => {
                if (condition(pipeData.payload)) pipeData.isNeedExit = true;
            }
        );
        return this;
    }

    emitByPositive(condition: ICallback<T>): ISubscribe<T> {
        this.chainHandlers.push(
            (pipeData: IPipePayload): void => {
                if (!condition(pipeData.payload)) pipeData.isNeedExit = true;
            }
        );
        return this;
    }

    emitMatch(condition: ICallback<T>): ISubscribe<T> {
        this.chainHandlers.push(
            (pipeData: IPipePayload): void => {
                if (condition(pipeData.payload) !== pipeData.payload) pipeData.isNeedExit = true;
            }
        );
        return this;
    }

    resume(): void {
        this.isPaused = false;
    }

    pause(): void {
        this.isPaused = true;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }
}
