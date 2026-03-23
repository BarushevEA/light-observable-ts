import {Observable} from '../src/Libraries/Observables';

// Warmup
const warmup$ = new Observable(0);
warmup$.subscribe(() => {});
for (let i = 0; i < 100_000; i++) warmup$.next(i);
warmup$.destroy();

const N = 2_000_000;

// Test 1: Pure emission — 1 subscriber
const obs1 = new Observable(0);
obs1.subscribe(() => {});
const t1 = process.hrtime.bigint();
for (let i = 0; i < N; i++) obs1.next(i);
const t2 = process.hrtime.bigint();
console.log(`Pure emit ${N/1e6}M:`, (Number(t2 - t1) / 1e6).toFixed(1), 'ms');

// Test 2: Pipe chain (and + map)
const obs2 = new Observable(0);
obs2.pipe().and((v?: number) => v! > 0).map<number>((v?: number) => v! * 2).subscribe(() => {});
const t3 = process.hrtime.bigint();
for (let i = 0; i < N; i++) obs2.next(i);
const t4 = process.hrtime.bigint();
console.log(`Pipe and+map ${N/1e6}M:`, (Number(t4 - t3) / 1e6).toFixed(1), 'ms');

// Test 3: 10 subs no pipe
const obs3 = new Observable(0);
for (let i = 0; i < 10; i++) obs3.subscribe(() => {});
const t5 = process.hrtime.bigint();
for (let i = 0; i < N; i++) obs3.next(i);
const t6 = process.hrtime.bigint();
console.log(`10 subs ${N/1e6}M:`, (Number(t6 - t5) / 1e6).toFixed(1), 'ms');

// Test 4: 10 piped subs
const obs4 = new Observable(0);
for (let i = 0; i < 10; i++) obs4.pipe().and((v?: number) => v! > 0).subscribe(() => {});
const t7 = process.hrtime.bigint();
for (let i = 0; i < N; i++) obs4.next(i);
const t8 = process.hrtime.bigint();
console.log(`10 piped subs ${N/1e6}M:`, (Number(t8 - t7) / 1e6).toFixed(1), 'ms');

obs1.destroy(); obs2.destroy(); obs3.destroy(); obs4.destroy();
