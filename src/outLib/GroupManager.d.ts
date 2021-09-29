import { IGroup, IGroupManager, IGroupOptions, ISubscriptionLike } from "./Types";
import { Collector } from "./Collector";
export declare class Group extends Collector implements IGroup {
    private readonly _name;
    private _order;
    constructor(options: IGroupOptions);
    private init;
    get order(): number;
    set order(value: number);
    get name(): string;
}
export declare class GroupManager implements IGroupManager {
    private groupPool;
    private _isDestroyed;
    get isDestroyed(): boolean;
    addGroup(group: IGroup): void;
    getGroup(name: any): IGroup;
    unsubscribe(subscriptionLike: ISubscriptionLike<any>): void;
    unsubscribeAll(): void;
    unsubscribeGroup(name: string): void;
    size(): number;
    destroy(): void;
}
