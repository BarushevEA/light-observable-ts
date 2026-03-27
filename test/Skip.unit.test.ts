import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";
import {OrderedObservable} from "../src/Libraries/Observables/OrderedObservable";

_chai.should();
_chai.expect;

@suite
class SkipUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
    }

    @test 'skip(3) ignores first 3 values then delivers the rest'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .skip(3)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");
        this.OBSERVABLE$.next("d");
        this.OBSERVABLE$.next("e");

        expect(received).to.deep.equal(["d", "e"]);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'skip(0) delivers all values'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .skip(0)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");

        expect(received).to.deep.equal(["a", "b", "c"]);
    }

    @test 'skip(-1) behaves like skip(0) — all values delivered'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .skip(-1)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");

        expect(received).to.deep.equal(["a", "b"]);
    }

    @test 'skip with and() filter after skip'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .skip(2)
            .and((v: string) => v.length > 2)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("bb");
        this.OBSERVABLE$.next("cc");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("no");
        this.OBSERVABLE$.next("world");

        expect(received).to.deep.equal(["hello", "world"]);
    }

    @test 'skip with map() transform after skip'() {
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .skip(2)
            .map<number>((v: string) => v.length)
            .subscribe((v: number) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("bb");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("world");

        expect(received).to.deep.equal([5, 5]);
    }

    @test 'skip + take combination — skip N then take M'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .skip(2)
            .take(2)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");
        this.OBSERVABLE$.next("d");
        this.OBSERVABLE$.next("e");
        this.OBSERVABLE$.next("f");

        expect(received).to.deep.equal(["c", "d"]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'skip with Observable-to-Observable subscription'() {
        const source$ = new Observable<string>("");
        const target$ = new Observable<string>("");
        const received: string[] = [];

        target$.pipe()
            .skip(2)
            .subscribe((v: string) => received.push(v));

        source$.subscribe(target$);

        source$.next("a");
        source$.next("b");
        source$.next("c");
        source$.next("d");

        expect(received).to.deep.equal(["c", "d"]);
    }

    @test 'skip does not affect other subscribers'() {
        const skipReceived: string[] = [];
        const regularReceived: string[] = [];

        this.OBSERVABLE$.pipe()
            .skip(2)
            .subscribe((v: string) => skipReceived.push(v));

        this.OBSERVABLE$.subscribe((v: string) => regularReceived.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");
        this.OBSERVABLE$.next("d");

        expect(skipReceived).to.deep.equal(["c", "d"]);
        expect(regularReceived).to.deep.equal(["a", "b", "c", "d"]);
    }

    @test 'skip works with OrderedObservable'() {
        const ordered$ = new OrderedObservable<string>("");
        const received: string[] = [];

        ordered$.pipe()
            .skip(2)
            .subscribe((v: string) => received.push(v));

        ordered$.next("a");
        ordered$.next("b");
        ordered$.next("c");
        ordered$.next("d");

        expect(received).to.deep.equal(["c", "d"]);
    }

    @test 'skip(n) where n > total emissions — nothing delivered'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .skip(10)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");

        expect(received).to.deep.equal([]);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'skip with error handler — no errors on normal flow'() {
        let errorCounter = 0;
        const errorHandler = () => { errorCounter++; };
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .skip(1)
            .subscribe((v: string) => received.push(v), errorHandler);

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");

        expect(received).to.deep.equal(["b", "c"]);
        expect(errorCounter).to.be.equal(0);
    }
}
