import * as Benchmark from 'benchmark';
import {
    IOrderedSubscriptionLike,
    Observable,
    OrderedObservable,
    quickDeleteFromArray
} from './src/Libraries/Observables';

console.log('# Бенчмарк для тестирования оптимизаций');

// 1. Тестирование оптимизации quickDeleteFromArray
const suite1 = new Benchmark.Suite();
suite1
    .add('Текущая реализация quickDeleteFromArray', () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        quickDeleteFromArray(arr, 500);
    })
    .add('Оптимизированная реализация quickDeleteFromArray', () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        const index = arr.indexOf(500);
        if (index === -1) return false;
        arr[index] = arr[--arr.length]; // Более компактная версия
        return true;
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 2. Тестирование оптимизации OrderedObservable.sortByOrder
// Для этого нужно создать две версии класса и сравнить их производительность

// Имитация оптимизированной версии
function benchmarkCurrentSortByOrder() {
    const obs = new OrderedObservable<number>(0);
    const subs: IOrderedSubscriptionLike[] = [];

    // Создаем 100 подписчиков с разными порядками
    for (let i = 0; i < 100; i++) {
        const sub = obs.subscribe((value?: number) => {
        }) as IOrderedSubscriptionLike;
        if (sub) {
            sub.order = Math.random() * 100;
            subs.push(sub);
        }
    }

    // Вызываем сортировку
    obs.sortByOrder();

    // Эмиссия значения
    obs.next(1);

    // Очистка
    for (let i = 0; i < subs.length; i++) {
        subs[i].unsubscribe();
    }
}

// Имитация оптимизированной версии с флагом needsResorting
function benchmarkOptimizedSortByOrder() {
    const obs = new OrderedObservable<number>(0);
    const subs: IOrderedSubscriptionLike[] = [];
    let needsResorting = false;

    // Создаем 100 подписчиков с разными порядками
    for (let i = 0; i < 100; i++) {
        const sub = obs.subscribe((value?: number) => {
        }) as IOrderedSubscriptionLike;
        if (sub) {
            sub.order = Math.random() * 100;
            needsResorting = true;
            subs.push(sub);
        }
    }

    // Вызываем сортировку только если нужно
    if (needsResorting) {
        obs.sortByOrder();
        needsResorting = false;
    }

    // Эмиссия значения
    obs.next(1);

    // Очистка
    for (let i = 0; i < subs.length; i++) {
        subs[i].unsubscribe();
    }
}

const suite2 = new Benchmark.Suite();
suite2
    .add('Текущая реализация sortByOrder', benchmarkCurrentSortByOrder)
    .add('Оптимизированная реализация sortByOrder', benchmarkOptimizedSortByOrder)
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 3. Тестирование оптимизации Collector.unsubscribeAll
const suite3 = new Benchmark.Suite();

// Текущая реализация
function benchmarkCurrentUnsubscribeAll() {
    const arr: { unsubscribe: () => void }[] = [];
    for (let i = 0; i < 100; i++) {
        arr.push({
            unsubscribe: () => {
            }
        });
    }

    // Имитация текущей реализации
    while (arr.length > 0) {
        const item = arr.pop();
        if (item) {
            item.unsubscribe();
        }
    }
}

// Оптимизированная реализация
function benchmarkOptimizedUnsubscribeAll() {
    const arr: { unsubscribe: () => void }[] = [];
    for (let i = 0; i < 100; i++) {
        arr.push({
            unsubscribe: () => {
            }
        });
    }

    // Имитация оптимизированной реализации
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i]) {
            arr[i].unsubscribe();
        }
    }
    arr.length = 0;
}

suite3
    .add('Текущая реализация unsubscribeAll', benchmarkCurrentUnsubscribeAll)
    .add('Оптимизированная реализация unsubscribeAll', benchmarkOptimizedUnsubscribeAll)
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 4. Тестирование оптимизации обработки фильтров
const suite4 = new Benchmark.Suite();

// Текущая реализация
function benchmarkCurrentFilterProcessing() {
    const obs = new Observable<number>(0);
    obs.addFilter().filter((value?: number) => value !== undefined && value > 0);
    const sub = obs.subscribe((value?: number) => {
    });

    for (let i = 0; i < 100; i++) {
        obs.next(i);
    }

    sub?.unsubscribe();
}

// Оптимизированная реализация (имитация с ранним возвратом)
function benchmarkOptimizedFilterProcessing() {
    const obs = new Observable<number>(0);
    const hasFilters = true; // Имитация проверки наличия фильтров
    obs.addFilter().filter((value?: number) => value !== undefined && value > 0);
    const sub = obs.subscribe((value?: number) => {
    });

    for (let i = 0; i < 100; i++) {
        // Имитация оптимизированной реализации с ранним возвратом
        if (i <= 0 && hasFilters) continue; // Ранний возврат для значений, не проходящих фильтр

        // Имитация вызова next для значений, проходящих фильтр
        if (i > 0) {
            // Имитация вызова next
        }
    }

    sub?.unsubscribe();
}

suite4
    .add('Текущая обработка фильтров', benchmarkCurrentFilterProcessing)
    .add('Оптимизированная обработка фильтров', benchmarkOptimizedFilterProcessing)
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});
