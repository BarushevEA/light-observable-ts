import {Observable, OrderedObservable, Collector} from './Libraries/Observables';

declare global {
    interface Window {
        Observable: typeof Observable;
        OrderedObservable: typeof OrderedObservable;
        Collector: typeof Collector;
    }
}

window.Observable = Observable;
window.OrderedObservable = OrderedObservable;
window.Collector = Collector;
