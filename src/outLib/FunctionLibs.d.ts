import { ISubscribeObject } from "./Types";
export declare function deleteFromArray<T>(arr: T[], component: T): boolean;
export declare function quickDeleteFromArray<T>(arr: T[], component: T): boolean;
export declare const negativeCallback: () => boolean;
export declare const positiveCallback: () => boolean;
export declare const randomCallback: () => string;
export declare const sortAscending: (a: ISubscribeObject<any>, b: ISubscribeObject<any>) => 1 | -1 | 0;
export declare const sortDescending: (a: ISubscribeObject<any>, b: ISubscribeObject<any>) => 1 | -1 | 0;
