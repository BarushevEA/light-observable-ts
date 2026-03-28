import { FilterSwitchCase } from "./FilterCollection";
import { ICallback } from "./CoreTypes";
export type IFilterPayload = {
    isBreak: boolean;
    isAvailable: boolean;
    payload: any;
};
export type IFilterChainCallback = (data: IFilterPayload) => void;
export type IFilterResponse = {
    isOK: boolean;
    payload: any;
};
export type IFilter<T> = {
    and(condition: ICallback<any>): IFilterSetup<T>;
    allOf(conditions: ICallback<any>[]): IFilterSetup<T>;
};
export type IFilterSetup<T> = IFilter<T> & IFilterSwitch<T>;
export type IFilterSwitch<T> = {
    choice(): FilterSwitchCase<T>;
};
export type IFilterCase<T> = {
    or(condition: ICallback<any>): IFilterCase<T>;
    anyOf(conditions: ICallback<any>[]): IFilterCase<T>;
};
export type IAddFilter<T> = {
    addFilter(): IFilterSetup<T>;
};
