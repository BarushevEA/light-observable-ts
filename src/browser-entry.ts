import {Observable, OrderedObservable, Collector} from './Libraries/Observables';

const w = window as any;
w.Observable = Observable;
w.OrderedObservable = OrderedObservable;
w.Collector = Collector;
