import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {QuickObservable} from "../src/Libraries/Observables/QuickObservable";
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

/**
 * Тесты QuickObservable — полная совместимость с Observable API
 */
@suite
class QuickObservableUnitTest {
    private OBSERVABLE$: QuickObservable<string>;

    before() {
        this.OBSERVABLE$ = new QuickObservable('');
    }

    // =========================================================================
    // BASIC TESTS
    // =========================================================================

    @test 'QuickObservable is created'() {
        expect(this.OBSERVABLE$.getValue()).to.be.equal('');
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one subscriber'() {
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => {});
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        subscribeObject.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'unsubscribe one by subject'() {
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => {});
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        subscribeObject.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'unsubscribe one by subject twice'() {
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => {});
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        subscribeObject.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        subscribeObject.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'unsubscribe all'() {
        const subs1 = this.OBSERVABLE$.subscribe((value: string) => {});
        this.OBSERVABLE$.subscribe((value: string) => {});
        this.OBSERVABLE$.subscribe((value: string) => {});
        this.OBSERVABLE$.subscribe((value: string) => {});
        expect(4).to.be.equal(this.OBSERVABLE$.size());
        this.OBSERVABLE$.unsubscribeAll();
        expect(0).to.be.equal(this.OBSERVABLE$.size());

        subs1.unsubscribe();
        expect(0).to.be.equal(this.OBSERVABLE$.size());

        let received = '';
        this.OBSERVABLE$.subscribe((value: string) => {
            received = value;
        });
        expect(1).to.be.equal(this.OBSERVABLE$.size());
        this.OBSERVABLE$.next("test");
        expect("test").to.be.equal(received);
    }

    // =========================================================================
    // EMIT TESTS
    // =========================================================================

    @test 'Add one subscriber and listen one event'() {
        const str = '1';
        let received = '';
        this.OBSERVABLE$.subscribe((value: string) => {
            received = value;
        });
        this.OBSERVABLE$.next(str);
        expect(received).to.be.equal(str);
    }

    @test 'Add one subscriber and listen ten events'() {
        const str = '0123456789';
        let counter = 0;
        let lastReceived = '';
        this.OBSERVABLE$.subscribe((value: string) => {
            lastReceived = value;
        });
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
            expect(lastReceived).to.be.equal(str[counter]);
        }
    }

    @test 'Add one subscriber and get value after changes'() {
        const str = '0123456789';
        this.OBSERVABLE$.subscribe((value: string) => {});
        for (let counter = 0; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        expect(this.OBSERVABLE$.getValue()).to.be.equal('9');
    }

    // =========================================================================
    // PIPE TESTS (inherited from Observable)
    // =========================================================================

    @test 'Add one by pipe and "once"'() {
        const str = '0123456789';
        let received = '';
        this.OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe((value: string) => {
                received = value;
            });

        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        expect(received).to.be.equal(str);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one by pipe and "emitByPositive"'() {
        let counter = 0;
        this.OBSERVABLE$
            .pipe()
            .refine((value: string) => value === 'PASS')
            .subscribe((value: string) => {
                counter++;
            });

        this.OBSERVABLE$.next('FAIL');
        expect(counter).to.be.equal(0);
        this.OBSERVABLE$.next('PASS');
        expect(counter).to.be.equal(1);
        this.OBSERVABLE$.next('FAIL');
        expect(counter).to.be.equal(1);
        this.OBSERVABLE$.next('PASS');
        expect(counter).to.be.equal(2);
    }

    @test 'pipe chain refine + then'() {
        let received: number = 0;
        this.OBSERVABLE$
            .pipe()
            .refine((value: string) => value.includes('2'))
            .then<number>((value: string) => value.length)
            .subscribe((value: number) => {
                received = value;
            });

        this.OBSERVABLE$.next('12345');
        expect(received).to.be.equal(5);
        this.OBSERVABLE$.next('abc');
        expect(received).to.be.equal(5); // not changed, filtered out
        this.OBSERVABLE$.next('2');
        expect(received).to.be.equal(1);
    }

    @test 'pipe chain switch/case'() {
        let manCount = 0;
        let womanCount = 0;

        interface Person {
            name: string;
            gender: string;
        }

        const obs$ = new QuickObservable<Person>({name: '', gender: ''});

        obs$.pipe()
            .switch()
            .case((p: Person) => p.gender === 'MAN')
            .case((p: Person) => p.gender === 'WOMAN')
            .subscribe((p: Person) => {
                if (p.gender === 'MAN') manCount++;
                if (p.gender === 'WOMAN') womanCount++;
            });

        obs$.next({name: 'John', gender: 'MAN'});
        obs$.next({name: 'Jane', gender: 'WOMAN'});
        obs$.next({name: 'Robot', gender: 'NONE'});
        obs$.next({name: 'Bob', gender: 'MAN'});

        expect(manCount).to.be.equal(2);
        expect(womanCount).to.be.equal(1);
    }

    // =========================================================================
    // FILTER TESTS (inherited from Observable)
    // =========================================================================

    @test '1 filter test'() {
        let counter = 0;
        this.OBSERVABLE$.addFilter().filter((value: string) => value !== 'BLOCKED');
        this.OBSERVABLE$.subscribe((value: string) => {
            counter++;
        });

        this.OBSERVABLE$.next('OK');
        expect(counter).to.be.equal(1);
        this.OBSERVABLE$.next('BLOCKED');
        expect(counter).to.be.equal(1); // not incremented
        this.OBSERVABLE$.next('OK2');
        expect(counter).to.be.equal(2);
    }

    @test '2 filters test'() {
        let counter = 0;
        this.OBSERVABLE$.addFilter()
            .filter((value: string) => value.length > 2)
            .filter((value: string) => value.includes('X'));

        this.OBSERVABLE$.subscribe((value: string) => {
            counter++;
        });

        this.OBSERVABLE$.next('X'); // length <= 2
        expect(counter).to.be.equal(0);
        this.OBSERVABLE$.next('ABC'); // no X
        expect(counter).to.be.equal(0);
        this.OBSERVABLE$.next('ABCX'); // both pass
        expect(counter).to.be.equal(1);
    }

    @test 'filter switch-case'() {
        let counter = 0;
        this.OBSERVABLE$.addFilter()
            .switch()
            .case((value: string) => value === 'A')
            .case((value: string) => value === 'B');

        this.OBSERVABLE$.subscribe((value: string) => {
            counter++;
        });

        this.OBSERVABLE$.next('A');
        expect(counter).to.be.equal(1);
        this.OBSERVABLE$.next('B');
        expect(counter).to.be.equal(2);
        this.OBSERVABLE$.next('C'); // filtered out
        expect(counter).to.be.equal(2);
    }

    // =========================================================================
    // OBSERVABLE-TO-OBSERVABLE SUBSCRIPTION
    // =========================================================================

    @test 'subscribe observable'() {
        const source$ = new QuickObservable<string>('');
        const target$ = new QuickObservable<string>('');

        let received = '';
        target$.subscribe((value: string) => {
            received = value;
        });

        source$.subscribe(target$);
        source$.next('hello');

        expect(received).to.be.equal('hello');
    }

    @test 'subscribe observable with pipe'() {
        const source$ = new QuickObservable<string>('');
        const target$ = new QuickObservable<string>('');

        let received = '';
        target$.subscribe((value: string) => {
            received = value;
        });

        source$.pipe()
            .refine((v: string) => v.length > 2)
            .subscribe(target$);

        source$.next('AB'); // filtered
        expect(received).to.be.equal('');

        source$.next('ABCD');
        expect(received).to.be.equal('ABCD');
    }

    // =========================================================================
    // ENABLE/DISABLE
    // =========================================================================

    @test 'observable disable/enable'() {
        let counter = 0;
        this.OBSERVABLE$.subscribe((value: string) => {
            counter++;
        });

        this.OBSERVABLE$.next('1');
        expect(counter).to.be.equal(1);

        this.OBSERVABLE$.disable();
        expect(this.OBSERVABLE$.isEnable).to.be.equal(false);

        this.OBSERVABLE$.next('2');
        expect(counter).to.be.equal(1); // not changed

        this.OBSERVABLE$.enable();
        expect(this.OBSERVABLE$.isEnable).to.be.equal(true);

        this.OBSERVABLE$.next('3');
        expect(counter).to.be.equal(2);
    }

    // =========================================================================
    // DESTROY
    // =========================================================================

    @test 'observable destroy'() {
        this.OBSERVABLE$.subscribe((value: string) => {});
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(false);

        this.OBSERVABLE$.destroy();

        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(this.OBSERVABLE$.getValue()).to.be.equal(undefined);
    }

    @test 'destroy and try to use'() {
        this.OBSERVABLE$.destroy();

        // All operations should be no-ops after destroy
        const sub = this.OBSERVABLE$.subscribe((value: string) => {});
        expect(sub).to.be.equal(undefined);

        this.OBSERVABLE$.next('test');
        expect(this.OBSERVABLE$.getValue()).to.be.equal(undefined);
    }

    // =========================================================================
    // STREAM
    // =========================================================================

    @test 'stream array by 10 elements'() {
        const values: string[] = [];
        this.OBSERVABLE$.subscribe((value: string) => {
            values.push(value);
        });

        this.OBSERVABLE$.stream(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

        expect(values).to.be.eql(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
        expect(this.OBSERVABLE$.getValue()).to.be.equal('9');
    }

    // =========================================================================
    // ARRAY SUBSCRIPTION (uses parent Observable mechanism)
    // =========================================================================

    @test 'subscribe array of listeners'() {
        let counter1 = 0;
        let counter2 = 0;

        const sub = this.OBSERVABLE$.subscribe([
            (value: string) => { counter1++; },
            (value: string) => { counter2++; }
        ]);

        this.OBSERVABLE$.next('test');

        expect(counter1).to.be.equal(1);
        expect(counter2).to.be.equal(1);

        sub.unsubscribe();
    }

    // =========================================================================
    // ERROR HANDLING
    // =========================================================================

    @test 'error handler in batch subscriber'() {
        let errorCaught = false;

        this.OBSERVABLE$.subscribe(
            (value: string) => {
                throw new Error('Test error');
            },
            (errorData: any, errorMessage: any) => {
                errorCaught = true;
            }
        );

        this.OBSERVABLE$.next('test');

        expect(errorCaught).to.be.equal(true);
    }

    // =========================================================================
    // UNSUBSCRIBE DURING NEXT
    // =========================================================================

    @test 'unsubscribe during next (deferred)'() {
        let sub1Called = 0;
        let sub2Called = 0;

        let sub1: any;
        sub1 = this.OBSERVABLE$.subscribe((value: string) => {
            sub1Called++;
            sub1.unsubscribe(); // unsubscribe during emission
        });

        this.OBSERVABLE$.subscribe((value: string) => {
            sub2Called++;
        });

        this.OBSERVABLE$.next('first');

        expect(sub1Called).to.be.equal(1);
        expect(sub2Called).to.be.equal(1);
        expect(this.OBSERVABLE$.size()).to.be.equal(1); // sub1 was removed

        this.OBSERVABLE$.next('second');

        expect(sub1Called).to.be.equal(1); // not called again
        expect(sub2Called).to.be.equal(2);
    }

    // =========================================================================
    // MANY SUBSCRIBERS (batch optimization)
    // =========================================================================

    @test 'many subscribers (100)'() {
        const values: number[] = [];

        for (let i = 0; i < 100; i++) {
            const idx = i;
            this.OBSERVABLE$.subscribe((value: string) => {
                values.push(idx);
            });
        }

        expect(this.OBSERVABLE$.size()).to.be.equal(100);

        this.OBSERVABLE$.next('test');

        expect(values.length).to.be.equal(100);
        for (let i = 0; i < 100; i++) {
            expect(values[i]).to.be.equal(i);
        }
    }

    @test 'many subscribers with unsubscribe'() {
        const subs: any[] = [];

        for (let i = 0; i < 50; i++) {
            subs.push(this.OBSERVABLE$.subscribe((value: string) => {}));
        }

        expect(this.OBSERVABLE$.size()).to.be.equal(50);

        // Unsubscribe every other one
        for (let i = 0; i < 50; i += 2) {
            subs[i].unsubscribe();
        }

        expect(this.OBSERVABLE$.size()).to.be.equal(25);

        // Emit and verify
        let counter = 0;
        // Add new subscriber to count
        const countSub = this.OBSERVABLE$.subscribe((value: string) => {
            counter++;
        });

        this.OBSERVABLE$.next('test');

        expect(counter).to.be.equal(1);
        countSub.unsubscribe();
    }

    // =========================================================================
    // MIXED BATCH + PIPE SUBSCRIBERS
    // =========================================================================

    @test 'mixed batch and pipe subscribers'() {
        let batchCounter = 0;
        let pipeCounter = 0;

        // Batch subscriber (simple function)
        this.OBSERVABLE$.subscribe((value: string) => {
            batchCounter++;
        });

        // Pipe subscriber
        this.OBSERVABLE$.pipe()
            .refine((v: string) => v.length > 2)
            .subscribe((value: string) => {
                pipeCounter++;
            });

        this.OBSERVABLE$.next('AB'); // short - batch only
        expect(batchCounter).to.be.equal(1);
        expect(pipeCounter).to.be.equal(0);

        this.OBSERVABLE$.next('ABCD'); // long - both
        expect(batchCounter).to.be.equal(2);
        expect(pipeCounter).to.be.equal(1);
    }

    // =========================================================================
    // SERIALIZE/DESERIALIZE
    // =========================================================================

    @test 'pipe serialize'() {
        const obs$ = new QuickObservable<{name: string}>({name: ''});
        let received = '';

        obs$.pipe()
            .serialize()
            .subscribe((value: string) => {
                received = value;
            });

        obs$.next({name: 'John'});

        expect(received).to.be.equal('{"name":"John"}');
    }

    @test 'pipe deserialize'() {
        const obs$ = new QuickObservable<string>('');
        let received: any = null;

        obs$.pipe()
            .deserialize<{name: string}>()
            .subscribe((value: {name: string}) => {
                received = value;
            });

        obs$.next('{"name":"Jane"}');

        expect(received).to.be.eql({name: 'Jane'});
    }

    // =========================================================================
    // EDGE CASES
    // =========================================================================

    @test 'unsubscribeAll during emission (deferred cleanup)'() {
        const obs$ = new QuickObservable<number>(0);
        let callCount = 0;

        obs$.subscribe((value: number) => {
            callCount++;
            if (value === 1) {
                obs$.unsubscribeAll(); // unsubscribeAll during emission
            }
        });
        obs$.subscribe((value: number) => {
            callCount++;
        });
        obs$.subscribe((value: number) => {
            callCount++;
        });

        expect(obs$.size()).to.be.equal(3);

        obs$.next(1); // triggers unsubscribeAll during emission

        // All 3 subscribers should have been called
        expect(callCount).to.be.equal(3);
        // After emission, all should be unsubscribed
        expect(obs$.size()).to.be.equal(0);

        obs$.next(2);
        // No more calls
        expect(callCount).to.be.equal(3);
    }

    @test 'destroy during emission (async cleanup)'() {
        const obs$ = new QuickObservable<number>(0);
        let callCount = 0;

        obs$.subscribe((value: number) => {
            callCount++;
            if (value === 1) {
                obs$.destroy(); // destroy during emission
            }
        });
        obs$.subscribe((value: number) => {
            callCount++;
        });

        expect(obs$.size()).to.be.equal(2);
        expect(obs$.isDestroyed).to.be.equal(false);

        obs$.next(1);

        expect(callCount).to.be.equal(2);
        expect(obs$.isDestroyed).to.be.equal(true);

        // Wait for Promise.resolve().then() to complete
        return new Promise<void>(resolve => {
            setTimeout(() => {
                expect(obs$.size()).to.be.equal(0);
                resolve();
            }, 0);
        });
    }

    @test 'full batch (20 subscribers) emit20 path'() {
        const obs$ = new QuickObservable<number>(0);
        let callCount = 0;

        // Subscribe exactly 20 to trigger emit20 path
        for (let i = 0; i < 20; i++) {
            obs$.subscribe((value: number) => {
                callCount++;
            });
        }

        expect(obs$.size()).to.be.equal(20);

        obs$.next(42);

        expect(callCount).to.be.equal(20);
    }

    @test 'partial batch after unsubscribes (compaction)'() {
        const obs$ = new QuickObservable<number>(0);
        const subs: any[] = [];
        let callCount = 0;

        // Subscribe 20, then unsubscribe half
        for (let i = 0; i < 20; i++) {
            subs.push(obs$.subscribe((value: number) => {
                callCount++;
            }));
        }

        // Unsubscribe odd indexes
        for (let i = 1; i < 20; i += 2) {
            subs[i].unsubscribe();
        }

        expect(obs$.size()).to.be.equal(10);

        obs$.next(42);

        expect(callCount).to.be.equal(10);
    }

    @test 'subscribe after destroy returns undefined'() {
        const obs$ = new QuickObservable<number>(0);
        obs$.destroy();

        const sub = obs$.subscribe((value: number) => {});
        expect(sub).to.be.equal(undefined);
    }

    @test 'next after destroy does nothing'() {
        const obs$ = new QuickObservable<number>(0);
        let callCount = 0;

        obs$.subscribe((value: number) => {
            callCount++;
        });

        obs$.destroy();
        obs$.next(42);

        expect(callCount).to.be.equal(0);
    }

    @test 'disabled observable does not emit'() {
        const obs$ = new QuickObservable<number>(0);
        let callCount = 0;

        obs$.subscribe((value: number) => {
            callCount++;
        });

        obs$.disable();
        obs$.next(42);

        expect(callCount).to.be.equal(0);

        obs$.enable();
        obs$.next(42);

        expect(callCount).to.be.equal(1);
    }

    @test 'multiple batches (25 subscribers)'() {
        const obs$ = new QuickObservable<number>(0);
        let callCount = 0;

        for (let i = 0; i < 25; i++) {
            obs$.subscribe((value: number) => {
                callCount++;
            });
        }

        expect(obs$.size()).to.be.equal(25);

        obs$.next(42);

        expect(callCount).to.be.equal(25);
    }

    @test 'error in subscriber does not break emission'() {
        const obs$ = new QuickObservable<number>(0);
        let callCount = 0;
        let errorCaught = false;

        obs$.subscribe(
            (value: number) => {
                throw new Error('Test error');
            },
            (err: any, msg: string) => {
                errorCaught = true;
            }
        );

        obs$.subscribe((value: number) => {
            callCount++;
        });

        obs$.next(42);

        expect(errorCaught).to.be.equal(true);
        expect(callCount).to.be.equal(1); // second subscriber still called
    }

    // =========================================================================
    // ADVANCED USAGE (README example)
    // =========================================================================

    @test 'advanced usage: filters, pipes, switch/case, observable-to-observable'() {
        // Constants
        const HAIR = { BLOND: "BLOND", BLACK: "BLACK", BROWN: "BROWN" };
        const GENDER = { MAN: "MAN", WOMAN: "WOMAN" };
        const MAJOR = { DOCTOR: "DOCTOR", DRIVER: "DRIVER", CHILD: "CHILD" };

        // Person class
        class Person {
            constructor(
                public name: string,
                public age: number,
                public gender: string,
                public major: string,
                public hairColor: string
            ) {}
        }

        // Create Observables
        const personal$ = new QuickObservable<Person | null>(null);
        const men$ = new QuickObservable<Person | null>(null);
        const women$ = new QuickObservable<Person | null>(null);

        // Define filters
        const youngAgeFilter = (person: Person | null) => person !== null && person.age > 17;
        const oldAgeFilter = (person: Person | null) => person !== null && person.age < 60;
        const menFilter = (person: Person | null) => person !== null && person.gender === GENDER.MAN;
        const womenFilter = (person: Person | null) => person !== null && person.gender === GENDER.WOMAN;
        const blondFilter = (person: Person | null) => person !== null && person.hairColor === HAIR.BLOND;
        const blackFilter = (person: Person | null) => person !== null && person.hairColor === HAIR.BLACK;

        const personValidationFilters = [
            (person: Person | null) => !!person,
            (person: Person | null) => person !== null && "name" in person,
            (person: Person | null) => person !== null && "age" in person,
            (person: Person | null) => person !== null && "gender" in person,
            (person: Person | null) => person !== null && "major" in person,
            (person: Person | null) => person !== null && "hairColor" in person,
        ];

        // Collect results
        const menReadyToWork: string[] = [];
        const womenReadyToWork: string[] = [];
        const blondAndBlackPeople: string[] = [];

        // Apply filters to men$ and women$
        men$.addFilter()
            .pushFilters(personValidationFilters)
            .filter(menFilter);

        women$.addFilter()
            .pushFilters(personValidationFilters)
            .filter(womenFilter);

        // Subscribe callbacks
        men$.pipe()
            .pushRefiners(personValidationFilters)
            .subscribe((worker: Person | null) => {
                if (worker) menReadyToWork.push(`${worker.name} ${worker.age} ${worker.major}`);
            });

        women$.pipe()
            .pushRefiners(personValidationFilters)
            .subscribe((worker: Person | null) => {
                if (worker) womenReadyToWork.push(`${worker.name} ${worker.age} ${worker.major}`);
            });

        // Stream by age filters to men$/women$
        personal$.pipe()
            .refine(youngAgeFilter)
            .refine(oldAgeFilter)
            .subscribe([men$, women$]);

        // Stream by hair color
        personal$.pipe()
            .switch()
            .case(blackFilter)
            .case(blondFilter)
            .subscribe((person: Person | null) => {
                if (person) blondAndBlackPeople.push(`${person.name} ${person.age} ${person.hairColor}`);
            });

        // Stream people
        personal$.stream([
            new Person('Alex', 35, GENDER.MAN, MAJOR.DOCTOR, HAIR.BLOND),
            new Person('John', 45, GENDER.MAN, MAJOR.DRIVER, HAIR.BLACK),
            new Person('Alice', 30, GENDER.WOMAN, MAJOR.DOCTOR, HAIR.BROWN),
            new Person('Sophia', 36, GENDER.WOMAN, MAJOR.DRIVER, HAIR.BLOND),
            new Person('Matthew', 15, GENDER.MAN, MAJOR.CHILD, HAIR.BROWN),
            new Person('Emily', 17, GENDER.WOMAN, MAJOR.CHILD, HAIR.BLACK),
            new Person('James', 40, GENDER.MAN, MAJOR.DOCTOR, HAIR.BLOND),
            new Person('Emma', 35, GENDER.WOMAN, MAJOR.DRIVER, HAIR.BROWN),
            new Person('Michael', 15, GENDER.MAN, MAJOR.CHILD, HAIR.BLACK),
            new Person('Olivia', 16, GENDER.WOMAN, MAJOR.CHILD, HAIR.BLOND)
        ]);

        // Verify men ready to work (age 18-59, gender MAN)
        expect(menReadyToWork).to.deep.equal([
            'Alex 35 DOCTOR',
            'John 45 DRIVER',
            'James 40 DOCTOR'
        ]);

        // Verify women ready to work (age 18-59, gender WOMAN)
        expect(womenReadyToWork).to.deep.equal([
            'Alice 30 DOCTOR',
            'Sophia 36 DRIVER',
            'Emma 35 DRIVER'
        ]);

        // Verify blond and black hair people (all ages)
        expect(blondAndBlackPeople).to.deep.equal([
            'Alex 35 BLOND',
            'John 45 BLACK',
            'Sophia 36 BLOND',
            'Emily 17 BLACK',
            'James 40 BLOND',
            'Michael 15 BLACK',
            'Olivia 16 BLOND'
        ]);
    }
}
