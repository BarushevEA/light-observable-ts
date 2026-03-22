import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class TapUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
    }

    @test 'tap calls side-effect and delivers value to subscriber'() {
        const tapped: string[] = [];
        const received: string[] = [];

        const sub = this.OBSERVABLE$.pipe()
            .tap((v: string) => tapped.push(v))
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("world");

        expect(tapped).to.deep.equal(["hello", "world"]);
        expect(received).to.deep.equal(["hello", "world"]);
        sub.unsubscribe();
    }

    @test 'tap does not modify payload'() {
        const received: string[] = [];

        const sub = this.OBSERVABLE$.pipe()
            .tap((v: string) => v + "_modified")
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("original");

        expect(received).to.deep.equal(["original"]);
        sub.unsubscribe();
    }

    @test 'tap works after and() filter'() {
        const tapped: string[] = [];
        const received: string[] = [];

        const sub = this.OBSERVABLE$.pipe()
            .and((v: string) => v.length > 3)
            .tap((v: string) => tapped.push(v))
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("hi");
        this.OBSERVABLE$.next("hello");
        this.OBSERVABLE$.next("no");
        this.OBSERVABLE$.next("world");

        expect(tapped).to.deep.equal(["hello", "world"]);
        expect(received).to.deep.equal(["hello", "world"]);
        sub.unsubscribe();
    }

    @test 'tap before and after map() sees correct values'() {
        const obs$ = new Observable<string>('');
        const tappedBefore: string[] = [];
        const tappedAfter: number[] = [];
        const received: number[] = [];

        const sub = obs$.pipe()
            .tap((v: string) => tappedBefore.push(v))
            .map<number>((v: string) => v.length)
            .tap((v: number) => tappedAfter.push(v))
            .subscribe((v: number) => received.push(v));

        obs$.next("ab");
        obs$.next("abcde");

        expect(tappedBefore).to.deep.equal(["ab", "abcde"]);
        expect(tappedAfter).to.deep.equal([2, 5]);
        expect(received).to.deep.equal([2, 5]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'multiple tap() calls execute in order'() {
        const log: string[] = [];

        const sub = this.OBSERVABLE$.pipe()
            .tap(() => log.push("first"))
            .tap(() => log.push("second"))
            .tap(() => log.push("third"))
            .subscribe(() => log.push("listener"));

        this.OBSERVABLE$.next("test");

        expect(log).to.deep.equal(["first", "second", "third", "listener"]);
        sub.unsubscribe();
    }

    @test 'tap works before choice().or()'() {
        const obs$ = new Observable<number>(0);
        const tapped: number[] = [];
        const received: number[] = [];

        const sub = obs$.pipe()
            .tap((v: number) => tapped.push(v))
            .choice()
            .or((v: number) => v === 1)
            .or((v: number) => v === 3)
            .subscribe((v: number) => received.push(v));

        obs$.next(1);
        obs$.next(2);
        obs$.next(3);
        obs$.next(4);

        expect(tapped).to.deep.equal([1, 2, 3, 4]);
        expect(received).to.deep.equal([1, 3]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'tap not called after destroy'() {
        const tapped: string[] = [];
        this.OBSERVABLE$.pipe()
            .tap((v: string) => tapped.push(v))
            .subscribe((v: string) => {});

        this.OBSERVABLE$.next("before");
        this.OBSERVABLE$.destroy();
        this.OBSERVABLE$.next("after");

        expect(tapped).to.deep.equal(["before"]);
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
    }

    @test 'tap not called after unsubscribe'() {
        const tapped: string[] = [];
        const sub = this.OBSERVABLE$.pipe()
            .tap((v: string) => tapped.push(v))
            .subscribe((v: string) => {});

        this.OBSERVABLE$.next("before");
        sub.unsubscribe();
        this.OBSERVABLE$.next("after");

        expect(tapped).to.deep.equal(["before"]);
    }

    @test 'tap has independent state per subscriber'() {
        const obs$ = new Observable<number>(0);
        const tapped1: number[] = [];
        const tapped2: number[] = [];

        const sub1 = obs$.pipe()
            .tap((v: number) => tapped1.push(v))
            .subscribe(() => {});

        const sub2 = obs$.pipe()
            .and((v: number) => v > 2)
            .tap((v: number) => tapped2.push(v))
            .subscribe(() => {});

        obs$.next(1);
        obs$.next(2);
        obs$.next(3);

        expect(tapped1).to.deep.equal([1, 2, 3]);
        expect(tapped2).to.deep.equal([3]); // only v > 2 reaches tap2
        sub1.unsubscribe();
        sub2.unsubscribe();
        obs$.destroy();
    }

    @test 'tap with throttle(0): tap sees all throttled values'() {
        const obs$ = new Observable<number>(0);
        const tapped: number[] = [];
        const received: number[] = [];

        const sub = obs$.pipe()
            .throttle(0)
            .tap((v: number) => tapped.push(v))
            .subscribe((v: number) => received.push(v));

        obs$.next(1);
        obs$.next(2);
        obs$.next(3);

        expect(tapped).to.deep.equal([1, 2, 3]);
        expect(received).to.deep.equal([1, 2, 3]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'tap with debounce(0): tap sees debounced values'() {
        const tapped: string[] = [];
        const received: string[] = [];

        const sub = this.OBSERVABLE$.pipe()
            .debounce(0)
            .tap((v: string) => tapped.push(v))
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");
        this.OBSERVABLE$.next("c");

        expect(tapped).to.deep.equal(["a", "b", "c"]);
        expect(received).to.deep.equal(["a", "b", "c"]);
        sub.unsubscribe();
    }

    @test 'tap before debounce with async delay'(done: Function) {
        const tapped: string[] = [];
        const received: string[] = [];

        const sub = this.OBSERVABLE$.pipe()
            .tap((v: string) => tapped.push(v))
            .debounce(50)
            .subscribe((v: string) => received.push(v));

        this.OBSERVABLE$.next("a");
        this.OBSERVABLE$.next("b");

        // tap is before debounce — called synchronously for every emission
        expect(tapped).to.deep.equal(["a", "b"]);
        expect(received).to.deep.equal([]);

        setTimeout(() => {
            expect(tapped).to.deep.equal(["a", "b"]);
            expect(received).to.deep.equal(["b"]); // debounce emits last
            sub.unsubscribe();
            done();
        }, 60);
    }

    @test 'tap with distinctUntilChanged: tap only called for unique values'() {
        const obs$ = new Observable<number>(0);
        const tapped: number[] = [];
        const received: number[] = [];

        const sub = obs$.pipe()
            .distinctUntilChanged()
            .tap((v: number) => tapped.push(v))
            .subscribe((v: number) => received.push(v));

        obs$.next(1);
        obs$.next(1); // suppressed
        obs$.next(2);
        obs$.next(2); // suppressed
        obs$.next(3);

        expect(tapped).to.deep.equal([1, 2, 3]);
        expect(received).to.deep.equal([1, 2, 3]);
        sub.unsubscribe();
        obs$.destroy();
    }

    @test 'tap exception caught by error handler'() {
        const received: string[] = [];
        let caughtError: any = null;
        let caughtData: any = null;

        const sub = this.OBSERVABLE$.pipe()
            .tap(() => { throw new Error("tap error"); })
            .subscribe(
                (v: string) => received.push(v),
                (data: any, err: any) => { caughtData = data; caughtError = err; }
            );

        this.OBSERVABLE$.next("boom");

        expect(received).to.deep.equal([]);
        expect(caughtError).to.be.instanceOf(Error);
        expect(caughtError.message).to.be.equal("tap error");
        expect(caughtData).to.be.equal("boom");
        sub.unsubscribe();
    }
}
