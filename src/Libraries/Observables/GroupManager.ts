import {IGroup, IGroupManager, IGroupOptions, IOrder, ISubscriptionLike} from "./Types";
import {Collector} from "./Collector";

export class Group extends Collector implements IGroup {
    private readonly _name: string;
    private _order: number;

    constructor(options: IGroupOptions) {
        super();
        this._name = options.name;
        this.init(options);
    }

    private init(options: IGroupOptions) {
        if (!options.subscribers) return;
        for (const subscriber of options.subscribers) {
            this.collect(subscriber);
        }
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        for (const subscriber of this.list) {
            (<IOrder><any>subscriber).order = value;
        }
        this._order = value;
    }

    get name(): string {
        return this._name;
    }
}

export class GroupManager implements IGroupManager {
    private groupPool: { [name: string]: IGroup };
    private _isDestroyed: boolean;

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    addGroup(group: IGroup) {
    }

    getGroup(name): IGroup {
        return undefined;
    }

    unsubscribe(subscriptionLike: ISubscriptionLike<any>): void {
    }

    unsubscribeAll(): void {
    }

    unsubscribeGroup(name: string) {
    }

    size(): number {
        return 0;
    }

    destroy(): void {
    }
}
