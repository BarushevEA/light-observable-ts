import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class ThrottleUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
    }

    @test 'throttle allows first value immediately'() {
        let received: string[] = [];
        this.OBSERVABLE$.pipe()
            .throttle(1000)
            .subscribe((value: string) => received.push(value));

        this.OBSERVABLE$.next("first");
        expect(received).to.deep.equal(["first"]);
    }

    @test 'throttle drops values within interval'() {
        let received: string[] = [];
        this.OBSERVABLE$.pipe()
            .throttle(1000)
            .subscribe((value: string) => received.push(value));

        this.OBSERVABLE$.next("first");
        this.OBSERVABLE$.next("second");
        this.OBSERVABLE$.next("third");
        expect(received).to.deep.equal(["first"]);
    }

    @test 'throttle with 0ms passes all values'() {
        let received: string[] = [];
        this.OBSERVABLE$.pipe()
            .throttle(0)
            .subscribe((value: string) => received.push(value));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");
        expect(received).to.deep.equal(["a", "b", "c"]);
    }

    @test 'throttle chains with and() filter'() {
        let received: string[] = [];
        this.OBSERVABLE$.pipe()
            .and((s: string) => s.length > 1)
            .throttle(1000)
            .subscribe((value: string) => received.push(value));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("world");
        expect(received).to.deep.equal(["hello"]);
    }

    @test 'throttle chains with map()'() {
        let received: number[] = [];
        this.OBSERVABLE$.pipe()
            .throttle(1000)
            .map<number>((s: string) => s.length)
            .subscribe((value: number) => received.push(value));

        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("world");
        expect(received).to.deep.equal([5]);
    }

    @test 'throttle has independent state per subscriber'() {
        let received1: string[] = [];
        let received2: string[] = [];

        this.OBSERVABLE$.pipe()
            .throttle(1000)
            .subscribe((value: string) => received1.push(value));

        this.OBSERVABLE$.pipe()
            .throttle(1000)
            .subscribe((value: string) => received2.push(value));

        this.OBSERVABLE$.next("value");
        expect(received1).to.deep.equal(["value"]);
        expect(received2).to.deep.equal(["value"]);
    }

    @test 'throttle allows value after interval expires'(done: Function) {
        let received: string[] = [];
        this.OBSERVABLE$.pipe()
            .throttle(50)
            .subscribe((value: string) => received.push(value));

        this.OBSERVABLE$.next("first");
        this.OBSERVABLE$.next("blocked");

        setTimeout(() => {
            this.OBSERVABLE$.next("after-interval");
            expect(received).to.deep.equal(["first", "after-interval"]);
            done();
        }, 60);
    }
}
