import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {IOrder, IOrderedSubscriptionLike, IPause} from "../src/Libraries/Observables/Types";
import {OrderedObservable} from "../src/Libraries/Observables/OrderedObservable";

_chai.should();
_chai.expect;

@suite
class OrderedObservableUnitTest {
    private ORDERED_OBSERVABLE$: OrderedObservable<string>;

    before() {
        this.ORDERED_OBSERVABLE$ = new OrderedObservable('');
    }

    @test 'Observable is created'() {
        // @ts-ignore
        expect(this.ORDERED_OBSERVABLE$.value).to.be.equal('');
        // @ts-ignore
        expect(this.ORDERED_OBSERVABLE$.listeners).to.be.eql([]);
    }

    @test 'Add one subscriber'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        // @ts-ignore
        const once = subscribeObject.once;
        // @ts-ignore
        expect(once.isOnce).to.be.equal(false);
        // @ts-ignore
        expect(once.isFinished).to.be.equal(false);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'unsubscribe one by subject'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        subscribeObject.unsubscribe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'unsubscribe one by observable'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.unSubscribe(subscribeObject);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'unsubscribe all'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(5).to.be.equal(this.ORDERED_OBSERVABLE$.size());
        this.ORDERED_OBSERVABLE$.unsubscribeAll();
        expect(0).to.be.equal(this.ORDERED_OBSERVABLE$.size());
        this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(1).to.be.equal(this.ORDERED_OBSERVABLE$.size());
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one subscriber and listen one event'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '1';
        const listener = (value: string) => {
            expect(value).to.be.equal(str);
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        this.ORDERED_OBSERVABLE$.next(str);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one subscriber and listen ten events'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);

        this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        for (; counter < 10; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one subscriber and get value after one change'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        for (; counter < 1; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);

        expect(this.ORDERED_OBSERVABLE$.getValue()).to.be.equal('0');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one subscriber and get value after five changes'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        for (; counter < 5; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);

        expect(this.ORDERED_OBSERVABLE$.getValue()).to.be.equal('4');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one subscriber and get value after ten changes'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        for (; counter < 10; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);

        expect(this.ORDERED_OBSERVABLE$.getValue()).to.be.equal('9');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "once"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.once.isOnce).to.be.equal(true);
        // @ts-ignore
        expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "once" after 10 changes'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => expect(value).to.be.equal(str[0]);

        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        // @ts-ignore
        expect(subscribeObject.once.isOnce).to.be.equal(true);
        for (; counter < 10; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);
        // @ts-ignore
        expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add bad pipe'() {
        const str = '0123456789';
        this.ORDERED_OBSERVABLE$.pipe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByNegative true"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "unsubscribeByNegative false"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => false;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "unsubscribeByNegative" (5 positive, 5 negative)'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);
        const condition = () => counter < 5;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "unsubscribeByPositive true"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(null);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "unsubscribeByPositive false"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => false;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "unsubscribeByPositive" (5 negative, 5 positive)'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);
        const condition = () => counter > 4;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitByNegative true"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => true;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitByNegative false"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => false;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitByNegative" (5 negative, 5 positive)'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal(str[counter]);
            expect(true).to.be.equal(counter > -1 && counter < 5);
        };
        const condition = () => counter > 4;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitByNegative" (5 positive 5 negative)'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal(str[counter]);
            expect(true).to.be.equal(counter > 4 && counter < 10);
        };
        const condition = () => counter < 5;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitByPositive true"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitByPositive false"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => false;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitByPositive" (5 negative, 5 positive)'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal(str[counter]);
            expect(true).to.be.equal(counter > 4 && counter < 10);
        };
        const condition = () => counter > 4;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitByPositive" (5 positive 5 negative)'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal(str[counter]);
            expect(true).to.be.equal(counter > -1 && counter < 5);
        };
        const condition = () => counter < 5;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitMatch true"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const condition = () => '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitMatch false"'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        // const str = '0123456789';
        const condition = () => '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "0")'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal('0');
            expect(true).to.be.equal(counter === 0);
        };
        const condition = () => '0';
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "9")'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal('9');
            expect(true).to.be.equal(counter === 9);
        };
        const condition = () => '9';
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "5")'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => {
            expect(value).to.be.equal('5');
            expect(true).to.be.equal(counter === 5);
        };
        const condition = () => '5';
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'pause / resume'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        let accumulatorStr = '';
        const str = '0123456789';
        const listener = (value: string) => accumulatorStr += value;
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && (<IPause><any>subscribeObject).pause();
            (counter === 8) && (<IPause><any>subscribeObject).resume();
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(accumulatorStr).to.be.equal('012389');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'order identification'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener = (value: string) => value;
        const subscribeObject = <IOrder><any>this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        subscribeObject.order = 11011;
        expect(subscribeObject.order).to.be.equal(11011);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'observable disable/enable'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        let accumulatorStr = '';
        const str = '0123456789';
        const listener = (value: string) => accumulatorStr += value;
        this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && this.ORDERED_OBSERVABLE$.disable();
            (counter === 8) && this.ORDERED_OBSERVABLE$.enable();
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(this.ORDERED_OBSERVABLE$.isEnable).to.be.equal(true);
        expect(accumulatorStr).to.be.equal('012389');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'observable destroy'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        let accumulatorStr = '';
        const str = '0123456789';
        const listener = (value: string) => accumulatorStr += value;
        this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && this.ORDERED_OBSERVABLE$.disable();
            (counter === 8) && this.ORDERED_OBSERVABLE$.enable();
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(this.ORDERED_OBSERVABLE$.isEnable).to.be.equal(true);
        expect(accumulatorStr).to.be.equal('012389');
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
        // @ts-ignore
        expect(this.ORDERED_OBSERVABLE$.value).to.be.equal(null);
        // @ts-ignore
        expect(this.ORDERED_OBSERVABLE$.listeners).to.be.equal(null);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'defect field "observable" from subscribeObject'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener = (value: string) => {
            expect(value).to.be.equal('ERROR WAY');
        };
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        // @ts-ignore
        subscribeObject.observable = 0;
        this.ORDERED_OBSERVABLE$.next('some data');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'defect field "listener" from subscribeObject'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener = (value: string) => {
            expect(value).to.be.equal('ERROR DATA');
        };
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        // @ts-ignore
        subscribeObject.listener = 0;
        this.ORDERED_OBSERVABLE$.next('VALID DATA');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'multi use'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let counter = 0;
        const str = '0123456789';
        const subscribeObject1 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject1).order = 1;
        }, errorHandler);
        const subscribeObject2 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject2).order = 2;
        }, errorHandler);
        const subscribeObject3 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject3).order = 3;
        }, errorHandler);
        const subscribeObject4 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject4).order = 4;
        }, errorHandler);
        const subscribeObject5 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject5).order = 5;
        }, errorHandler);
        for (; counter < str.length; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(5);
        expect((<IOrder><any>subscribeObject1).order).to.be.equal(1);
        expect((<IOrder><any>subscribeObject2).order).to.be.equal(2);
        expect((<IOrder><any>subscribeObject3).order).to.be.equal(3);
        expect((<IOrder><any>subscribeObject4).order).to.be.equal(4);
        expect((<IOrder><any>subscribeObject5).order).to.be.equal(5);
        subscribeObject1.unsubscribe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(4);
        subscribeObject2.unsubscribe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(3);
        subscribeObject3.unsubscribe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(2);
        subscribeObject4.unsubscribe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        subscribeObject5.unsubscribe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use next'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        }, errorHandler);
        this.ORDERED_OBSERVABLE$.destroy();
        this.ORDERED_OBSERVABLE$.next('VALID DATA');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use unSubscribe'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribeObject1 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        }, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        this.ORDERED_OBSERVABLE$.unSubscribe(subscribeObject1);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use unSubscribeAll'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        }, errorHandler);
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        }, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(2);
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        this.ORDERED_OBSERVABLE$.unsubscribeAll();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use getValue'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        }, errorHandler);
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.getValue()).to.be.equal(undefined);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use subscribe'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        }, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.destroy();
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        }, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use pipe'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        }, errorHandler);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.pipe()).to.be.equal(undefined);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'sorted two subscribers by default'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let innerCounter = 0;
        const listener = () => {
            innerCounter++;
            if (innerCounter === 1) {
                expect(subscriber1.order).to.be.equal(innerCounter);
            }
            if (innerCounter === 2) {
                expect(subscriber2.order).to.be.equal(innerCounter);
            }
        };
        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        subscriber1.order = 1;
        const subscriber2 = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        subscriber2.order = 2;
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'order three subscribers by setAscendingSort'() {
        this.ORDERED_OBSERVABLE$.setAscendingSort();

        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };

        let innerCounter = 0;

        const listener1 = () => {
            innerCounter++;
            expect(innerCounter).to.be.equal(1);
        };
        const listener2 = () => {
            innerCounter++;
            expect(innerCounter).to.be.equal(2);
        };
        const listener3 = () => {
            innerCounter++;
            expect(innerCounter).to.be.equal(3);
        };

        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        const subscriber2 = this.ORDERED_OBSERVABLE$.subscribe(listener2, errorHandler);
        const subscriber3 = this.ORDERED_OBSERVABLE$.subscribe(listener3, errorHandler);
        subscriber1.order = 1;
        subscriber2.order = 2;
        subscriber3.order = 3;

        this.ORDERED_OBSERVABLE$.next('SOME DATA');

        expect(0).to.be.equal(errorCounter);
    }

    @test 'order three subscribers by setDescendingSort'() {
        this.ORDERED_OBSERVABLE$.setDescendingSort();

        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };

        let innerCounter = 0;

        const listener1 = () => {
            innerCounter++;
            expect(innerCounter).to.be.equal(4);
        };
        const listener2 = () => {
            innerCounter++;
            expect(innerCounter).to.be.equal(3);
        };
        const listener3 = () => {
            innerCounter++;
            expect(innerCounter).to.be.equal(2);
        };
        const listener4 = () => {
            expect(subscriber4.order).to.be.equal(5);
        };
        const listener5 = () => {
            expect(subscriber5.order).to.be.equal(5);
        };
        const listener6 = () => {
            innerCounter++;
            expect(innerCounter).to.be.equal(1);
        };

        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        const subscriber2 = this.ORDERED_OBSERVABLE$.subscribe(listener2, errorHandler);
        const subscriber3 = this.ORDERED_OBSERVABLE$.subscribe(listener3, errorHandler);
        const subscriber4 = this.ORDERED_OBSERVABLE$.subscribe(listener4, errorHandler);
        const subscriber5 = this.ORDERED_OBSERVABLE$.subscribe(listener5, errorHandler);
        const subscriber6 = this.ORDERED_OBSERVABLE$.subscribe(listener6, errorHandler);
        subscriber1.order = 1;
        subscriber2.order = 2;
        subscriber3.order = 3;
        subscriber4.order = 5;
        subscriber5.order = 5;
        subscriber6.order = 4;

        this.ORDERED_OBSERVABLE$.next('SOME DATA');

        expect(0).to.be.equal(errorCounter);
    }

    @test 'sorted two subscribers by revers'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let innerCounter = 0;
        const listener = () => {
            innerCounter++;
            if (innerCounter === 1) {
                expect(subscriber2.order).to.be.equal(innerCounter);
            }
            if (innerCounter === 2) {
                expect(subscriber1.order).to.be.equal(innerCounter);
            }
        };
        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        subscriber1.order = 2;
        const subscriber2 = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        subscriber2.order = 1;
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'sorted ten subscribers by default'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribers: IOrderedSubscriptionLike[] = [];
        let innerCounter = 0;
        const listener = () => {
            expect(subscribers[innerCounter].order).to.be.equal(innerCounter);
            innerCounter++;
        };
        for (let i = 0; i < 10; i++) {
            const subscriber = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
            subscriber.order = i;
            subscribers.push(subscriber);
        }
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'sorted ten subscribers by revers'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribers: IOrderedSubscriptionLike[] = [];
        let innerCounter = 0;
        const listener = () => {
            expect(subscribers[innerCounter].order).to.be.equal(9 - innerCounter);
            innerCounter++;
        };
        for (let i = 0; i < 10; i++) {
            const subscriber = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
            subscriber.order = 9 - i;
            subscribers.push(subscriber);
        }
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'sorted ten subscribers by default but last element order to first'() {
        let innerCounter = 0;
        let orders: number[] = [];
        let subscribers: IOrderedSubscriptionLike[] = [];
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener = () => {
            orders.push(subscribers[innerCounter].order);
            innerCounter++;
        };
        for (let i = 0; i < 10; i++) {
            const subscriber = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
            subscriber.order = i;
            subscribers.push(subscriber);
        }

        // @ts-ignore
        subscribers = this.ORDERED_OBSERVABLE$.listeners;
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(orders).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        subscribers[subscribers.length - 1].order = -1;
        innerCounter = 0;
        orders = [];

        // @ts-ignore
        subscribers = this.ORDERED_OBSERVABLE$.listeners;
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(orders).to.be.eql([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'sorted ten subscribers by default but last and previews element order to first'() {
        let innerCounter = 0;
        let orders: number[] = [];
        let subscribers: IOrderedSubscriptionLike[] = [];
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener = () => {
            orders.push(subscribers[innerCounter].order);
            innerCounter++;
        };
        for (let i = 0; i < 10; i++) {
            const subscriber = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
            subscriber.order = i;
            subscribers.push(subscriber);
        }

        // @ts-ignore
        subscribers = this.ORDERED_OBSERVABLE$.listeners;
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(orders).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        subscribers[subscribers.length - 1].order = -1;
        subscribers[subscribers.length - 1].order = -2;
        innerCounter = 0;
        orders = [];

        // @ts-ignore
        subscribers = this.ORDERED_OBSERVABLE$.listeners;
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(orders).to.be.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'try use broken observable'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener = (value: string) => value;
        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);
        // @ts-ignore
        this.ORDERED_OBSERVABLE$._isDestroyed = true;
        subscriber1.order = 10;
        expect(this.ORDERED_OBSERVABLE$.pipe()).to.be.equal(undefined);
        expect(subscriber1.order).to.be.equal(undefined);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'try use destroyed observable'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener = (value: string) => value;
        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener, errorHandler);

        this.ORDERED_OBSERVABLE$.destroy();
        subscriber1.order = 10;
        expect(false).to.be.equal(this.ORDERED_OBSERVABLE$.sortByOrder());
        expect(undefined).to.be.equal(this.ORDERED_OBSERVABLE$.pipe());
        expect(undefined).to.be.equal(subscriber1.order);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'subscribe undefined listener'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = undefined;
        const subscribe = this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        expect(undefined).to.be.equal(subscribe);
        expect(0).to.be.equal(this.ORDERED_OBSERVABLE$.size());
        expect(0).to.be.equal(errorCounter);
    }

    @test 'subscribe custom error handler'() {
        let errorCounter = 0;
        const data = "test";
        const errorHandler = (errorData: any) => {
            expect(data).to.be.equal(errorData);
            errorCounter++;
        };
        const listener1 = (value: string) => {
            console.log(value);
            throw new Error('TEST ERROR HANDLER');
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        expect(1).to.be.equal(this.ORDERED_OBSERVABLE$.size());
        this.ORDERED_OBSERVABLE$.next(data);
        expect(1).to.be.equal(errorCounter);
    }


    @test 'stream array by 10 elements'() {
        let errorCounter = 0;
        let counter = 0;
        const accum: string[] = [];
        const streamArr = ["1", "2", "3", "1", "2", "3", "1", "2", "3", "4"];
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            accum.push(data);
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        this.ORDERED_OBSERVABLE$.stream(streamArr);
        expect(streamArr).to.be.deep.equal(accum);
        expect(10).to.be.equal(counter);
    }

    @test 'stream array by 5 elements'() {
        let errorCounter = 0;
        let counter = 0;
        const accum: string[] = [];
        const streamArr = ["1", "2", "3", "4", "5"];
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            accum.push(data);
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        this.ORDERED_OBSERVABLE$.stream(streamArr);
        expect(streamArr).to.be.deep.equal(accum);
        expect(5).to.be.equal(counter);
    }

    @test 'stream array by 1 element'() {
        let errorCounter = 0;
        let counter = 0;
        const accum: string[] = [];
        const streamArr = ["1"];
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            accum.push(data);
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        this.ORDERED_OBSERVABLE$.stream(streamArr);
        expect(streamArr).to.be.deep.equal(accum);
        expect(1).to.be.equal(counter);
    }

    @test 'stream array by 0 elements'() {
        let errorCounter = 0;
        let counter = 0;
        const accum: string[] = [];
        const streamArr = [];
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            accum.push(data);
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        this.ORDERED_OBSERVABLE$.stream(streamArr);
        expect(streamArr).to.be.deep.equal(accum);
        expect(0).to.be.equal(counter);
    }

    @test 'stream array when destroy'() {
        let errorCounter = 0;
        let counter = 0;
        const accum: string[] = [];
        const streamArr = ["1", "2", "3"];
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            accum.push(data);
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        this.ORDERED_OBSERVABLE$.destroy();
        this.ORDERED_OBSERVABLE$.stream(streamArr);
        expect([]).to.be.deep.equal(accum);
        expect(0).to.be.equal(counter);
        expect(true).to.be.equal(this.ORDERED_OBSERVABLE$.isDestroyed);
        expect(0).to.be.equal(this.ORDERED_OBSERVABLE$.size());
    }

    @test 'stream array when disable/enable'() {
        let errorCounter = 0;
        let counter = 0;
        const accum: string[] = [];
        const streamArr = ["1", "2", "3"];
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            accum.push(data);
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener1, errorHandler);
        this.ORDERED_OBSERVABLE$.disable();
        this.ORDERED_OBSERVABLE$.stream(streamArr);
        expect([]).to.be.deep.equal(accum);
        expect(0).to.be.equal(counter);
        expect(false).to.be.equal(this.ORDERED_OBSERVABLE$.isEnable);
        expect(1).to.be.equal(this.ORDERED_OBSERVABLE$.size());
        this.ORDERED_OBSERVABLE$.enable();
        this.ORDERED_OBSERVABLE$.stream(streamArr);
        expect(streamArr).to.be.deep.equal(accum);
        expect(3).to.be.equal(counter);
        expect(true).to.be.equal(this.ORDERED_OBSERVABLE$.isEnable);
        expect(1).to.be.equal(this.ORDERED_OBSERVABLE$.size());
    }
}
