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
    chain: IChainCallback [] = [];
    flow: IPipePayload = {isBreak: false, isUnsubscribe: false, isAvailable: false, payload: null};

    abstract subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined;

    private push(callback: IChainCallback): ISetup<T> {
        this.chain.push(callback);
        return this;
    }

    setOnce(): ISubscribe<T> {
        return this.push(
            (data: IPipePayload): void => {
                (<IListener<T>>(<any>this).listener)(data.payload);
                data.isUnsubscribe = true;
            }
        );
    }

    unsubscribeBy(condition: ICallback<T>): ISetup<T> {
        return this.push(
            (data: IPipePayload): void => {
                data.isAvailable = true;
                if (condition(data.payload)) data.isUnsubscribe = true;
            }
        );
    }

    refine(condition: ICallback<T>): ISetup<T> {
        return this.push(
            (data: IPipePayload): void => {
                if (condition(data.payload)) data.isAvailable = true;
            }
        );
    }

    pushRefiners(conditions: ICallback<any>[]): ISetup<T> {
        if (!Array.isArray(conditions)) return this;
        for (let i = 0; i < conditions.length; i++) this.refine(conditions[i]);
        return this;
    }

    switch(): PipeSwitchCase<T> {
        return new PipeSwitchCase<T>(this);
    }

    then<K>(condition: ICallback<T>): ISetup<K> {
        return <any>this.push(
            (data: IPipePayload): void => {
                data.payload = condition(data.payload);
                data.isAvailable = true;
            }
        ) as ISetup<K>;
    }

    serialize(): ISetup<string> {
        return <any>this.push(
            (data: IPipePayload): void => {
                data.payload = JSON.stringify(data.payload);
                data.isAvailable = true;
            }
        ) as ISetup<string>;
    }

    deserialize<K>(): ISetup<K> {
        return <any>this.push(
            (data: IPipePayload): void => {
                data.payload = JSON.parse(data.payload);
                data.isAvailable = true;
            }
        ) as ISetup<K>;
    }

    processChain(listener: IListener<T>): void {
        const chain = this.chain;
        const data = this.flow;
        for (let i = 0; i < chain.length; i++) {
            data.isUnsubscribe = false;
            data.isAvailable = false;

            chain[i](data);
            if (data.isUnsubscribe) return (<any>this).unsubscribe();
            if (!data.isAvailable) return;
            if (data.isBreak) break;
        }

        return listener(data.payload);
    }
}

export class PipeSwitchCase<T> implements ISubscribe<T>, IPipeCase<T> {
    private pipe: Pipe<T>;
    private counter: number;

    constructor(pipe: Pipe<T>) {
        this.pipe = pipe;
        this.counter = pipe.chain.length ? pipe.chain.length : 0;
    }

    subscribe(listener: IListener<T> | ISetObservableValue, errorHandler?: IErrorCallback): ISubscriptionLike | undefined {
        return this.pipe.subscribe(listener, errorHandler);
    }

    case(condition: ICallback<any>): IPipeCase<T> & ISubscribe<T> {
        this.counter++;
        const id = this.counter;
        const chain = this.pipe.chain;
        chain.push(
            (data: IPipePayload): void => {
                data.isAvailable = true
                if (condition(data.payload)) data.isBreak = true;
                if (id === chain.length && !data.isBreak) data.isAvailable = false;
            }
        );
        return this;
    }

    pushCases(conditions: ICallback<any>[]): IPipeCase<T> & ISubscribe<T> {
        if (!Array.isArray(conditions)) return this;
        for (let i = 0; i < conditions.length; i++) this.case(conditions[i]);
        return this;
    }
}
