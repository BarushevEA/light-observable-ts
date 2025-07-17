import * as Benchmark from 'benchmark';
import {Observable as LightObservable} from './src/Libraries/Observables';
import {Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

// Установите RxJS: npm install --save-dev rxjs

console.log('# Сравнение light-observable-ts с RxJS');

// 1. Создание и подписка
const suite1 = new Benchmark.Suite();
suite1
    .add('light-observable - создание и подписка', () => {
        const obs = new LightObservable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        sub?.unsubscribe();
    })
    .add('RxJS - создание и подписка', () => {
        const subject = new Subject<number>();
        const sub = subject.subscribe((value) => {
        });
        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 2. Эмиссия значений
const suite2 = new Benchmark.Suite();
suite2
    .add('light-observable - эмиссия 100 значений', () => {
        const obs = new LightObservable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });

        for (let i = 0; i < 100; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    })
    .add('RxJS - эмиссия 100 значений', () => {
        const subject = new Subject<number>();
        const sub = subject.subscribe((value) => {
        });

        for (let i = 0; i < 100; i++) {
            subject.next(i);
        }

        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 3. Фильтрация и трансформация
const suite3 = new Benchmark.Suite();
suite3
    .add('light-observable - фильтрация и трансформация', () => {
        const obs = new LightObservable<number>(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj
                .refine((value?: number) => value !== undefined && value % 2 === 0)
                .then<string>((value?: number) => `Value: ${value}`)
                .subscribe((value?: string) => {
                });

            for (let i = 0; i < 100; i++) {
                obs.next(i);
            }

            sub?.unsubscribe();
        }
    })
    .add('RxJS - фильтрация и трансформация', () => {
        const subject = new Subject<number>();
        const sub = subject.pipe(
            filter(value => value % 2 === 0),
            map(value => `Value: ${value}`)
        ).subscribe((value) => {
        });

        for (let i = 0; i < 100; i++) {
            subject.next(i);
        }

        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});
