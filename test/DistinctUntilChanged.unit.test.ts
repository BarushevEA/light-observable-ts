import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class DistinctUntilChangedUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
    }

    @test 'basic distinct: duplicate strings are suppressed'() {
        const results: string[] = [];
        const sub = this.OBSERVABLE$
            .pipe()
            .distinctUntilChanged()
            .subscribe((value: string) => results.push(value));

        this.OBSERVABLE$.next('a');
        this.OBSERVABLE$.next('a');
        this.OBSERVABLE$.next('b');
        this.OBSERVABLE$.next('b');
        this.OBSERVABLE$.next('a');

        expect(results).to.deep.equal(['a', 'b', 'a']);
        sub.unsubscribe();
    }

    @test 'basic distinct: duplicate numbers are suppressed'() {
        const obs$ = new Observable<number>(0);
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .distinctUntilChanged()
            .subscribe((value: number) => results.push(value));

        obs$.next(1);
        obs$.next(1);
        obs$.next(2);
        obs$.next(3);
        obs$.next(3);
        obs$.next(3);
        obs$.next(1);

        expect(results).to.deep.equal([1, 2, 3, 1]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'first value always passes through'() {
        const results: string[] = [];
        const sub = this.OBSERVABLE$
            .pipe()
            .distinctUntilChanged()
            .subscribe((value: string) => results.push(value));

        this.OBSERVABLE$.next('hello');

        expect(results).to.deep.equal(['hello']);
        sub.unsubscribe();
    }

    @test 'custom comparator: objects compared by field'() {
        const obs$ = new Observable<{ id: number; name: string }>({id: 0, name: ''});
        const results: { id: number; name: string }[] = [];
        const sub = obs$
            .pipe()
            .distinctUntilChanged((prev, curr) => prev.id === curr.id)
            .subscribe((value: { id: number; name: string }) => results.push(value));

        obs$.next({id: 1, name: 'Alice'});
        obs$.next({id: 1, name: 'Alice Updated'});
        obs$.next({id: 2, name: 'Bob'});
        obs$.next({id: 2, name: 'Bob Updated'});
        obs$.next({id: 1, name: 'Alice Again'});

        expect(results.length).to.be.equal(3);
        expect(results[0].name).to.be.equal('Alice');
        expect(results[1].name).to.be.equal('Bob');
        expect(results[2].name).to.be.equal('Alice Again');
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'objects without comparator: different references pass through'() {
        const obs$ = new Observable<{ x: number }>({x: 0});
        const results: { x: number }[] = [];
        const sub = obs$
            .pipe()
            .distinctUntilChanged()
            .subscribe((value: { x: number }) => results.push(value));

        obs$.next({x: 1});
        obs$.next({x: 1}); // different reference, same content — passes with ===
        obs$.next({x: 1});

        expect(results.length).to.be.equal(3); // all pass because === compares references
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'chain with .and() filter'() {
        const obs$ = new Observable<number>(0);
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .and((v: number) => v > 0)
            .distinctUntilChanged()
            .subscribe((value: number) => results.push(value));

        obs$.next(-1); // filtered by .and()
        obs$.next(1);
        obs$.next(1);  // suppressed by distinct
        obs$.next(2);
        obs$.next(-5); // filtered by .and()
        obs$.next(2);  // suppressed by distinct (last passed was 2)
        obs$.next(3);

        expect(results).to.deep.equal([1, 2, 3]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'chain with .map() transform'() {
        const results: number[] = [];
        const sub = this.OBSERVABLE$
            .pipe()
            .map<number>((s: string) => s.length)
            .distinctUntilChanged()
            .subscribe((value: number) => results.push(value));

        this.OBSERVABLE$.next('hi');    // length 2
        this.OBSERVABLE$.next('ok');    // length 2 — suppressed
        this.OBSERVABLE$.next('hey');   // length 3
        this.OBSERVABLE$.next('bye');   // length 3 — suppressed
        this.OBSERVABLE$.next('hello'); // length 5

        expect(results).to.deep.equal([2, 3, 5]);
        sub.unsubscribe();
    }

    @test 'chain with .choice().or()'() {
        const obs$ = new Observable<number>(0);
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .distinctUntilChanged()
            .choice()
            .or((v: number) => v > 10)
            .or((v: number) => v < -10)
            .subscribe((value: number) => results.push(value));

        obs$.next(15);  // distinct: pass, or: >10 pass
        obs$.next(15);  // distinct: suppressed
        obs$.next(-20); // distinct: pass, or: <-10 pass
        obs$.next(5);   // distinct: pass, or: neither — blocked
        obs$.next(20);  // distinct: pass, or: >10 pass

        expect(results).to.deep.equal([15, -20, 20]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'after destroy observable, subscription is cleaned up'() {
        const results: string[] = [];
        const sub = this.OBSERVABLE$
            .pipe()
            .distinctUntilChanged()
            .subscribe((value: string) => results.push(value));

        this.OBSERVABLE$.next('a');
        this.OBSERVABLE$.destroy();
        this.OBSERVABLE$.next('b');

        expect(results).to.deep.equal(['a']);
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
    }

    @test 'distinctUntilChanged before .and()'() {
        const obs$ = new Observable<number>(0);
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .distinctUntilChanged()
            .and((v: number) => v % 2 === 0)
            .subscribe((value: number) => results.push(value));

        obs$.next(2);
        obs$.next(2); // suppressed by distinct
        obs$.next(3); // passes distinct, blocked by .and() (odd)
        obs$.next(4); // passes both
        obs$.next(4); // suppressed by distinct

        expect(results).to.deep.equal([2, 4]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'throttle(0) then distinctUntilChanged suppresses duplicates'() {
        const obs$ = new Observable<number>(0);
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .throttle(0)
            .distinctUntilChanged()
            .subscribe((value: number) => results.push(value));

        obs$.next(1);
        obs$.next(1);
        obs$.next(2);
        obs$.next(2);
        obs$.next(3);

        expect(results).to.deep.equal([1, 2, 3]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'distinctUntilChanged then throttle(0) passes unique values'() {
        const obs$ = new Observable<number>(0);
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .distinctUntilChanged()
            .throttle(0)
            .subscribe((value: number) => results.push(value));

        obs$.next(1);
        obs$.next(1);
        obs$.next(2);
        obs$.next(3);
        obs$.next(3);

        expect(results).to.deep.equal([1, 2, 3]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'debounce(0) then distinctUntilChanged suppresses duplicates'() {
        const obs$ = new Observable<number>(0);
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .debounce(0)
            .distinctUntilChanged()
            .subscribe((value: number) => results.push(value));

        obs$.next(1);
        obs$.next(1);
        obs$.next(2);
        obs$.next(2);

        expect(results).to.deep.equal([1, 2]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'distinctUntilChanged then debounce(0) passes unique values'() {
        const obs$ = new Observable<number>(0);
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .distinctUntilChanged()
            .debounce(0)
            .subscribe((value: number) => results.push(value));

        obs$.next(1);
        obs$.next(1);
        obs$.next(2);
        obs$.next(3);
        obs$.next(3);

        expect(results).to.deep.equal([1, 2, 3]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'debounce then distinctUntilChanged with async delay'(done: Function) {
        const obs$ = new Observable<string>('');
        const results: string[] = [];
        const sub = obs$
            .pipe()
            .debounce(30)
            .distinctUntilChanged()
            .subscribe((value: string) => results.push(value));

        obs$.next('a');
        obs$.next('a'); // debounce resets, still 'a'

        setTimeout(() => {
            // debounce fires 'a', distinct passes (first value)
            expect(results).to.deep.equal(['a']);

            obs$.next('a'); // debounce starts for 'a' again
        }, 40);

        setTimeout(() => {
            // debounce fires 'a', distinct suppresses (same as previous)
            expect(results).to.deep.equal(['a']);

            obs$.next('b'); // debounce starts for 'b'
        }, 80);

        setTimeout(() => {
            // debounce fires 'b', distinct passes (different)
            expect(results).to.deep.equal(['a', 'b']);
            sub.unsubscribe();
            obs$.destroy();
            done();
        }, 120);
    }

    @test 'multiple distinctUntilChanged in chain with map between'() {
        const results: number[] = [];
        const sub = this.OBSERVABLE$
            .pipe()
            .distinctUntilChanged()
            .map<number>((s: string) => s.length)
            .distinctUntilChanged()
            .subscribe((value: number) => results.push(value));

        this.OBSERVABLE$.next('hi');    // distinct1: pass, map→2, distinct2: pass
        this.OBSERVABLE$.next('hi');    // distinct1: suppressed
        this.OBSERVABLE$.next('ok');    // distinct1: pass, map→2, distinct2: suppressed (still 2)
        this.OBSERVABLE$.next('hey');   // distinct1: pass, map→3, distinct2: pass
        this.OBSERVABLE$.next('bye');   // distinct1: pass, map→3, distinct2: suppressed (still 3)
        this.OBSERVABLE$.next('hello'); // distinct1: pass, map→5, distinct2: pass

        expect(results).to.deep.equal([2, 3, 5]);
        sub.unsubscribe();
    }

    @test 'independent state per subscriber'() {
        const obs$ = new Observable<number>(0);
        const results1: number[] = [];
        const results2: number[] = [];

        const sub1 = obs$
            .pipe()
            .distinctUntilChanged()
            .subscribe((value: number) => results1.push(value));

        const sub2 = obs$
            .pipe()
            .distinctUntilChanged()
            .subscribe((value: number) => results2.push(value));

        obs$.next(1);
        obs$.next(1);
        obs$.next(2);

        expect(results1).to.deep.equal([1, 2]);
        expect(results2).to.deep.equal([1, 2]);

        sub1.unsubscribe();

        obs$.next(3);
        obs$.next(3);

        expect(results1).to.deep.equal([1, 2]); // unsubscribed — no change
        expect(results2).to.deep.equal([1, 2, 3]);
        sub2.unsubscribe();
        obs$.destroy();
    }

    @test 'distinctUntilChanged with tap side-effect'() {
        const obs$ = new Observable<number>(0);
        const tapped: number[] = [];
        const results: number[] = [];
        const sub = obs$
            .pipe()
            .distinctUntilChanged()
            .tap((v: number) => tapped.push(v))
            .subscribe((value: number) => results.push(value));

        obs$.next(1);
        obs$.next(1); // suppressed — tap not called
        obs$.next(2);
        obs$.next(2); // suppressed — tap not called
        obs$.next(3);

        expect(tapped).to.deep.equal([1, 2, 3]);
        expect(results).to.deep.equal([1, 2, 3]);
        sub.unsubscribe();
        obs$.destroy();
    }
}
