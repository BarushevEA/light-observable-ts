import { ICallback, IChainContainer } from "./Types";
export declare abstract class SwitchCase<T, P extends IChainContainer, W> {
    protected pipe: P;
    protected counter: number;
    constructor(pipe: P);
    or(condition: ICallback<any>): W;
    anyOf(conditions: ICallback<any>[]): W;
}
