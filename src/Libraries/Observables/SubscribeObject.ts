import {
    IErrorCallback,
    IListener,
    IMarkedForUnsubscribe,
    IObserver,
    ISubscribeObject,
    ISubscriptionLike
} from "./Types";
import {AbstractPipe} from "./AbstractPipe";

export class SubscribeObject<T> extends AbstractPipe<T> implements ISubscribeObject<T>, IMarkedForUnsubscribe {
    isMarkedForUnsubscribe: boolean = false;
    observable: IObserver<T> | undefined;
    listener: IListener<T> | undefined;
    errorHandler: IErrorCallback = (errorData: any, errorMessage: any) => {
        console.log(`(Unit of SubscribeObject).send(${errorData}) ERROR:`, errorMessage);
    };
    _order = 0;
    isPaused = false;
    isPipe = false;

    constructor(observable?: IObserver<T>, isPipe?: boolean) {
        super();
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
            this.pipeData.payload = value;
            this.pipeData.isNeedUnsubscribe = false;
            this.pipeData.isNeedExit = false;
            processValue(value, this);
        } catch (err) {
            this.errorHandler(value, err);
        }
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

function processValue<T>(value: T, subsObj: SubscribeObject<T>): void {
    const listener = subsObj.listener;
    if (!listener) return subsObj.unsubscribe();
    if (!subsObj.observable) return subsObj.unsubscribe();
    if (subsObj.isPaused) return;
    if (!subsObj.isPipe) return listener(value);

    for (let i = 0; i < subsObj.chainHandlers.length; i++) {
        subsObj.chainHandlers[i](subsObj);
        if (subsObj.pipeData.isNeedUnsubscribe) return subsObj.unsubscribe();
        if (subsObj.pipeData.isNeedExit) return;
    }

    return listener(subsObj.pipeData.payload);
}
