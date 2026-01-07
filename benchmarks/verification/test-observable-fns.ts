import {Subject as ObservableFnsSubject, multicast} from 'observable-fns';

console.log('=== TEST 1: Subject + filter без multicast ===');
{
    const subject = new ObservableFnsSubject<number>();
    const filtered = subject.filter(v => {
        console.log(`Filter called with ${v}`);
        return v % 2 === 0;
    });

    console.log('Добавляем 3 подписчика к filtered...');
    filtered.subscribe(v => console.log(`Subscriber 1: ${v}`));
    filtered.subscribe(v => console.log(`Subscriber 2: ${v}`));
    filtered.subscribe(v => console.log(`Subscriber 3: ${v}`));

    console.log('\nОтправляем значение 4...');
    subject.next(4);
    console.log('\nОтправляем значение 5...');
    subject.next(5);
}

console.log('\n\n=== TEST 2: Subject + multicast + filter ===');
{
    const subject = new ObservableFnsSubject<number>();
    const multicasted = multicast(subject);
    const filtered = multicasted.filter(v => {
        console.log(`Filter called with ${v}`);
        return v % 2 === 0;
    });

    console.log('Добавляем 3 подписчика к filtered...');
    filtered.subscribe(v => console.log(`Subscriber 1: ${v}`));
    filtered.subscribe(v => console.log(`Subscriber 2: ${v}`));
    filtered.subscribe(v => console.log(`Subscriber 3: ${v}`));

    console.log('\nОтправляем значение 4...');
    subject.next(4);
    console.log('\nОтправляем значение 5...');
    subject.next(5);
}

console.log('\n\n=== TEST 3: multicast применен ПОСЛЕ filter ===');
{
    const subject = new ObservableFnsSubject<number>();
    const filtered = subject.filter(v => {
        console.log(`Filter called with ${v}`);
        return v % 2 === 0;
    });
    const multicasted = multicast(filtered);

    console.log('Добавляем 3 подписчика к multicasted...');
    multicasted.subscribe(v => console.log(`Subscriber 1: ${v}`));
    multicasted.subscribe(v => console.log(`Subscriber 2: ${v}`));
    multicasted.subscribe(v => console.log(`Subscriber 3: ${v}`));

    console.log('\nОтправляем значение 4...');
    subject.next(4);
    console.log('\nОтправляем значение 5...');
    subject.next(5);
}
