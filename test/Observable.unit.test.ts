import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";
import {IOrder, IPause} from "../src/Libraries/Observables/Types";

_chai.should();
_chai.expect;

@suite
class ObservableUnitTest {
    private OBSERVABLE$: Observable<string>;

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
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        subscribeObject.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'unsubscribe one by observable'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.unSubscribe(subscribeObject);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'unsubscribe all'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subs1 = this.OBSERVABLE$.subscribe((value: string) => console.log(value));
        this.OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        this.OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        this.OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(4).to.be.equal(this.OBSERVABLE$.size());
        this.OBSERVABLE$.unsubscribeAll();
        expect(0).to.be.equal(this.OBSERVABLE$.size());

        subs1.unsubscribe();

        expect(0).to.be.equal(this.OBSERVABLE$.size());
        this.OBSERVABLE$.subscribe((value: string) => {
            console.log(value);
            expect("test").to.be.equal(value);
        });
        expect(1).to.be.equal(this.OBSERVABLE$.size());
        this.OBSERVABLE$.next("test");
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
        this.OBSERVABLE$.subscribe(listener, errorHandler);
        this.OBSERVABLE$.next(str);
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

        this.OBSERVABLE$.subscribe(listener, errorHandler);
        for (; counter < 10; counter++) this.OBSERVABLE$.next(str[counter]);
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

        this.OBSERVABLE$.subscribe(listener, errorHandler);
        for (; counter < 1; counter++) this.OBSERVABLE$.next(str[counter]);

        expect(this.OBSERVABLE$.getValue()).to.be.equal('0');
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

        this.OBSERVABLE$.subscribe(listener, errorHandler);
        for (; counter < 5; counter++) this.OBSERVABLE$.next(str[counter]);

        expect(this.OBSERVABLE$.getValue()).to.be.equal('4');
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

        this.OBSERVABLE$.subscribe(listener, errorHandler);
        for (; counter < 10; counter++) this.OBSERVABLE$.next(str[counter]);

        expect(this.OBSERVABLE$.getValue()).to.be.equal('9');
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.once.isOnce).to.be.equal(true);
        // @ts-ignore
        expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe, "once" and one without pipe'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        let tmpArr: string[] = [];
        const listener1 = (value: string) => tmpArr.push('listener1:' + value);
        const listener2 = (value: string) => tmpArr.push('listener2:' + value);
        this.OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener1, errorHandler);
        this.OBSERVABLE$.subscribe(listener2, errorHandler);
        this.OBSERVABLE$.next('a');
        expect(tmpArr).to.be.eql(['listener1:a', 'listener2:a']);
        tmpArr = [];
        this.OBSERVABLE$.next('b');
        expect(tmpArr).to.be.eql(['listener2:b']);
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

        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        // @ts-ignore
        expect(subscribeObject.once.isOnce).to.be.equal(true);
        for (; counter < 10; counter++) this.OBSERVABLE$.next(str[counter]);
        // @ts-ignore
        expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add bad pipe'() {
        const str = '0123456789';
        this.OBSERVABLE$.pipe();
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Add one by pipe and "unsubscribeByNegative" (5 positive, 5 negative)'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        }
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);
        const condition = () => counter < 5;
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Try use .unsubscribeByNegative(condition) when "condition" is undefined'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        }
        const str = '0123456789';
        const dataArr: string[] = [];
        const listener = (value: string) => dataArr.push(value);
        this.OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(undefined)
            .subscribe(listener, errorHandler);
        this.OBSERVABLE$.next(str);
        expect([]).to.be.eql(dataArr);
        expect(0).to.be.equal(this.OBSERVABLE$.size());
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Try use .unsubscribeByPositive(condition) when "condition" is undefined'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const dataArr: string[] = [];
        const listener = (value: string) => dataArr.push(value);
        this.OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(undefined)
            .subscribe(listener, errorHandler);
        this.OBSERVABLE$.next(str);
        expect([]).to.be.eql(dataArr);
        expect(0).to.be.equal(this.OBSERVABLE$.size());
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Try use .emitByNegative(condition) when "condition" is undefined'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const dataArr: string[] = [];
        const listener = (value: string) => dataArr.push(value);
        this.OBSERVABLE$
            .pipe()
            .emitByNegative(undefined)
            .subscribe(listener, errorHandler);
        this.OBSERVABLE$.next(str);
        expect([]).to.be.eql(dataArr);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Try use .emitByPositive(condition) when "condition" is undefined'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const dataArr: string[] = [];
        const listener = (value: string) => dataArr.push(value);
        this.OBSERVABLE$
            .pipe()
            .emitByPositive(undefined)
            .subscribe(listener, errorHandler);
        this.OBSERVABLE$.next(str);
        expect([]).to.be.eql(dataArr);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = this.OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'Try use .emitMatch(condition) when "condition" is undefined'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const dataArr: string[] = [];
        const listener = (value: string) => dataArr.push(value);
        this.OBSERVABLE$
            .pipe()
            .emitMatch(undefined)
            .subscribe(listener, errorHandler);
        this.OBSERVABLE$.next(str);
        expect([]).to.be.eql(dataArr);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
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
        const subscribeObject = this.OBSERVABLE$.subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && (<IPause><any>subscribeObject).pause();
            (counter === 8) && (<IPause><any>subscribeObject).resume();
            this.OBSERVABLE$.next(str[counter]);
        }
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
        const subscribeObject = <IOrder><any>this.OBSERVABLE$.subscribe(listener, errorHandler);
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
        this.OBSERVABLE$.subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && this.OBSERVABLE$.disable();
            (counter === 8) && this.OBSERVABLE$.enable();
            this.OBSERVABLE$.next(str[counter]);
        }
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(this.OBSERVABLE$.isEnable).to.be.equal(true);
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
        this.OBSERVABLE$.subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && this.OBSERVABLE$.disable();
            (counter === 8) && this.OBSERVABLE$.enable();
            this.OBSERVABLE$.next(str[counter]);
        }
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(this.OBSERVABLE$.isEnable).to.be.equal(true);
        expect(accumulatorStr).to.be.equal('012389');
        this.OBSERVABLE$.destroy();
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
        // @ts-ignore
        expect(this.OBSERVABLE$.value).to.be.equal(null);
        // @ts-ignore
        expect(this.OBSERVABLE$.listeners).to.be.equal(null);
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
        const subscribeObject = this.OBSERVABLE$.subscribe(listener, errorHandler);
        // @ts-ignore
        subscribeObject.observable = 0;
        this.OBSERVABLE$.next('some data');
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
        const subscribeObject = this.OBSERVABLE$.subscribe(listener, errorHandler);
        // @ts-ignore
        subscribeObject.listener = 0;
        this.OBSERVABLE$.next('VALID DATA');
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
        const subscribeObject1 = this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject1).order = 1;
        }, errorHandler);
        const subscribeObject2 = this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject2).order = 2;
        }, errorHandler);
        const subscribeObject3 = this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject3).order = 3;
        }, errorHandler);
        const subscribeObject4 = this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject4).order = 4;
        }, errorHandler);
        const subscribeObject5 = this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject5).order = 5;
        }, errorHandler);
        for (; counter < str.length; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        expect(this.OBSERVABLE$.size()).to.be.equal(5);
        expect((<IOrder><any>subscribeObject1).order).to.be.equal(1);
        expect((<IOrder><any>subscribeObject2).order).to.be.equal(2);
        expect((<IOrder><any>subscribeObject3).order).to.be.equal(3);
        expect((<IOrder><any>subscribeObject4).order).to.be.equal(4);
        expect((<IOrder><any>subscribeObject5).order).to.be.equal(5);
        subscribeObject1.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(4);
        subscribeObject2.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(3);
        subscribeObject3.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(2);
        subscribeObject4.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        subscribeObject5.unsubscribe();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use next'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        }, errorHandler);

        this.OBSERVABLE$.destroy();
        this.OBSERVABLE$.next('VALID DATA');
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use unSubscribe'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribeObject1 = this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        }, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.destroy();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        this.OBSERVABLE$.unSubscribe(subscribeObject1);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use unSubscribeAll'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        }, errorHandler);
        this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        }, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(2);
        this.OBSERVABLE$.destroy();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        this.OBSERVABLE$.unsubscribeAll();
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use getValue'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        }, errorHandler);
        this.OBSERVABLE$.next('SOME DATA');
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.destroy();
        expect(this.OBSERVABLE$.getValue()).to.be.equal(undefined);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use subscribe'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        }, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.destroy();
        this.OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        }, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy and try to use pipe'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        this.OBSERVABLE$.subscribe((value) => {
            expect('SOME DATA').to.be.equal(value);
        }, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.destroy();
        expect(this.OBSERVABLE$.pipe()).to.be.equal(undefined);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(this.OBSERVABLE$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'error listener'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const dataArr: string[] = [];
        const listener1 = () => {
            throw new Error('LISTENER ERROR');
        };
        const listener2 = (value: string) => {
            dataArr.push(value);
        };
        this.OBSERVABLE$.subscribe(listener1, errorHandler);
        this.OBSERVABLE$.subscribe(listener2, errorHandler);
        this.OBSERVABLE$.subscribe(listener1);
        this.OBSERVABLE$.next('1');
        expect(3).to.be.equal(this.OBSERVABLE$.size());
        expect(['1']).to.be.eql(dataArr);
        expect(1).to.be.equal(errorCounter);
    }

    @test 'error condition'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const dataArr: string[] = [];
        const listener1 = (value: string) => dataArr.push(value);
        const listener2 = (value: string) => dataArr.push(value);
        this.OBSERVABLE$
            .pipe()
            .emitByPositive(() => {
                throw new Error('CONDITION ERROR');
            })
            .subscribe(listener1, errorHandler);
        this.OBSERVABLE$.subscribe(listener2, errorHandler);
        this.OBSERVABLE$.next('1');
        expect(2).to.be.equal(this.OBSERVABLE$.size());
        expect(['1']).to.be.eql(dataArr);
        expect(1).to.be.equal(errorCounter);
    }

    @test 'subscribe undefined listener'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = undefined;
        const subscribe = this.OBSERVABLE$.subscribe(listener1, errorHandler);
        expect(undefined).to.be.equal(subscribe);
        expect(0).to.be.equal(this.OBSERVABLE$.size());
        expect(0).to.be.equal(errorCounter);
    }

    @test 'subscribe custom error handler'() {
        let counter = 0;
        const data = "test";
        const listener1 = (value: string) => {
            console.log(value);
            throw new Error('TEST ERROR HANDLER');
        };
        const errorHandler = (errorData: any) => {
            expect(data).to.be.equal(errorData);
            counter++;
        };
        this.OBSERVABLE$.subscribe(listener1, errorHandler);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
        this.OBSERVABLE$.next(data);
        expect(1).to.be.equal(counter);
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
        this.OBSERVABLE$.subscribe(listener1, errorHandler);
        this.OBSERVABLE$.stream(streamArr);
        expect(streamArr).to.be.deep.equal(accum);
        expect(10).to.be.equal(counter);
    }

    @test 'stream and pipe array by 10 elements'() {
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
        this.OBSERVABLE$
            .pipe()
            .emitByPositive((data) => +data < 2)
            .subscribe(listener1, errorHandler);
        this.OBSERVABLE$.stream(streamArr);
        expect(['1', '1', '1']).to.be.deep.equal(accum);
        expect(3).to.be.equal(counter);
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
        this.OBSERVABLE$.subscribe(listener1, errorHandler);
        this.OBSERVABLE$.stream(streamArr);
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
        this.OBSERVABLE$.subscribe(listener1, errorHandler);
        this.OBSERVABLE$.stream(streamArr);
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
        this.OBSERVABLE$.subscribe(listener1, errorHandler);
        this.OBSERVABLE$.stream(streamArr);
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
        this.OBSERVABLE$.subscribe(listener1, errorHandler);
        this.OBSERVABLE$.destroy();
        this.OBSERVABLE$.stream(streamArr);
        expect([]).to.be.deep.equal(accum);
        expect(0).to.be.equal(counter);
        expect(true).to.be.equal(this.OBSERVABLE$.isDestroyed);
        expect(0).to.be.equal(this.OBSERVABLE$.size());
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
        this.OBSERVABLE$.subscribe(listener1, errorHandler);
        this.OBSERVABLE$.disable();
        this.OBSERVABLE$.stream(streamArr);
        expect([]).to.be.deep.equal(accum);
        expect(0).to.be.equal(counter);
        expect(false).to.be.equal(this.OBSERVABLE$.isEnable);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
        this.OBSERVABLE$.enable();
        this.OBSERVABLE$.stream(streamArr);
        expect(streamArr).to.be.deep.equal(accum);
        expect(3).to.be.equal(counter);
        expect(true).to.be.equal(this.OBSERVABLE$.isEnable);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
    }
}
