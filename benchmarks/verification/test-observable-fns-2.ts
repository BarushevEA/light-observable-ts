import {Subject as ObservableFnsSubject, multicast, filter, map} from 'observable-fns';

console.log('=== TEST 4: pipe() с multicast ПОСЛЕ ===');
{
    const subject = new ObservableFnsSubject<number>();

    // Используем pipe() как в примерах из README
    const pipeline = subject.pipe(
        filter(v => {
            console.log(`Filter called with ${v}`);
            return v % 2 === 0;
        }),
        map(v => {
            console.log(`Map called with ${v}`);
            return `Value: ${v}`;
        })
    );

    // Применяем multicast к результату pipe
    const multicasted = multicast(pipeline);

    console.log('Добавляем 3 подписчика...');
    multicasted.subscribe(v => console.log(`Subscriber 1: ${v}`));
    multicasted.subscribe(v => console.log(`Subscriber 2: ${v}`));
    multicasted.subscribe(v => console.log(`Subscriber 3: ${v}`));

    console.log('\nОтправляем значение 4...');
    subject.next(4);
    console.log('\nОтправляем значение 5...');
    subject.next(5);
}

console.log('\n\n=== TEST 5: Создать Subject ВНУТРИ Observable, потом multicast ===');
{
    // Создаем Observable который будет источником
    const source = new ObservableFnsSubject<number>();

    // Создаем pipe БЕЗ multicast
    const pipeline = source.pipe(
        filter(v => {
            console.log(`Filter called with ${v}`);
            return v % 2 === 0;
        }),
        map(v => {
            console.log(`Map called with ${v}`);
            return `Value: ${v}`;
        })
    );

    // НЕ используем multicast, просто подписываемся напрямую
    console.log('Добавляем 3 подписчика...');
    pipeline.subscribe(v => console.log(`Subscriber 1: ${v}`));
    pipeline.subscribe(v => console.log(`Subscriber 2: ${v}`));
    pipeline.subscribe(v => console.log(`Subscriber 3: ${v}`));

    console.log('\nОтправляем значение 4...');
    source.next(4);
    console.log('\nОтправляем значение 5...');
    source.next(5);
}
