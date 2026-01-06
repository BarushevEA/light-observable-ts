"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Benchmark = __importStar(require("benchmark"));
const Observables_1 = require("./src/Libraries/Observables");
// Helper functions for benchmarks
function runBenchmark(name, tests) {
    console.log(`\n# ${name}`);
    const suite = new Benchmark.Suite();
    Object.entries(tests).forEach(([testName, testFn]) => {
        suite.add(testName, testFn);
    });
    suite
        .on('cycle', (event) => {
        console.log(String(event.target));
    })
        .on('complete', function () {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
        .run({ async: false });
}
// 1. Benchmark for creating Observable
runBenchmark('Creating Observable', {
    'new Observable': () => {
        const obs = new Observables_1.Observable(0);
    },
    'new OrderedObservable': () => {
        const obs = new Observables_1.OrderedObservable(0);
    }
});
// 2. Benchmark for subscribing to Observable
runBenchmark('Subscribing to Observable', {
    'subscribe - one subscriber': () => {
        const obs = new Observables_1.Observable(0);
        const sub = obs.subscribe((value) => {
        });
        sub?.unsubscribe();
    },
    'subscribe - 10 subscribers': () => {
        const obs = new Observables_1.Observable(0);
        const subs = [];
        for (let i = 0; i < 10; i++) {
            const sub = obs.subscribe((value) => {
            });
            if (sub)
                subs.push(sub);
        }
        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    }
});
// 3. Benchmark for next method
runBenchmark('Next method', {
    'next - no subscribers': () => {
        const obs = new Observables_1.Observable(0);
        obs.next(1);
    },
    'next - one subscriber': () => {
        const obs = new Observables_1.Observable(0);
        const sub = obs.subscribe((value) => {
        });
        obs.next(1);
        sub?.unsubscribe();
    },
    'next - 10 subscribers': () => {
        const obs = new Observables_1.Observable(0);
        const subs = [];
        for (let i = 0; i < 10; i++) {
            const sub = obs.subscribe((value) => {
            });
            if (sub)
                subs.push(sub);
        }
        obs.next(1);
        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'next - 100 subscribers': () => {
        const obs = new Observables_1.Observable(0);
        const subs = [];
        for (let i = 0; i < 100; i++) {
            const sub = obs.subscribe((value) => {
            });
            if (sub)
                subs.push(sub);
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
        const obs = new Observables_1.Observable(0);
        const sub = obs.subscribe((value) => {
        });
        const values = Array(10).fill(0).map((_, i) => i);
        obs.stream(values);
        sub?.unsubscribe();
    },
    'stream - 100 values, 1 subscriber': () => {
        const obs = new Observables_1.Observable(0);
        const sub = obs.subscribe((value) => {
        });
        const values = Array(100).fill(0).map((_, i) => i);
        obs.stream(values);
        sub?.unsubscribe();
    },
    'stream - 10 values, 10 subscribers': () => {
        const obs = new Observables_1.Observable(0);
        const subs = [];
        for (let i = 0; i < 10; i++) {
            const sub = obs.subscribe((value) => {
            });
            if (sub)
                subs.push(sub);
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
        const obs = new Observables_1.Observable(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj.setOnce().subscribe((value) => {
            });
            obs.next(1);
            obs.next(2); // Этот вызов не должен достичь подписчика
        }
    },
    'pipe.refine - simple condition': () => {
        const obs = new Observables_1.Observable(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj.refine((value) => value !== undefined && value > 0).subscribe((value) => {
            });
            obs.next(1);
            sub?.unsubscribe();
        }
    },
    'pipe.refine - complex condition': () => {
        const obs = new Observables_1.Observable(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj
                .refine((value) => value !== undefined && value > 0)
                .refine((value) => value !== undefined && value % 2 === 0)
                .subscribe((value) => {
            });
            obs.next(2);
            sub?.unsubscribe();
        }
    },
    'pipe.then - transformation': () => {
        const obs = new Observables_1.Observable(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj
                .then((value) => `Value: ${value}`)
                .subscribe((value) => {
            });
            obs.next(1);
            sub?.unsubscribe();
        }
    },
    'addFilter - simple filter': () => {
        const obs = new Observables_1.Observable(0);
        obs.addFilter().filter((value) => value !== undefined && value > 0);
        const sub = obs.subscribe((value) => {
        });
        obs.next(1);
        sub?.unsubscribe();
    }
});
// 6. Benchmark for OrderedObservable
runBenchmark('OrderedObservable', {
    'OrderedObservable - subscription and sorting': () => {
        const obs = new Observables_1.OrderedObservable(0);
        const sub1 = obs.subscribe((value) => {
        });
        const sub2 = obs.subscribe((value) => {
        });
        const sub3 = obs.subscribe((value) => {
        });
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
        const obs = new Observables_1.OrderedObservable(0);
        const sub1 = obs.subscribe((value) => {
        });
        const sub2 = obs.subscribe((value) => {
        });
        const sub3 = obs.subscribe((value) => {
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
        const collector = new Observables_1.Collector();
        const obs = new Observables_1.Observable(0);
        const sub1 = obs.subscribe((value) => {
        });
        const sub2 = obs.subscribe((value) => {
        });
        const sub3 = obs.subscribe((value) => {
        });
        if (sub1 && sub2 && sub3) {
            collector.collect(sub1, sub2, sub3);
            obs.next(1);
            collector.unsubscribeAll();
        }
    },
    'Collector - individual unsubscription': () => {
        const collector = new Observables_1.Collector();
        const obs = new Observables_1.Observable(0);
        const sub1 = obs.subscribe((value) => {
        });
        const sub2 = obs.subscribe((value) => {
        });
        const sub3 = obs.subscribe((value) => {
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
        (0, Observables_1.deleteFromArray)(arr, 3);
    },
    'quickDeleteFromArray - small array': () => {
        const arr = [1, 2, 3, 4, 5];
        (0, Observables_1.quickDeleteFromArray)(arr, 3);
    },
    'deleteFromArray - large array': () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        (0, Observables_1.deleteFromArray)(arr, 500);
    },
    'quickDeleteFromArray - large array': () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        (0, Observables_1.quickDeleteFromArray)(arr, 500);
    },
    'Array.splice - small array': () => {
        const arr = [1, 2, 3, 4, 5];
        const index = arr.indexOf(3);
        if (index !== -1)
            arr.splice(index, 1);
    },
    'Array.splice - large array': () => {
        const arr = Array(1000).fill(0).map((_, i) => i);
        const index = arr.indexOf(500);
        if (index !== -1)
            arr.splice(index, 1);
    }
});
// 9. Benchmark for performance comparison at different loads
runBenchmark('Performance comparison at different loads', {
    'Observable - light load (10 operations)': () => {
        const obs = new Observables_1.Observable(0);
        const sub = obs.subscribe((value) => {
        });
        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }
        sub?.unsubscribe();
    },
    'Observable - medium load (100 operations)': () => {
        const obs = new Observables_1.Observable(0);
        const sub = obs.subscribe((value) => {
        });
        for (let i = 0; i < 100; i++) {
            obs.next(i);
        }
        sub?.unsubscribe();
    },
    'Observable - heavy load (1000 operations)': () => {
        const obs = new Observables_1.Observable(0);
        const sub = obs.subscribe((value) => {
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
        (0, Observables_1.deleteFromArray)(arr, 5);
    },
    'quickDeleteFromArray - small array (10 elements)': () => {
        const arr = Array(10).fill(0).map((_, i) => i);
        (0, Observables_1.quickDeleteFromArray)(arr, 5);
    },
    'deleteFromArray - medium array (100 elements)': () => {
        const arr = Array(100).fill(0).map((_, i) => i);
        (0, Observables_1.deleteFromArray)(arr, 50);
    },
    'quickDeleteFromArray - medium array (100 elements)': () => {
        const arr = Array(100).fill(0).map((_, i) => i);
        (0, Observables_1.quickDeleteFromArray)(arr, 50);
    },
    'deleteFromArray - large array (10000 elements)': () => {
        const arr = Array(10000).fill(0).map((_, i) => i);
        (0, Observables_1.deleteFromArray)(arr, 5000);
    },
    'quickDeleteFromArray - large array (10000 elements)': () => {
        const arr = Array(10000).fill(0).map((_, i) => i);
        (0, Observables_1.quickDeleteFromArray)(arr, 5000);
    }
});
// 11. Benchmark comparison with other implementations (simulation)
console.log('\n# Comparison with other implementations (simulation)');
console.log('For a real comparison, you need to add other libraries, such as RxJS');
