import {IExtendedSubscription, ISubscriptionLike} from "./Observables/Types";
import {ICollector} from "./Types";

const clearNumber = 1000;

export class EventCollector implements ICollector {
    private collector: IExtendedSubscription[] = [];
    private collectorBuffer: IExtendedSubscription[] = [];
    private destroySubscriberCounter = 0;
    private _isEmpty = true;

    public collect(...subscribers: ISubscriptionLike[]): void {
        for (let i = 0; i < subscribers.length; i++) {
            this.collector.push(<IExtendedSubscription>subscribers[i]);
        }
        this._isEmpty = !this.collector.length;
    }

    public unsubscribe(subscriber: ISubscriptionLike): void {
        if (!subscriber || !subscriber.unsubscribe || !this.collector.length) {
            return;
        }

        const sbIndex = this.collector.indexOf(<IExtendedSubscription>subscriber);

        if (sbIndex > -1) {
            this.destroySubscriberCounter++;
            this.collector[sbIndex].unsubscribe();
            this.collector[sbIndex] = <any>0;
        } else {
            subscriber.unsubscribe();
        }

        this.clearCollector();
        this._isEmpty = !this.collector.length;
    }

    private clearCollector(): void {
        if (this.destroySubscriberCounter >= clearNumber && this.collector.length) {
            this.destroySubscriberCounter = 0;
            let length = this.collector.length;
            for (let i = 0; i < length; i++) {
                const subscriber = this.collector.pop();
                if (!!subscriber) {
                    this.collectorBuffer.push(subscriber);
                }
            }
            length = this.collectorBuffer.length;
            for (let i = 0; i < length; i++) {
                const subscriber = this.collectorBuffer.pop();
                this.collector.push(<IExtendedSubscription>subscriber);
            }
        }
    }

    private unlinkSubscribers(arr: ISubscriptionLike[]): void {
        for (let i = 0; i < arr.length; i++) {
            const subscriber = arr[i];
            if (subscriber) {
                subscriber.unsubscribe();
            }
        }
        arr.length = 0;
    }

    public destroy(): void {
        this.clear();
        this._isEmpty = !this.collector.length;
        this.collector = <any>0;
        this.collectorBuffer = <any>0;
    }

    public clear(): void {
        this.unlinkSubscribers(this.collector);
        this.unlinkSubscribers(this.collectorBuffer);
        this.destroySubscriberCounter = 0;
        this._isEmpty = !this.collector.length;
    }

    get isEmpty(): boolean {
        return this._isEmpty;
    }

    public pauseDisable(): void {
        this.setPause(false);
    }

    public pauseEnable(): void {
        this.setPause(true);
    }

    private setPause(isEnable: boolean) {
        if (!!this.collector) {
            for (let i = 0; i < this.collector.length; i++) {
                const element = this.collector[i];
                if (isEnable) {
                    element.pause();
                } else {
                    element.resume();
                }
            }
        }
    }
}
