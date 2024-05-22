import {
    ICallback, ICondition,
    IErrorCallback,
    IListener,
    IMarkedForUnsubscribe,
    IObserver,
    IOnceMarker,
    ISubscribe,
    ISubscribeObject,
    ISubscriptionLike
} from "./Types";
import {negativeCallback, positiveCallback, randomCallback} from "./FunctionLibs";

function callbackSend<T>(value: T, subsObj: SubscribeObject<T>): void {
    const listener = subsObj.listener;
    if (!listener) return subsObj.unsubscribe();
    if (!subsObj.observable) return subsObj.unsubscribe();
    if (subsObj.isPaused) return;
    if (!subsObj.isPipe) return listener(value);
    if (subsObj.emitByPositiveCondition && subsObj.emitByPositiveCondition(value)) return listener(value);
    if (subsObj.emitByNegativeCondition && !subsObj.emitByNegativeCondition(value)) return listener(value);
    if (subsObj.once.isOnce) {
        subsObj.once.isFinished = true;
        listener(value);
        return subsObj.unsubscribe();
    }
    if (subsObj.unsubscribeByNegativeCondition) {
        if (!subsObj.unsubscribeByNegativeCondition(value)) {
            subsObj.unsubscribeByNegativeCondition = <any>null;
            return subsObj.unsubscribe();
        }
        return listener(value);
    }
    if (subsObj.unsubscribeByPositiveCondition) {
        if (subsObj.unsubscribeByPositiveCondition(value)) {
            subsObj.unsubscribeByPositiveCondition = <any>null;
            return subsObj.unsubscribe();
        }
        return listener(value);
    }
    if (subsObj.emitMatchCondition && (subsObj.emitMatchCondition(value) === value)) return listener(value);
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
    once: IOnceMarker = {isOnce: false, isFinished: false};
    unsubscribeByNegativeCondition: ICallback<T> = <any>null;
    unsubscribeByPositiveCondition: ICallback<T> = <any>null;
    emitByNegativeCondition: ICallback<T> = <any>null;
    emitByPositiveCondition: ICallback<T> = <any>null;
    emitMatchCondition: ICallback<T> = <any>null;
    isPipe = false;

    conditionsList: ICondition<T>[] = [];

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
    }

    send(value: T): void {
        try {
            callbackSend(value, this);
        } catch (err) {
            this.errorHandler(value, err);
        }
    }

    setOnce(): ISubscribe<T> {
        this.once.isOnce = true;
        return this;
    }

    unsubscribeByNegative(condition: ICallback<T>): ISubscribe<T> {
        this.unsubscribeByNegativeCondition = condition ?? negativeCallback;
        return this
    }

    unsubscribeByPositive(condition: ICallback<T>): ISubscribe<T> {
        this.unsubscribeByPositiveCondition = condition ?? positiveCallback;
        return this;
    }

    emitByNegative(condition: ICallback<T>): ISubscribe<T> {
        this.emitByNegativeCondition = condition ?? positiveCallback;
        return this;
    }

    emitByPositive(condition: ICallback<T>): ISubscribe<T> {
        this.emitByPositiveCondition = condition ?? negativeCallback;
        return this;
    }

    emitMatch(condition: ICallback<T>): ISubscribe<T> {
        this.emitMatchCondition = condition ?? randomCallback;
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
