import { ICallback, IChainCallback, IErrorCallback, IFilter, IFilterCase, IFilterPayload, IFilterResponse, IFilterSetup, IFilterSwitch } from "./Types";
export declare class FilterCollection<T> implements IFilter<T>, IFilterSwitch<T> {
    chainHandlers: IChainCallback[];
    pipeData: IFilterPayload;
    response: IFilterResponse;
    private errorHandler;
    get isEmpty(): boolean;
    filter(condition: ICallback<any>): IFilterSetup<T>;
    pushFilters(conditions: ICallback<any>[]): IFilterSetup<T>;
    switch(): FilterSwitchCase<T>;
    processChain(value: T): IFilterResponse;
    addErrorHandler(errorHandler: IErrorCallback): void;
}
export declare class FilterSwitchCase<T> implements IFilterCase<T> {
    private pipe;
    private caseCounter;
    constructor(pipe: FilterCollection<T>);
    case(condition: ICallback<any>): IFilterCase<T>;
    pushCases(conditions: ICallback<any>[]): IFilterCase<T>;
}