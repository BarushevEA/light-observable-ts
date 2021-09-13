import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";
import {IPause} from "../src/Libraries/Observables/Types";

_chai.should();
_chai.expect;

@suite
class ObservableUnitTest {
    private OBSERVABLE$: Observable<string>

    before() {
        this.OBSERVABLE$ = new Observable('');
    }

    @test 'Observable is created'() {
        // @ts-ignore
        expect(this.OBSERVABLE$.value).to.be.equal('');
        // @ts-ignore
        expect(this.OBSERVABLE$.listeners).to.be.eql([]);
    }

    @test 'Add one subscriber'() {
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        // @ts-ignore
        const once = subscribeObject.once;
        // @ts-ignore
        expect(once.isOnce).to.be.equal(false);
        // @ts-ignore
        expect(once.isFinished).to.be.equal(false);
    }

    @test 'unsubscribe one by subject'() {
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        subscribeObject.unsubscribe();
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'unsubscribe one by observable'() {
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.unSubscribe(subscribeObject);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'unsubscribe all by ony'() {
        this.OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.unsubscribeAll();
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'Add one subscriber and listen one event'() {
        const str = '1';
        const listener = (value: string) => {
            expect(value).to.be.equal(str);
        };
        this.OBSERVABLE$.subscribe(listener);
        this.OBSERVABLE$.next(str);
    }

    @test 'Add one subscriber and listen ten events'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);

        this.OBSERVABLE$.subscribe(listener);
        for (; counter < 10; counter++) this.OBSERVABLE$.next(str[counter]);
    }

    @test 'Add one subscriber and get value after one change'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.OBSERVABLE$.subscribe(listener);
        for (; counter < 1; counter++) this.OBSERVABLE$.next(str[counter]);

        expect(this.OBSERVABLE$.getValue()).to.be.equal('0');
    }

    @test 'Add one subscriber and get value after five changes'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.OBSERVABLE$.subscribe(listener);
        for (; counter < 5; counter++) this.OBSERVABLE$.next(str[counter]);

        expect(this.OBSERVABLE$.getValue()).to.be.equal('4');
    }

    @test 'Add one subscriber and get value after ten changes'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.OBSERVABLE$.subscribe(listener);
        for (; counter < 10; counter++) this.OBSERVABLE$.next(str[counter]);

        expect(this.OBSERVABLE$.getValue()).to.be.equal('9');
    }

    @test 'Add one by pipe and "once"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.once.isOnce).to.be.equal(true);
        // @ts-ignore
        expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'Add one by pipe and "once" after 10 changes'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => expect(value).to.be.equal(str[0]);

        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        // @ts-ignore
        expect(subscribeObject.once.isOnce).to.be.equal(true);
        for (; counter < 10; counter++) this.OBSERVABLE$.next(str[counter]);
        // @ts-ignore
        expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'Add bad pipe'() {
        const str = '0123456789';
        this.OBSERVABLE$.pipe();
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByNegative true"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "unsubscribeByNegative false"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => false;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByNegative" (5 positive, 5 negative)'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);
        const condition = () => counter < 5;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByPositive true"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByPositive false"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => false;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "unsubscribeByPositive" (5 negative, 5 positive)'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);
        const condition = () => counter > 4;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(0);
    }

    @test 'Add one by pipe and "emitByNegative true"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => true;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByNegative false"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => false;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByNegative" (5 negative, 5 positive)'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal(str[counter]);
            expect(true).to.be.equal(counter > -1 && counter < 5);
        };
        const condition = () => counter > 4;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByNegative" (5 positive 5 negative)'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal(str[counter]);
            expect(true).to.be.equal(counter > 4 && counter < 10);
        };
        const condition = () => counter < 5;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByPositive true"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByPositive false"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => false;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByPositive" (5 negative, 5 positive)'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal(str[counter]);
            expect(true).to.be.equal(counter > 4 && counter < 10);
        };
        const condition = () => counter > 4;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByPositive" (5 positive 5 negative)'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal(str[counter]);
            expect(true).to.be.equal(counter > -1 && counter < 5);
        };
        const condition = () => counter < 5;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch true"'() {
        const str = '0123456789';
        const condition = () => '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener);
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch false"'() {
        const str = '0123456789';
        const condition = () => '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener);
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "0")'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal('0');
            expect(true).to.be.equal(counter === 0);
        };
        const condition = () => '0';
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "9")'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal('9');
            expect(true).to.be.equal(counter === 9);
        };
        const condition = () => '9';
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "5")'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal('5');
            expect(true).to.be.equal(counter === 5);
        };
        const condition = () => '5';
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
    }

    @test 'pause / resume'() {
        let counter = 0;
        let accumulatorStr = '';
        const str = '0123456789';
        const listener = (value: string) => accumulatorStr += value;
        const subscribeObject = this.OBSERVABLE$.subscribe(listener);
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && (<IPause><any>subscribeObject).pause();
            (counter === 8) && (<IPause><any>subscribeObject).resume();
            this.OBSERVABLE$.next(str[counter]);
        }
        expect(this.OBSERVABLE$.getNumberOfSubscribers()).to.be.equal(1);
        expect(accumulatorStr).to.be.equal('012389');
    }
}