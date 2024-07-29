import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";
import {IOrder} from "../src/Libraries/Observables/Types";

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
        // // @ts-ignore
        // const once = subscribeObject.once;
        // // @ts-ignore
        // expect(once.isOnce).to.be.equal(false);
        // // @ts-ignore
        // expect(once.isFinished).to.be.equal(false);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
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

    @test 'unsubscribe one by subject twice'() {
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
        // expect(subscribeObject.once.isOnce).to.be.equal(true);
        // @ts-ignore
        // expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
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
        // expect(subscribeObject.once.isOnce).to.be.equal(true);
        for (; counter < 10; counter++) this.OBSERVABLE$.next(str[counter]);
        // @ts-ignore
        // expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
    }

    @test 'Add bad pipe'() {
        const str = '0123456789';
        this.OBSERVABLE$.pipe();
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    // @test 'Add one by pipe and "unsubscribeByNegative true"'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const str = '0123456789';
    //     const listener = (value: string) => expect(value).to.be.equal(str);
    //     const condition = () => true;
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .unsubscribeByNegative(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     this.OBSERVABLE$.next(str);
    //     // @ts-ignore
    //     // expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "unsubscribeByNegative false"'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const str = '0123456789';
    //     const listener = (value: string) => expect(value).to.be.equal(null);
    //     const condition = () => false;
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .unsubscribeByNegative(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     this.OBSERVABLE$.next(str);
    //     // @ts-ignore
    //     // expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(0);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "unsubscribeByNegative" (5 positive, 5 negative)'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     }
    //     let counter = 0;
    //     const str = '0123456789';
    //     const listener = (value: string) => expect(value).to.be.equal(str[counter]);
    //     const condition = () => counter < 5;
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .unsubscribeByNegative(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     for (; counter < 10; counter++) {
    //         this.OBSERVABLE$.next(str[counter]);
    //     }
    //     // @ts-ignore
    //     // expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(0);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Try use .unsubscribeByNegative(condition) when "condition" is undefined'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(true).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     }
    //     const str = '0123456789';
    //     const dataArr: string[] = [];
    //     const listener = (value: string) => dataArr.push(value);
    //     this.OBSERVABLE$
    //         .pipe()
    //         .unsubscribeByNegative(undefined)
    //         .subscribe(listener, errorHandler);
    //     this.OBSERVABLE$.next(str);
    //     expect([]).to.be.eql(dataArr);
    //     expect(1).to.be.equal(this.OBSERVABLE$.size());
    //     expect(1).to.be.equal(errorCounter);
    // }

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
            .unsubscribeBy(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        // expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
    }

    @test 'Add one by pipe and "unsubscribeBy true"'() {
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
            .unsubscribeBy(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        // expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
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
            .unsubscribeBy(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        // expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
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
            .unsubscribeBy(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        // expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
    }

    @test 'Try use .unsubscribeByPositive(condition) when "condition" is undefined'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const dataArr: string[] = [];
        const listener = (value: string) => dataArr.push(value);
        this.OBSERVABLE$
            .pipe()
            .unsubscribeBy(undefined)
            .subscribe(listener, errorHandler);
        this.OBSERVABLE$.next(str);
        expect([]).to.be.eql(dataArr);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
        expect(1).to.be.equal(errorCounter);
    }

    // @test 'Add one by pipe and "emitByNegative true"'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const str = '0123456789';
    //     const listener = (value: string) => expect(value).to.be.equal(null);
    //     const condition = () => true;
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitByNegative(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     this.OBSERVABLE$.next(str);
    //     // @ts-ignore
    //     // expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "emitByNegative false"'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const str = '0123456789';
    //     const listener = (value: string) => expect(value).to.be.equal(str);
    //     const condition = () => false;
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitByNegative(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     this.OBSERVABLE$.next(str);
    //     // @ts-ignore
    //     // expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "emitByNegative" (5 negative, 5 positive)'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     let counter = 0;
    //     const str = '0123456789';
    //     const listener = (value: string) => {
    //         expect(value).to.be.equal(str[counter]);
    //         expect(true).to.be.equal(counter > -1 && counter < 5);
    //     };
    //     const condition = () => counter > 4;
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitByNegative(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     for (; counter < 10; counter++) {
    //         this.OBSERVABLE$.next(str[counter]);
    //     }
    //     // @ts-ignore
    //     // expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "emitByNegative" (5 positive 5 negative)'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     let counter = 0;
    //     const str = '0123456789';
    //     const listener = (value: string) => {
    //         expect(value).to.be.equal(str[counter]);
    //         expect(true).to.be.equal(counter > 4 && counter < 10);
    //     };
    //     const condition = () => counter < 5;
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitByNegative(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     for (; counter < 10; counter++) {
    //         this.OBSERVABLE$.next(str[counter]);
    //     }
    //     // @ts-ignore
    //     // expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Try use .emitByNegative(condition) when "condition" is undefined'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(true).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const str = '0123456789';
    //     const dataArr: string[] = [];
    //     const listener = (value: string) => dataArr.push(value);
    //     this.OBSERVABLE$
    //         .pipe()
    //         .emitByNegative(undefined)
    //         .subscribe(listener, errorHandler);
    //     this.OBSERVABLE$.next(str);
    //     expect([]).to.be.eql(dataArr);
    //     expect(1).to.be.equal(this.OBSERVABLE$.size());
    //     expect(1).to.be.equal(errorCounter);
    // }

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
            .refine(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        // expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
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
            .refine(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
        // @ts-ignore
        // expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
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
            .refine(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        // expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
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
            .refine(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        // expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        expect(0).to.be.equal(errorCounter);
        subscribeObject.unsubscribe();
    }

    @test 'Try use .emitByPositive(condition) when "condition" is undefined'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const str = '0123456789';
        const dataArr: string[] = [];
        const listener = (value: string) => dataArr.push(value);
        this.OBSERVABLE$
            .pipe()
            .refine(undefined)
            .subscribe(listener, errorHandler);
        this.OBSERVABLE$.next(str);
        expect([]).to.be.eql(dataArr);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
        expect(1).to.be.equal(errorCounter);
    }

    // @test 'Add one by pipe and "emitMatch true"'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const str = '0123456789';
    //     const condition = () => '0123456789';
    //     const listener = (value: string) => expect(value).to.be.equal(str);
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitMatch(condition)
    //         .subscribe(listener, errorHandler);
    //     // @ts-ignore
    //     // expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "emitMatch false"'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     // const str = '0123456789';
    //     const condition = () => '0123456789';
    //     const listener = (value: string) => expect(value).to.be.equal(null);
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitMatch(condition)
    //         .subscribe(listener, errorHandler);
    //     // @ts-ignore
    //     // expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "emitMatch 10 elements" (on value "0")'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     let counter = 0;
    //     const str = '0123456789';
    //     const listener = (value: string) => {
    //         expect(value).to.be.equal('0');
    //         expect(true).to.be.equal(counter === 0);
    //     };
    //     const condition = () => '0';
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitMatch(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     for (; counter < 10; counter++) {
    //         this.OBSERVABLE$.next(str[counter]);
    //     }
    //     // @ts-ignore
    //     // expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "emitMatch 10 elements" (on value "9")'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     let counter = 0;
    //     const str = '0123456789';
    //     const listener = (value: string) => {
    //         expect(value).to.be.equal('9');
    //         expect(true).to.be.equal(counter === 9);
    //     };
    //     const condition = () => '9';
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitMatch(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     for (; counter < 10; counter++) {
    //         this.OBSERVABLE$.next(str[counter]);
    //     }
    //     // @ts-ignore
    //     // expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Add one by pipe and "emitMatch 10 elements" (on value "5")'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     let counter = 0;
    //     const str = '0123456789';
    //     const listener = (value: string) => {
    //         expect(value).to.be.equal('5');
    //         expect(true).to.be.equal(counter === 5);
    //     };
    //     const condition = () => '5';
    //     const subscribeObject = this.OBSERVABLE$
    //         .pipe()
    //         .emitMatch(condition)
    //         .subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     for (; counter < 10; counter++) {
    //         this.OBSERVABLE$.next(str[counter]);
    //     }
    //     // @ts-ignore
    //     // expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

    // @test 'Try use .emitMatch(condition) when "condition" is undefined'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(true).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const str = '0123456789';
    //     const dataArr: string[] = [];
    //     const listener = (value: string) => dataArr.push(value);
    //     this.OBSERVABLE$
    //         .pipe()
    //         .emitMatch(undefined)
    //         .subscribe(listener, errorHandler);
    //     this.OBSERVABLE$.next(str);
    //     expect([]).to.be.eql(dataArr);
    //     expect(1).to.be.equal(this.OBSERVABLE$.size());
    //     expect(1).to.be.equal(errorCounter);
    // }

    // @test 'pause / resume'() {
    //     let errorCounter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     let counter = 0;
    //     let accumulatorStr = '';
    //     const str = '0123456789';
    //     const listener = (value: string) => accumulatorStr += value;
    //     const subscribeObject = this.OBSERVABLE$.subscribe(listener, errorHandler);
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     for (; counter < 10; counter++) {
    //         (counter === 4) && (<IPause><any>subscribeObject).pause();
    //         (counter === 8) && (<IPause><any>subscribeObject).resume();
    //         this.OBSERVABLE$.next(str[counter]);
    //     }
    //     expect(this.OBSERVABLE$.size()).to.be.equal(1);
    //     expect(accumulatorStr).to.be.equal('012389');
    //     expect(0).to.be.equal(errorCounter);
    //     subscribeObject.unsubscribe();
    // }

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
            .refine(() => {
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
            .refine((data) => +data < 2)
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

    @test 'pipe chain emitByPositive'() {
        let errorCounter = 0;
        let counter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            if (counter === 1) expect("11315").to.be.equal(data);
            if (counter === 2) expect("22325").to.be.equal(data);
        };
        this.OBSERVABLE$.pipe()
            .refine(data => data.length === 5)
            .refine(data => data[2] === "3")
            .refine(data => data[4] === "5")
            .subscribe(listener1, errorHandler);

        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("1234");
        this.OBSERVABLE$.next("11111");
        this.OBSERVABLE$.next("11115");
        this.OBSERVABLE$.next("1");
        this.OBSERVABLE$.next("22325");

        expect(2).to.be.equal(counter);
        expect(0).to.be.equal(errorCounter);
    }

    // @test 'pipe chain emitByNegative'() {
    //     let errorCounter = 0;
    //     let counter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         console.log("==================> ERROR", errorMessage);
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const listener1 = (data: string) => {
    //         counter++;
    //         if (counter === 1) expect("1234").to.be.equal(data);
    //         if (counter === 2) expect("11111").to.be.equal(data);
    //         if (counter === 3) expect("11115").to.be.equal(data);
    //     };
    //     this.OBSERVABLE$.pipe()
    //         .emitByNegative(data => data.length === 1)
    //         .emitByNegative(data => data === "22325")
    //         .emitByNegative(data => data === "11315")
    //         .subscribe(listener1, errorHandler);
    //
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("1234");
    //     this.OBSERVABLE$.next("11111");
    //     this.OBSERVABLE$.next("11115");
    //     this.OBSERVABLE$.next("1");
    //     this.OBSERVABLE$.next("22325");
    //
    //     expect(3).to.be.equal(counter);
    //     expect(0).to.be.equal(errorCounter);
    // }

    // @test 'pipe chain emitByNegative + emitByPositive'() {
    //     let errorCounter = 0;
    //     let counter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         console.log("==================> ERROR", errorMessage);
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const listener1 = (data: string) => {
    //         counter++;
    //         if (counter === 1) expect("1").to.be.equal(data);
    //         if (counter === 2) expect("345").to.be.equal(data);
    //     };
    //     this.OBSERVABLE$.pipe()
    //         .emitByPositive(data => data.length < 5)
    //         .emitByNegative(data => data.includes("2"))
    //         .subscribe(listener1, errorHandler);
    //
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("1234");
    //     this.OBSERVABLE$.next("11111");
    //     this.OBSERVABLE$.next("11115");
    //     this.OBSERVABLE$.next("1");
    //     this.OBSERVABLE$.next("345");
    //     this.OBSERVABLE$.next("22325");
    //
    //     expect(2).to.be.equal(counter);
    //     expect(0).to.be.equal(errorCounter);
    // }

    @test 'pipe chain emitByPositive + once'() {
        let errorCounter = 0;
        let counter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            if (counter === 1) expect("1234").to.be.equal(data);
        };
        this.OBSERVABLE$.pipe()
            .refine(data => data.length < 5)
            .setOnce()
            .subscribe(listener1, errorHandler);

        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11111");
        this.OBSERVABLE$.next("11115");
        this.OBSERVABLE$.next("1234");
        this.OBSERVABLE$.next("1");
        this.OBSERVABLE$.next("345");
        this.OBSERVABLE$.next("22325");

        expect(1).to.be.equal(counter);
        expect(0).to.be.equal(errorCounter);
    }

    // @test 'pipe chain emitMatch'() {
    //     let errorCounter = 0;
    //     let counter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         console.log("==================> ERROR", errorMessage);
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const listener1 = (data: string) => {
    //         counter++;
    //         if (counter === 1) expect("11315").to.be.equal(data);
    //     };
    //     this.OBSERVABLE$.pipe()
    //         .emitMatch(() => "11315")
    //         .subscribe(listener1, errorHandler);
    //
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11111");
    //     this.OBSERVABLE$.next("11115");
    //     this.OBSERVABLE$.next("1234");
    //     this.OBSERVABLE$.next("1");
    //     this.OBSERVABLE$.next("345");
    //     this.OBSERVABLE$.next("22325");
    //
    //     expect(1).to.be.equal(counter);
    //     expect(0).to.be.equal(errorCounter);
    // }

    // @test 'pipe chain emitMatch + emitMatch collision'() {
    //     let errorCounter = 0;
    //     let counter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         console.log("==================> ERROR", errorMessage);
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const listener1 = () => {
    //         counter++;
    //     };
    //     this.OBSERVABLE$.pipe()
    //         .emitMatch(() => "11315")
    //         .emitMatch(() => "1")
    //         .subscribe(listener1, errorHandler);
    //
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11111");
    //     this.OBSERVABLE$.next("11115");
    //     this.OBSERVABLE$.next("1234");
    //     this.OBSERVABLE$.next("1");
    //     this.OBSERVABLE$.next("345");
    //     this.OBSERVABLE$.next("22325");
    //
    //     expect(0).to.be.equal(counter);
    //     expect(0).to.be.equal(errorCounter);
    // }

    // @test 'pipe chain emitMatch + once'() {
    //     let errorCounter = 0;
    //     let counter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         console.log("==================> ERROR", errorMessage);
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const listener1 = (data: string) => {
    //         counter++;
    //         if (counter === 1) expect("11315").to.be.equal(data);
    //     };
    //     this.OBSERVABLE$.pipe()
    //         .emitMatch(() => "11315")
    //         .setOnce()
    //         .subscribe(listener1, errorHandler);
    //
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //
    //     expect(1).to.be.equal(counter);
    //     expect(0).to.be.equal(errorCounter);
    // }

    @test 'pipe chain unsubscribeByPositive'() {
        let errorCounter = 0;
        let counter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            expect("11315").to.be.equal(data);
        };
        this.OBSERVABLE$.pipe()
            .unsubscribeBy(data => data === "11")
            .refine((str) => str === "11315")
            .subscribe(listener1, errorHandler);

        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11");
        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11315");
        this.OBSERVABLE$.next("11315");

        expect(4).to.be.equal(counter);
        expect(0).to.be.equal(errorCounter);
    }

    // @test 'pipe chain unsubscribeByNegative'() {
    //     let errorCounter = 0;
    //     let counter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         console.log("==================> ERROR", errorMessage);
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const listener1 = (data: string) => {
    //         counter++;
    //         expect("11315").to.be.equal(data);
    //     };
    //     this.OBSERVABLE$.pipe()
    //         .unsubscribeByNegative(data => data === "11315")
    //         .emitMatch(() => "11315")
    //         .subscribe(listener1, errorHandler);
    //
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //
    //     expect(4).to.be.equal(counter);
    //     expect(0).to.be.equal(errorCounter);
    // }

    // @test 'pipe chain unsubscribeByNegative + unsubscribeByPositive'() {
    //     let errorCounter = 0;
    //     let counter = 0;
    //     const errorHandler = (errorData: any, errorMessage: any) => {
    //         console.log("==================> ERROR", errorMessage);
    //         expect(false).to.be.equal(!!errorMessage);
    //         errorCounter++;
    //     };
    //     const listener1 = (data: string) => {
    //         counter++;
    //         expect("11315").to.be.equal(data);
    //     };
    //     this.OBSERVABLE$.pipe()
    //         .unsubscribeByNegative(data => data.length === 5)
    //         .unsubscribeByPositive(data => data === "22222")
    //         .emitMatch(() => "11315")
    //         .subscribe(listener1, errorHandler);
    //
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("22222");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //     this.OBSERVABLE$.next("11315");
    //
    //     expect(2).to.be.equal(counter);
    //     expect(0).to.be.equal(errorCounter);
    // }

    @test 'subscribe observable'() {
        let errorCounter = 0;
        let counter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };

        const observable1 = new Observable("");
        const observable2 = new Observable("");

        const listener1 = (data: string) => {
            counter++;
            expect(data).to.be.equal('test');
        }
        const listener2 = (data: string) => {
            counter++;
            expect(data).to.be.equal('test');
        }
        const listener3 = (data: string) => {
            counter++;
            expect(data).to.be.equal('test');
        }

        observable1.subscribe(listener1, errorHandler);
        observable2.subscribe(listener2, errorHandler);

        this.OBSERVABLE$.subscribe(observable1, errorHandler);
        this.OBSERVABLE$.subscribe(observable2, errorHandler);
        this.OBSERVABLE$.subscribe(listener3, errorHandler);

        this.OBSERVABLE$.next('test');

        expect(3).to.be.equal(counter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'subscribe observable with pipe'() {
        let errorCounter = 0;
        let counter1 = 0;
        let counter2 = 0;
        let counter3 = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };

        const observable1 = new Observable("");
        const observable2 = new Observable("");

        const listener1 = (data: string) => {
            counter1++;
            expect(data).to.be.equal('test1');
        }
        const listener2 = (data: string) => {
            counter2++;
            expect(data).to.be.equal('test2');
        }
        const listener3 = () => {
            counter3++;
        }

        observable1.subscribe(listener1, errorHandler);
        observable2.subscribe(listener2, errorHandler);

        this.OBSERVABLE$.pipe()
            .refine((str) => str === 'test1')
            .subscribe(observable1, errorHandler);
        this.OBSERVABLE$.pipe()
            .refine((str) => str === 'test2')
            .subscribe(observable2, errorHandler);
        this.OBSERVABLE$.subscribe(listener3, errorHandler);

        this.OBSERVABLE$.next('test1');
        this.OBSERVABLE$.next('test1');
        this.OBSERVABLE$.next('test1');
        this.OBSERVABLE$.next('test1');

        this.OBSERVABLE$.next('test2');
        this.OBSERVABLE$.next('test2');
        this.OBSERVABLE$.next('test2');

        expect(4).to.be.equal(counter1);
        expect(3).to.be.equal(counter2);
        expect(7).to.be.equal(counter3);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'pipe chain switch/case'() {
        let errorCounter = 0;
        let counter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const listener1 = (data: string) => {
            counter++;
            if (counter === 1) expect("111").to.be.equal(data);
            if (counter === 2) expect("222").to.be.equal(data);
            if (counter === 3) expect("333").to.be.equal(data);
            if (counter === 4) expect("333").to.be.equal(data);
        };
        this.OBSERVABLE$.pipe()
            .switch()
            .case(data => data === "111")
            .case(data => data === "222")
            .case(data => data === "333")
            .subscribe(listener1, errorHandler);

        this.OBSERVABLE$.next("111");
        this.OBSERVABLE$.next("1234");
        this.OBSERVABLE$.next("11111");
        this.OBSERVABLE$.next("11115");
        this.OBSERVABLE$.next("1");
        this.OBSERVABLE$.next("22325");
        this.OBSERVABLE$.next("222");
        this.OBSERVABLE$.next("333");
        this.OBSERVABLE$.next("333");

        expect(4).to.be.equal(counter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'pipe chain emitByPositive + switch/case'() {
        let errorCounter = 0;
        let counter = 0;

        const GENDER = {
            MAN: "MAN",
            WOMAN: "WOMAN"
        }

        const MAJOR = {
            DOCTOR: "DOCTOR",
            LAWYER: "LAWYER",
            ACTOR: "ACTOR",
            DRIVER: "DRIVER",
            FARMER: "FARMER",
            CHILD: "CHILD",
        }

        class Person {
            constructor(public name, public age, public gender, public major) {
                this.name = name;
                this.age = age;
                this.gender = gender;
                this.major = major;
            }
        }

        const observable$ = new Observable<Person>(null);

        const manFilter = person => person.gender === GENDER.MAN;
        const manListener = person => {
            counter++
            console.log("=> manListener", person);
            if (counter === 1) {
                expect(person.gender).to.be.equal(GENDER.MAN);
                expect(true).to.be.equal(person.age > 17 && person.age < 60);
            }
            if (counter === 2) {
                expect(person.gender).to.be.equal(GENDER.MAN);
                expect(true).to.be.equal(person.age > 17 && person.age < 60);
            }
        };

        observable$.pipe()
            .refine(manFilter)
            .switch()
            .case(person => person.age > 17 && person.age < 60)
            .case(person => person.major === MAJOR.FARMER)
            .subscribe(manListener);

        observable$.stream([
            new Person("Andrey", 16, GENDER.MAN, MAJOR.CHILD),
            new Person("Irog", 6, GENDER.MAN, MAJOR.CHILD),
            new Person("Dasha", 18, GENDER.WOMAN, MAJOR.FARMER),
            new Person("Tolya", 10, GENDER.MAN, MAJOR.CHILD),
            new Person("Kostya", 35, GENDER.MAN, MAJOR.DRIVER),
            new Person("Natasha", 60, GENDER.WOMAN, MAJOR.ACTOR),
            new Person("Kiril", 25, GENDER.MAN, MAJOR.FARMER),
            new Person("Karina", 30, GENDER.WOMAN, MAJOR.DOCTOR),
            new Person("Sofia", 45, GENDER.WOMAN, MAJOR.LAWYER),
            new Person("Judy", 55, GENDER.WOMAN, MAJOR.DOCTOR),
        ])


        expect(2).to.be.equal(counter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'pipe chain and group of listeners'() {
        let errorCounter = 0;
        let counter = 0;
        let counter1 = 0;
        let counter2 = 0;
        let counter3 = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            errorCounter++;
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
        };
        const globalCounter = () => counter++;
        const listener1 = (str) => {
            counter1++;
            expect("111").to.be.equal(str);
        };
        const listener2 = (str) => {
            counter2++;
            expect("222").to.be.equal(str);
        };
        const listener3 = (str) => {
            counter3++;
            expect("333").to.be.equal(str);
        };


        const observable1 = new Observable("");
        const observable2 = new Observable("");
        const observable3 = new Observable("");

        observable1.pipe()
            .refine((str) => str === "111")
            .subscribe(listener1);

        observable2.pipe()
            .refine((str) => str === "222")
            .subscribe(listener2);

        observable3.pipe()
            .refine((str) => str === "333")
            .subscribe(listener3);

        this.OBSERVABLE$.pipe()
            .refine(data => data.length > 2)
            .subscribe([
                globalCounter,
                observable1,
                observable2,
                observable3
            ], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "1",
            "111",
            "111",
            "1",
            "222",
            "1",
            "222",
            "222",
            "444",
            "333",
            "444",
            "444",
        ]);

        expect(2).to.be.equal(counter1);
        expect(3).to.be.equal(counter2);
        expect(1).to.be.equal(counter3);
        expect(9).to.be.equal(counter);
        expect(0).to.be.equal(errorCounter);
    }

    @test '1 filter test'() {
        let errorCounter = 0;
        let counter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => counter++;
        const targetListener = (str) => {
            targetCounter++;
            expect("0").to.be.equal(str);
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .filter(str => str === "0");
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "1",
            "0",
            "1",
            "1",
            "1",
            "0",
            "1",
            "1",
            "1",
            "0",
            "1",
        ]);

        expect(12).to.be.equal(counter);
        expect(3).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test '2 filters test'() {
        let errorCounter = 0;
        let counter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => counter++;
        const targetListener = (str) => {
            targetCounter++;
            if (targetCounter === 1) expect("10").to.be.equal(str);
            if (targetCounter === 2) expect("011").to.be.equal(str);
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .filter(str => str.length > 1)
            .filter(str => str.includes("0"));
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "10",
            "1",
            "0",
            "11",
            "1",
            "1",
            "011",
            "1",
            "11111111222",
            "1",
            "0",
            "1",
        ]);

        expect(12).to.be.equal(counter);
        expect(2).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test '2 filters test + switch-case'() {
        let errorCounter = 0;
        let counter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => counter++;
        const targetListener = (str) => {
            targetCounter++;
            if (targetCounter === 1) expect("011").to.be.equal(str);
            if (targetCounter === 2) expect("011").to.be.equal(str);
            if (targetCounter === 3) expect("011").to.be.equal(str);
            if (targetCounter === 4) expect("111100011").to.be.equal(str);
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .filter(str => str.length > 1)
            .filter(str => str.includes("0"))
            .switch()
            .case(str => str === "011")
            .case(str => str === "111100011");
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "10",
            "1",
            "0",
            "11",
            "1",
            "1",
            "011",
            "011",
            "011",
            "1",
            "11111111",
            "111100011",
            "1",
            "0",
            "1",
        ]);

        expect(15).to.be.equal(counter);
        expect(4).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test '2 filter switch-case'() {
        let errorCounter = 0;
        let counter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => counter++;
        const targetListener = (str) => {
            targetCounter++;
            if (targetCounter === 1) expect("011").to.be.equal(str);
            if (targetCounter === 2) expect("011").to.be.equal(str);
            if (targetCounter === 3) expect("011").to.be.equal(str);
            if (targetCounter === 4) expect("111100011").to.be.equal(str);
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .switch()
            .case(str => str === "011")
            .case(str => str === "111100011");
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "10",
            "1",
            "0",
            "11",
            "1",
            "1",
            "011",
            "011",
            "011",
            "1",
            "11111111",
            "111100011",
            "1",
            "0",
            "1",
        ]);

        expect(15).to.be.equal(counter);
        expect(4).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test '2 filter switch-case without errorHandler'() {
        let counter = 0;
        let targetCounter = 0;

        const globalCounter = () => counter++;
        const targetListener = (str) => {
            targetCounter++;
            if (targetCounter === 1) expect("011").to.be.equal(str);
            if (targetCounter === 2) expect("011").to.be.equal(str);
            if (targetCounter === 3) expect("011").to.be.equal(str);
            if (targetCounter === 4) expect("111100011").to.be.equal(str);
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter()
            .switch()
            .case(str => str === "011")
            .case(str => str === "111100011");
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$]);

        this.OBSERVABLE$.stream([
            "10",
            "1",
            "0",
            "11",
            "1",
            "1",
            "011",
            "011",
            "011",
            "1",
            "11111111",
            "111100011",
            "1",
            "0",
            "1",
        ]);

        expect(15).to.be.equal(counter);
        expect(4).to.be.equal(targetCounter);
    }

    @test '2 filter switch-case with throw ERROR'() {
        let errorCounter = 0;
        let counter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => counter++;
        const targetListener = (str) => {
            targetCounter++;
            if (targetCounter === 1) expect("011").to.be.equal(str);
            if (targetCounter === 2) expect("011").to.be.equal(str);
            if (targetCounter === 3) expect("011").to.be.equal(str);
            if (targetCounter === 4) expect("111100011").to.be.equal(str);
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .switch()
            .case(str => str === "011")
            .case(str => {
                console.log(str === "111100011");
                throw new Error("This is an error message");
            });
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "10",
            "1",
            "0",
            "11",
            "1",
            "1",
            "011",
            "011",
            "011",
            "1",
            "11111111",
            "111100011",
            "1",
            "0",
            "1",
        ]);

        expect(15).to.be.equal(counter);
        expect(3).to.be.equal(targetCounter);
        expect(12).to.be.equal(errorCounter);
    }

    @test '2 filter switch-case with throw ERROR by default'() {
        let counter = 0;
        let targetCounter = 0;
        const globalCounter = () => counter++;
        const targetListener = (str) => {
            targetCounter++;
            if (targetCounter === 1) expect("011").to.be.equal(str);
            if (targetCounter === 2) expect("011").to.be.equal(str);
            if (targetCounter === 3) expect("011").to.be.equal(str);
            if (targetCounter === 4) expect("111100011").to.be.equal(str);
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter()
            .switch()
            .case(str => str === "011")
            .case(str => {
                console.log(str === "111100011");
                throw new Error("This is an error message");
            });
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$]);

        this.OBSERVABLE$.stream([
            "10",
            "1",
            "0",
            "11",
            "1",
            "1",
            "011",
            "011",
            "011",
            "1",
            "11111111",
            "111100011",
            "1",
            "0",
            "1",
        ]);

        expect(15).to.be.equal(counter);
        expect(3).to.be.equal(targetCounter);
    }

    @test 'filters arr'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .filter(str => str.includes("1"))
            .pushFilters([
                str => str.includes("2"),
                str => str.length < 5,
            ]);
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "12",
            "123",
            "123",
            "1234",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
        ]);

        expect(12).to.be.equal(glCounter);
        expect(4).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'filters arr (pushFilters not array)'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .filter(str => str.includes("1"))
            .pushFilters(<any>"10")
            .filter(str => str.includes("5"));
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "12",
            "123",
            "123",
            "1234",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
        ]);

        expect(12).to.be.equal(glCounter);
        expect(7).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'filters cases arr'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .switch()
            .pushCases([
                str => str.includes("2"),
                str => str.includes("5"),
            ])
            .case(str => str.includes("7"));
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
        ]);

        expect(16).to.be.equal(glCounter);
        expect(5).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'filters cases arr (pushCases not array)'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$.addFilter(errorHandler)
            .switch()
            .case(str => str.includes("7"))
            .pushCases(<any>10)
            .case(str => str.includes("6"));
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
        ]);

        expect(16).to.be.equal(glCounter);
        expect(3).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'refine arr'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$
            .pipe()
            .refine(str => str.includes("1"))
            .pushRefiners([
                str => str.includes("2"),
                str => str.length < 5,
            ])
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "12",
            "123",
            "123",
            "1234",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
        ]);

        expect(12).to.be.equal(glCounter);
        expect(4).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'refine arr (pushRefiners not array)'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$.pipe()
            .refine(str => str.includes("1"))
            .pushRefiners(<any>"10")
            .refine(str => str.includes("5"))
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "12",
            "123",
            "123",
            "1234",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
        ]);

        expect(12).to.be.equal(glCounter);
        expect(7).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'pipe cases arr'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$.pipe()
            .switch()
            .pushCases([
                str => str.includes("2"),
                str => str.includes("5"),
            ])
            .case(str => str.includes("7"))
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
        ]);

        expect(16).to.be.equal(glCounter);
        expect(5).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'pipe cases arr (pushCases not array)'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$.pipe()
            .switch()
            .case(str => str.includes("7"))
            .pushCases(<any>10)
            .case(str => str.includes("6"))
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
        ]);

        expect(16).to.be.equal(glCounter);
        expect(3).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'then by arr'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = () => {
            targetCounter++;
        };
        const targetObservable$ = new Observable("");
        targetObservable$
            .pipe()
            .refine(str => str.includes("2"))
            .then<number>(str => str.length)
            .refine(num => num > 3)
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "12",
            "123",
            "123",
            "1234",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
        ]);

        expect(12).to.be.equal(glCounter);
        expect(8).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'then by arr once'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = (num: number) => {
            targetCounter++;
            expect(5).to.be.equal(num);
        };
        const targetObservable$ = new Observable("");
        targetObservable$
            .pipe()
            .refine(str => str.includes("2"))
            .then<number>(str => str.length)
            .refine(num => num > 4)
            .setOnce()
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "12",
            "123",
            "123",
            "1234",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
        ]);

        expect(12).to.be.equal(glCounter);
        expect(1).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'then by arr once and multiply'() {
        let errorCounter = 0;
        let glCounter = 0;
        let targetCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            console.log("==================> ERROR", errorMessage);
            expect(true).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const globalCounter = () => glCounter++;
        const targetListener = (num: number) => {
            targetCounter++;
            expect(10).to.be.equal(num);
        };
        const targetObservable$ = new Observable("");
        targetObservable$
            .pipe()
            .refine(str => str.includes("2"))
            .then<number>(str => str.length)
            .refine(num => num > 4)
            .then<number>(num => num * 2)
            .setOnce()
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.stream([
            "1",
            "12",
            "123",
            "123",
            "1234",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
            "12345",
        ]);

        expect(12).to.be.equal(glCounter);
        expect(1).to.be.equal(targetCounter);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'serialize'() {
        const rawObject: { x: number, y: number } = {x: 10, y: 20};
        const listener = (data: string) => {
            expect(data).to.be.a("string");
            const deserialized: { x: number, y: number; } = JSON.parse(data);
            expect(10).to.be.equal(deserialized.x);
            expect(20).to.be.equal(deserialized.y);
        };

        const observable = new Observable<{ x: number, y: number }>(null);
        observable
            .pipe()
            .serialize()
            .subscribe(listener);
        observable.next(rawObject);
    }

    @test 'deserialize'() {
        const rawObject: { x: number, y: number } = {x: 10, y: 20};
        const json: string = JSON.stringify(rawObject);
        const listener = (data: { x: number, y: number }) => {
            expect(10).to.be.equal(data.x);
            expect(20).to.be.equal(data.y);
        };

        const observable = new Observable<string>("");
        observable
            .pipe()
            .deserialize<{ x: number, y: number }>()
            .subscribe(listener);
        observable.next(json);
    }
}
