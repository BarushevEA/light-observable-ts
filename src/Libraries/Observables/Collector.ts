import {ICollector, ISubscriptionLike} from "./Types";
import {deleteFromArray} from "../FunctionLibs";

export class Collector implements ICollector {
    private list: ISubscriptionLike<any>[] = [];
    private _isDestroyed = false;

    collect(...subscriptionLikeList: ISubscriptionLike<any>[]): void {
        if(this._isDestroyed) return;
        for (let i = 0; i < subscriptionLikeList.length; i++) {
            this.list.push(subscriptionLikeList[i]);
        }
    }

    unsubscribe(subscriptionLike: ISubscriptionLike<any>): void {
        if(this._isDestroyed) return;
        subscriptionLike && subscriptionLike.unsubscribe();
        deleteFromArray(this.list, subscriptionLike);
    }

    unsubscribeAll(): void {
        if(this._isDestroyed) return;
        const length = this.list.length;
        for (let i = 0; i < length; i++) {
            this.unsubscribe(this.list.pop());
        }
    }

    destroy(): void {
        this.unsubscribeAll();
        this.list = <any>0;
        this._isDestroyed = true;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }
}