import * as Benchmark from 'benchmark';
import {
    Collector,
    IOrderedSubscriptionLike,
    ISubscriptionLike,
    Observable,
    OrderedObservable,
    quickDeleteFromArray,
    deleteFromArray
} from '../src/Libraries/Observables';

// Helper functions for benchmarks
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

// 1. Benchmark for creating Observable
runBenchmark('Creating Observable', {
    'new Observable': () => {
        const obs = new Observable<number>(0);
    },
    'new OrderedObservable': () => {
        const obs = new OrderedObservable<number>(0);
    }
});

// 2. Benchmark for subscribing to Observable
runBenchmark('Subscribing to Observable', {
    'subscribe - one subscriber': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        sub?.unsubscribe();
    },
    'subscribe - 10 subscribers': () => {
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

// 3. Benchmark for next method
runBenchmark('Next method', {
    'next - no subscribers': () => {
        const obs = new Observable<number>(0);
        obs.next(1);
    },
    'next - one subscriber': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        obs.next(1);
        sub?.unsubscribe();
    },
    'next - 10 subscribers': () => {
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
    'next - 100 subscribers': () => {
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

// 4. Benchmark for stream method
runBenchmark('Stream method', {
    'stream - 10 values, 1 subscriber': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        const values = Array(10).fill(0).map((_, i) => i);
        obs.stream(values);
        sub?.unsubscribe();
    },
    'stream - 100 values, 1 subscriber': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        const values = Array(100).fill(0).map((_, i) => i);
        obs.stream(values);
        sub?.unsubscribe();
    },
    'stream - 10 values, 10 subscribers': () => {
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

// 5. Benchmark for pipe and filters
runBenchmark('Pipe and filters', {
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
    'pipe.refine - simple condition': () => {
        const obs = new Observable<number>(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj.refine((value?: number) => value !== undefined && value > 0).subscribe((value?: number) => {
            });
            obs.next(1);
            sub?.unsubscribe();
        }
    },
    'pipe.refine - complex condition': () => {
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
    'pipe.then - transformation': () => {
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
    'addFilter - simple filter': () => {
        const obs = new Observable<number>(0);
        obs.addFilter().filter((value?: number) => value !== undefined && value > 0);
        const sub = obs.subscribe((value?: number) => {
        });
        obs.next(1);
        sub?.unsubscribe();
    }
});

// 6. Benchmark for OrderedObservable
runBenchmark('OrderedObservable', {
    'OrderedObservable - subscription and sorting': () => {
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
    'OrderedObservable - changing sort order': () => {
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

// 7. Benchmark for Collector
runBenchmark('Collector', {
    'Collector - collection and unsubscription': () => {
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
    'Collector - individual unsubscription': () => {
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

// 8. Benchmark for utility functions
runBenchmark('Utility functions', {
    'deleteFromArray - small array': () => {
        const arr = [1, 2, 3, 4, 5];
        deleteFromArray(arr, 3);
    },
    'quickDeleteFromArray - small array': () => {
        const arr = [1, 2, 3, 4, 5];
        quickDeleteFromArray(arr, 3);
    },
    'deleteFromArray - large array': () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        deleteFromArray(arr, 500);
    },
    'quickDeleteFromArray - large array': () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        quickDeleteFromArray(arr, 500);
    },
    'Array.splice - small array': () => {
        const arr = [1, 2, 3, 4, 5];
        const index = arr.indexOf(3);
        if (index !== -1) arr.splice(index, 1);
    },
    'Array.splice - large array': () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        const index = arr.indexOf(500);
        if (index !== -1) arr.splice(index, 1);
    }
});

// 9. Benchmark for performance comparison at different loads
runBenchmark('Performance comparison at different loads', {
    'Observable - light load (10 operations)': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });

        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    },
    'Observable - medium load (100 operations)': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });

        for (let i = 0; i < 100; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    },
    'Observable - heavy load (1000 operations)': () => {
        const obs = new Observable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });

        for (let i = 0; i < 1000; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    }
});

// 10. Benchmark comparison between deleteFromArray and quickDeleteFromArray
runBenchmark('Comparison between deleteFromArray and quickDeleteFromArray', {
    'deleteFromArray - small array (10 elements)': () => {
        const arr = Array(10).fill(0).map((_, i) => i);
        deleteFromArray(arr, 5);
    },
    'quickDeleteFromArray - small array (10 elements)': () => {
        const arr = Array(10).fill(0).map((_, i) => i);
        quickDeleteFromArray(arr, 5);
    },
    'deleteFromArray - medium array (100 elements)': () => {
        const arr = Array(100).fill(0).map((_, i) => i);
        deleteFromArray(arr, 50);
    },
    'quickDeleteFromArray - medium array (100 elements)': () => {
        const arr = Array(100).fill(0).map((_, i) => i);
        quickDeleteFromArray(arr, 50);
    },
    'deleteFromArray - large array (10000 elements)': () => {
        const arr = Array(10000).fill(0).map((_, i) => i);
        deleteFromArray(arr, 5000);
    },
    'quickDeleteFromArray - large array (10000 elements)': () => {
        const arr = Array(10000).fill(0).map((_, i) => i);
        quickDeleteFromArray(arr, 5000);
    }
});

// 11. Benchmark comparison with other implementations (simulation)
console.log('\n# Comparison with other implementations (simulation)');
console.log('For a real comparison, you need to add other libraries, such as RxJS');
