import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class TakeUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
    }

    @test 'take(3) receives exactly 3 values then unsubscribes'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .take(3)
            .subscribe((v: string) => received.push(v));

        expect(this.OBSERVABLE$.size()).to.be.equal(1);

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");
        this.OBSERVABLE$.next("d");
        this.OBSERVABLE$.next("e");

        expect(received).to.deep.equal(["a", "b", "c"]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'take(1) behaves like once()'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .take(1)
            .subscribe((v: string) => received.push(v));

        expect(this.OBSERVABLE$.size()).to.be.equal(1);

        this.OBSERVABLE$.next("first");
        this.OBSERVABLE$.next("second");
        this.OBSERVABLE$.next("third");

        expect(received).to.deep.equal(["first"]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'take(0) receives no values and unsubscribes immediately'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .take(0)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");

        expect(received).to.deep.equal([]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'take with and() filter — only filtered values count'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .and((v: string) => v.length > 2)
            .take(2)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("no");
        this.OBSERVABLE$.next("world");
        this.OBSERVABLE$.next("extra");

        expect(received).to.deep.equal(["hello", "world"]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'take with map() transform'() {
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .map<number>((v: string) => v.length)
            .take(2)
            .subscribe((v: number) => received.push(v));

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("world");

        expect(received).to.deep.equal([2, 5]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'take does not affect other subscribers'() {
        const takeReceived: string[] = [];
        const regularReceived: string[] = [];

        this.OBSERVABLE$.pipe()
            .take(2)
            .subscribe((v: string) => takeReceived.push(v));

        this.OBSERVABLE$.subscribe((v: string) => regularReceived.push(v));

        expect(this.OBSERVABLE$.size()).to.be.equal(2);

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");
        this.OBSERVABLE$.next("d");

        expect(takeReceived).to.deep.equal(["a", "b"]);
        expect(regularReceived).to.deep.equal(["a", "b", "c", "d"]);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'take with Observable-to-Observable subscription'() {
        const source$ = new Observable<string>("");
        const target$ = new Observable<string>("");
        const received: string[] = [];

        target$.pipe()
            .take(2)
            .subscribe((v: string) => received.push(v));

        source$.subscribe(target$);

        source$.next("a");
        source$.next("b");
        source$.next("c");

        expect(received).to.deep.equal(["a", "b"]);
        expect(target$.size()).to.be.equal(0);
    }

    @test 'take(5) with fewer emissions — receives all available'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .take(5)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");

        expect(received).to.deep.equal(["a", "b"]);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'take with and() + map() chain'() {
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .and((v: string) => v.includes("o"))
            .map<number>((v: string) => v.length)
            .take(2)
            .subscribe((v: number) => received.push(v));

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("no");
        this.OBSERVABLE$.next("world");
        this.OBSERVABLE$.next("foo");

        expect(received).to.deep.equal([5, 2]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'multiple take pipes on same observable are independent'() {
        const received1: string[] = [];
        const received2: string[] = [];

        this.OBSERVABLE$.pipe()
            .take(1)
            .subscribe((v: string) => received1.push(v));

        this.OBSERVABLE$.pipe()
            .take(3)
            .subscribe((v: string) => received2.push(v));

        expect(this.OBSERVABLE$.size()).to.be.equal(2);

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");
        this.OBSERVABLE$.next("d");

        expect(received1).to.deep.equal(["a"]);
        expect(received2).to.deep.equal(["a", "b", "c"]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'take with error handler — no errors on normal flow'() {
        let errorCounter = 0;
        const errorHandler = () => { errorCounter++; };
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .take(2)
            .subscribe((v: string) => received.push(v), errorHandler);

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");

        expect(received).to.deep.equal(["a", "b"]);
        expect(errorCounter).to.be.equal(0);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }
}
