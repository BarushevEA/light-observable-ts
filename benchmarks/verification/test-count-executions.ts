import {Subject as ObservableFnsSubject, multicast} from 'observable-fns';
import {Observable as LightObservable} from './src/Libraries/Observables';

console.log('=== ПОДСЧЕТ ВЫЗОВОВ FILTER ===\n');

// Test 1: EVG Observable
console.log('--- EVG Observable ---');
{
    let filterCount = 0;
    let mapCount = 0;

    const obs = new LightObservable<number>(0);
    const pipe = obs.pipe()!
        .refine(v => {
            filterCount++;
            return v !== undefined && v % 2 === 0;
        })
        .then<string>(v => {
            mapCount++;
            return `Value: ${v}`;
        });

    // 100 подписчиков
    for (let i = 0; i < 100; i++) {
        pipe.subscribe(() => {});
    }

    filterCount = 0;
    mapCount = 0;

    // Отправляем 10 значений
    for (let i = 0; i < 10; i++) {
        obs.next(i);
    }

    console.log(`100 подписчиков, 10 emissions:`);
    console.log(`  Filter executions: ${filterCount}`);
    console.log(`  Map executions: ${mapCount}`);
    console.log(`  Expected: 10 filter, 5 map (половина проходит фильтр)`);
}

// Test 2: observable-fns with multicast
console.log('\n--- observable-fns (multicast) ---');
{
    let filterCount = 0;
    let mapCount = 0;

    const subject = new ObservableFnsSubject<number>();
    const multicasted = multicast(subject);
    const pipeline = multicasted
        .filter(v => {
            filterCount++;
            return v % 2 === 0;
        })
        .map(v => {
            mapCount++;
            return `Value: ${v}`;
        });

    // 100 подписчиков
    for (let i = 0; i < 100; i++) {
        pipeline.subscribe(() => {});
    }

    filterCount = 0;
    mapCount = 0;

    // Отправляем 10 значений
    for (let i = 0; i < 10; i++) {
        subject.next(i);
    }

    // Даем время на async обработку
    setTimeout(() => {
        console.log(`100 подписчиков, 10 emissions:`);
        console.log(`  Filter executions: ${filterCount}`);
        console.log(`  Map executions: ${mapCount}`);
        console.log(`  Expected if sharing: 10 filter, 5 map`);
        console.log(`  Expected if per-subscriber: 1000 filter, 500 map`);

        if (filterCount > 100) {
            console.log(`\n⚠️  ПРОБЛЕМА: Filter вызывается ${filterCount / 10} раз на подписчика!`);
            console.log(`  Это ${filterCount / 10}x больше чем нужно для горячего observable!`);
        }
    }, 100);
}
