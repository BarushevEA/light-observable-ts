import * as Benchmark from 'benchmark';
import {
    Collector,
    IOrderedSubscriptionLike,
    ISubscriptionLike,
    Observable,
    OrderedObservable,
    quickDeleteFromArray
} from './src/Libraries/Observables';

// Вспомогательные функции для бенчмарков
function runBenchmark(name: string, tests: { [key: string]: Function }) {
    console.log(`\n# ${name}`);
    const suite = new Benchmark.Suite();

    Object.entries(tests).forEach(([testName, testFn]) => {
        suite.add(testName, testFn);
    });

    suite
        .on('cycle', (event: any) => {
            console.log(String(event.target));
        })
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
        })
        .run({async: false});
}

// 1. Бенчмарк создания Observable
runBenchmark('Создание Observable', {
    'new Observable': () => {
        const obs = new Observable<number>(0);
    },
    'new OrderedObservable': () => {
        const obs = new OrderedObservable<number>(0);
    }
});

// 2. Бенчмарк подписки на Observable
runBenchmark('Подписка на Observable', {
    'subscribe - один подписчик': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        sub?.unsubscribe();
    },
    'subscribe - 10 подписчиков': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];
        for (let i = 0; i < 10; i++) {
            const sub = obs.subscribe((value?: number) => {
            });
            if (sub) subs.push(sub);
        }
        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    }
});

// 3. Бенчмарк метода next
runBenchmark('Метод next', {
    'next - без подписчиков': () => {
        const obs = new Observable<number>(0);
        obs.next(1);
    },
    'next - один подписчик': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        obs.next(1);
        sub?.unsubscribe();
    },
    'next - 10 подписчиков': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];
        for (let i = 0; i < 10; i++) {
            const sub = obs.subscribe((value?: number) => {
            });
            if (sub) subs.push(sub);
        }
        obs.next(1);
        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'next - 100 подписчиков': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];
        for (let i = 0; i < 100; i++) {
            const sub = obs.subscribe((value?: number) => {
            });
            if (sub) subs.push(sub);
        }
        obs.next(1);
        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    }
});

// 4. Бенчмарк метода stream
runBenchmark('Метод stream', {
    'stream - 10 значений, 1 подписчик': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        const values = Array(10).fill(0).map((_, i) => i);
        obs.stream(values);
        sub?.unsubscribe();
    },
    'stream - 100 значений, 1 подписчик': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        const values = Array(100).fill(0).map((_, i) => i);
        obs.stream(values);
        sub?.unsubscribe();
    },
    'stream - 10 значений, 10 подписчиков': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];
        for (let i = 0; i < 10; i++) {
            const sub = obs.subscribe((value?: number) => {
            });
            if (sub) subs.push(sub);
        }
        const values = Array(10).fill(0).map((_, i) => i);
        obs.stream(values);
        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    }
});

// 5. Бенчмарк pipe и фильтров
runBenchmark('Pipe и фильтры', {
    'pipe.setOnce': () => {
        const obs = new Observable<number>(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj.setOnce().subscribe((value?: number) => {
            });
            obs.next(1);
            obs.next(2); // Этот вызов не должен достичь подписчика
        }
    },
    'pipe.refine - простое условие': () => {
        const obs = new Observable<number>(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj.refine((value?: number) => value !== undefined && value > 0).subscribe((value?: number) => {
            });
            obs.next(1);
            sub?.unsubscribe();
        }
    },
    'pipe.refine - сложное условие': () => {
        const obs = new Observable<number>(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj
                .refine((value?: number) => value !== undefined && value > 0)
                .refine((value?: number) => value !== undefined && value % 2 === 0)
                .subscribe((value?: number) => {
                });
            obs.next(2);
            sub?.unsubscribe();
        }
    },
    'pipe.then - трансформация': () => {
        const obs = new Observable<number>(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj
                .then<string>((value?: number) => `Value: ${value}`)
                .subscribe((value?: string) => {
                });
            obs.next(1);
            sub?.unsubscribe();
        }
    },
    'addFilter - простой фильтр': () => {
        const obs = new Observable<number>(0);
        obs.addFilter().filter((value?: number) => value !== undefined && value > 0);
        const sub = obs.subscribe((value?: number) => {
        });
        obs.next(1);
        sub?.unsubscribe();
    }
});

// 6. Бенчмарк OrderedObservable
runBenchmark('OrderedObservable', {
    'OrderedObservable - подписка и сортировка': () => {
        const obs = new OrderedObservable<number>(0);
        const sub1 = obs.subscribe((value?: number) => {
        }) as IOrderedSubscriptionLike;
        const sub2 = obs.subscribe((value?: number) => {
        }) as IOrderedSubscriptionLike;
        const sub3 = obs.subscribe((value?: number) => {
        }) as IOrderedSubscriptionLike;

        if (sub1 && sub2 && sub3) {
            // Установка порядка
            sub1.order = 3;
            sub2.order = 1;
            sub3.order = 2;

            // Сортировка и эмиссия
            obs.sortByOrder();
            obs.next(1);

            sub1.unsubscribe();
            sub2.unsubscribe();
            sub3.unsubscribe();
        }
    },
    'OrderedObservable - изменение порядка сортировки': () => {
        const obs = new OrderedObservable<number>(0);
        const sub1 = obs.subscribe((value?: number) => {
        });
        const sub2 = obs.subscribe((value?: number) => {
        });
        const sub3 = obs.subscribe((value?: number) => {
        });

        // Изменение порядка сортировки
        obs.setDescendingSort();
        obs.next(1);

        obs.setAscendingSort();
        obs.next(2);

        sub1?.unsubscribe();
        sub2?.unsubscribe();
        sub3?.unsubscribe();
    }
});

// 7. Бенчмарк Collector
runBenchmark('Collector', {
    'Collector - сбор и отписка': () => {
        const collector = new Collector();
        const obs = new Observable<number>(0);

        const sub1 = obs.subscribe((value?: number) => {
        });
        const sub2 = obs.subscribe((value?: number) => {
        });
        const sub3 = obs.subscribe((value?: number) => {
        });

        if (sub1 && sub2 && sub3) {
            collector.collect(sub1, sub2, sub3);

            obs.next(1);
            collector.unsubscribeAll();
        }
    },
    'Collector - индивидуальная отписка': () => {
        const collector = new Collector();
        const obs = new Observable<number>(0);

        const sub1 = obs.subscribe((value?: number) => {
        });
        const sub2 = obs.subscribe((value?: number) => {
        });
        const sub3 = obs.subscribe((value?: number) => {
        });

        if (sub1 && sub2 && sub3) {
            collector.collect(sub1, sub2, sub3);

            obs.next(1);
            collector.unsubscribe(sub1);
            obs.next(2);
            collector.unsubscribe(sub2);
            obs.next(3);
            collector.unsubscribe(sub3);
        }
    }
});

// 8. Бенчмарк вспомогательных функций
runBenchmark('Вспомогательные функции', {
    'quickDeleteFromArray - маленький массив': () => {
        const arr = [1, 2, 3, 4, 5];
        quickDeleteFromArray(arr, 3);
    },
    'quickDeleteFromArray - большой массив': () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        quickDeleteFromArray(arr, 500);
    },
    'Array.splice - маленький массив': () => {
        const arr = [1, 2, 3, 4, 5];
        const index = arr.indexOf(3);
        if (index !== -1) arr.splice(index, 1);
    },
    'Array.splice - большой массив': () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        const index = arr.indexOf(500);
        if (index !== -1) arr.splice(index, 1);
    }
});

// 9. Бенчмарк сравнения производительности при разных нагрузках
runBenchmark('Сравнение производительности при разных нагрузках', {
    'Observable - легкая нагрузка (10 операций)': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });

        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    },
    'Observable - средняя нагрузка (100 операций)': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });

        for (let i = 0; i < 100; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    },
    'Observable - тяжелая нагрузка (1000 операций)': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });

        for (let i = 0; i < 1000; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    }
});

// 10. Бенчмарк сравнения с другими реализациями (имитация)
console.log('\n# Сравнение с другими реализациями (имитация)');
console.log('Для реального сравнения необходимо добавить другие библиотеки, например RxJS');
