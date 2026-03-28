import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class DebounceErrorHandlingTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
    }

    @test 'debounce catches error in chain callback after debounce'(done: Function) {
        const errors: any[] = [];
        const sub = this.OBSERVABLE$.pipe()
            .debounce(10)
            .and(() => { throw new Error('chain error'); })
            .subscribe(
                () => {},
                (data: any, err: any) => { errors.push({data, err}); }
            );

        this.OBSERVABLE$.next('test');

        setTimeout(() => {
            expect(errors.length).to.be.equal(1);
            expect(errors[0].err).to.be.instanceOf(Error);
            expect(errors[0].err.message).to.be.equal('chain error');
            expect(errors[0].data).to.be.equal('test');
            sub.unsubscribe();
            done();
        }, 50);
    }

    @test 'debounce catches error in listener after debounce'(done: Function) {
        const errors: any[] = [];
        const sub = this.OBSERVABLE$.pipe()
            .debounce(10)
            .subscribe(
                () => { throw new Error('listener error'); },
                (data: any, err: any) => { errors.push({data, err}); }
            );

        this.OBSERVABLE$.next('hello');

        setTimeout(() => {
            expect(errors.length).to.be.equal(1);
            expect(errors[0].err).to.be.instanceOf(Error);
            expect(errors[0].err.message).to.be.equal('listener error');
            expect(errors[0].data).to.be.equal('hello');
            sub.unsubscribe();
            done();
        }, 50);
    }

    @test 'debounce catches error in map() callback after debounce'(done: Function) {
        const errors: any[] = [];
        const sub = this.OBSERVABLE$.pipe()
            .debounce(10)
            .map<number>(() => { throw new Error('map error'); })
            .subscribe(
                () => {},
                (data: any, err: any) => { errors.push({data, err}); }
            );

        this.OBSERVABLE$.next('value');

        setTimeout(() => {
            expect(errors.length).to.be.equal(1);
            expect(errors[0].err.message).to.be.equal('map error');
            sub.unsubscribe();
            done();
        }, 50);
    }

    @test 'debounce error does not break subsequent emissions'(done: Function) {
        const results: string[] = [];
        const errors: any[] = [];
        let shouldThrow = true;

        const sub = this.OBSERVABLE$.pipe()
            .debounce(10)
            .subscribe(
                (v: string) => {
                    if (shouldThrow) {
                        shouldThrow = false;
                        throw new Error('first error');
                    }
                    results.push(v);
                },
                (data: any, err: any) => { errors.push(err); }
            );

        this.OBSERVABLE$.next('first');

        setTimeout(() => {
            // First emission errored
            expect(errors.length).to.be.equal(1);

            // Second emission should work
            this.OBSERVABLE$.next('second');

            setTimeout(() => {
                expect(results).to.deep.equal(['second']);
                sub.unsubscribe();
                done();
            }, 50);
        }, 50);
    }
}
