import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";
import {OrderedObservable} from "../src/Libraries/Observables/OrderedObservable";

_chai.should();
_chai.expect;

@suite
class ScanUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
    }

    @test 'scan accumulates string lengths into sum'() {
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .scan<number>((acc, val) => acc + val.length, 0)
            .subscribe((v: number) => received.push(v));

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("!");

        expect(received).to.deep.equal([2, 7, 8]);
    }

    @test 'scan concatenates strings'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .scan<string>((acc, val) => acc + val, "")
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");

        expect(received).to.deep.equal(["a", "ab", "abc"]);
    }

    @test 'scan counts emissions'() {
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .scan<number>((acc, _val) => acc + 1, 0)
            .subscribe((v: number) => received.push(v));

        this.OBSERVABLE$.next("x");
        this.OBSERVABLE$.next("y");
        this.OBSERVABLE$.next("z");

        expect(received).to.deep.equal([1, 2, 3]);
    }

    @test 'scan + and() filters accumulated values'() {
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .scan<number>((acc, val) => acc + val.length, 0)
            .and((v: number) => v > 3)
            .subscribe((v: number) => received.push(v));

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("!");

        // accumulator: 2, 7, 8 → filter > 3 → [7, 8]
        expect(received).to.deep.equal([7, 8]);
    }

    @test 'scan + map() double transform'() {
        const received: string[] = [];

        this.OBSERVABLE$.pipe()
            .scan<number>((acc, val) => acc + val.length, 0)
            .map<string>((v: number) => `total:${v}`)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");

        expect(received).to.deep.equal(["total:2", "total:7"]);
    }

    @test 'scan + skip() accumulates after skip'() {
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .skip(2)
            .scan<number>((acc, val) => acc + val.length, 0)
            .subscribe((v: number) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("bb");
        this.OBSERVABLE$.next("ccc");
        this.OBSERVABLE$.next("dddd");

        // skip 2 → "ccc", "dddd" → scan: 3, 7
        expect(received).to.deep.equal([3, 7]);
    }

    @test 'scan + take() accumulates then unsubscribes'() {
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .scan<number>((acc, val) => acc + val.length, 0)
            .take(2)
            .subscribe((v: number) => received.push(v));

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("world");

        expect(received).to.deep.equal([2, 7]);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'scan with Observable-to-Observable subscription'() {
        const source$ = new Observable<string>("");
        const target$ = new Observable<string>("");
        const received: number[] = [];

        target$.pipe()
            .scan<number>((acc, val) => acc + val.length, 0)
            .subscribe((v: number) => received.push(v));

        source$.subscribe(target$);

        source$.next("a");
        source$.next("bb");
        source$.next("ccc");

        expect(received).to.deep.equal([1, 3, 6]);
    }

    @test 'scan works with OrderedObservable'() {
        const ordered$ = new OrderedObservable<string>("");
        const received: number[] = [];

        ordered$.pipe()
            .scan<number>((acc, val) => acc + val.length, 0)
            .subscribe((v: number) => received.push(v));

        ordered$.next("a");
        ordered$.next("bb");
        ordered$.next("ccc");

        expect(received).to.deep.equal([1, 3, 6]);
    }

    @test 'scan does not affect other subscribers'() {
        const scanReceived: number[] = [];
        const regularReceived: string[] = [];

        this.OBSERVABLE$.pipe()
            .scan<number>((acc, val) => acc + val.length, 0)
            .subscribe((v: number) => scanReceived.push(v));

        this.OBSERVABLE$.subscribe((v: string) => regularReceived.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("bb");
        this.OBSERVABLE$.next("ccc");

        expect(scanReceived).to.deep.equal([1, 3, 6]);
        expect(regularReceived).to.deep.equal(["a", "bb", "ccc"]);
    }

    @test 'scan with error handler — no errors on normal flow'() {
        let errorCounter = 0;
        const errorHandler = () => { errorCounter++; };
        const received: number[] = [];

        this.OBSERVABLE$.pipe()
            .scan<number>((acc, val) => acc + val.length, 0)
            .subscribe((v: number) => received.push(v), errorHandler);

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");

        expect(received).to.deep.equal([2, 7]);
        expect(errorCounter).to.be.equal(0);
    }
}
