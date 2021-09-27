import {ICollector, ISubscriptionLike} from "./Types";
import {deleteFromArray} from "./FunctionLibs";

export class Collector implements ICollector {
    private list: ISubscriptionLike<any>[] = [];
    private _isDestroyed = false;

    collect(...subscriptionLikeList: ISubscriptionLike<any>[]): void {
        if(this._isDestroyed) return null;
        for (let i = 0; i < subscriptionLikeList.length; i++) {
            this.list.push(subscriptionLikeList[i]);
        }
    }

    unsubscribe(subscriptionLike: ISubscriptionLike<any>): void {
        if(this._isDestroyed) return null;
        subscriptionLike && subscriptionLike.unsubscribe();
        deleteFromArray(this.list, subscriptionLike);
    }

    unsubscribeAll(): void {
        if(this._isDestroyed) return null;
        const length = this.list.length;
        for (let i = 0; i < length; i++) {
            this.unsubscribe(this.list.pop());
        }
    }

    size(): number {
        if(this._isDestroyed) return 0;
        return this.list.length;
    }

    destroy(): void {
        this.unsubscribeAll();
        this.list.length = 0;
        this.list = <any>0;
        this._isDestroyed = true;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }
}