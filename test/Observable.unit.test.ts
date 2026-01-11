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
        expect(this.OBSERVABLE$.getValue()).to.be.equal('');
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one subscriber'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const subscribeObject = this.OBSERVABLE$.subscribe((value: string) => console.log(value), errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
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
            .once()
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
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
            .once()
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
            .once()
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) this.OBSERVABLE$.next(str[counter]);
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
            .and(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
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
            .and(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        this.OBSERVABLE$.next(str);
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
            .and(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
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
            .and(condition)
            .subscribe(listener, errorHandler);
        expect(this.OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.OBSERVABLE$.next(str[counter]);
        }
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
            .and(undefined)
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
        expect(this.OBSERVABLE$.getValue()).to.be.undefined;
        expect(this.OBSERVABLE$.size()).to.be.equal(0);
        expect(0).to.be.equal(errorCounter);
    }

    @test 'destroy during emission (async cleanup)'() {
        let errorCounter = 0;
        const errorHandler = (errorData: any, errorMessage: any) => {
            expect(false).to.be.equal(!!errorMessage);
            errorCounter++;
        };
        const observable$ = new Observable<number>(0);
        let callCount = 0;

        // Listener that calls destroys during emission
        const listener = (value: number) => {
            callCount++;
            if (value === 2) {
                observable$.destroy(); // destroy while process=true
            }
        };

        observable$.subscribe(listener, errorHandler);
        expect(observable$.size()).to.be.equal(1);

        observable$.next(1);
        observable$.next(2); // This triggers destroyed during emission
        observable$.next(3); // Should not be processed (killed=true)

        expect(callCount).to.be.equal(2);
        expect(observable$.isDestroyed).to.be.equal(true);
        expect(0).to.be.equal(errorCounter);

        // Wait for Promise.resolve().then() to complete
        return new Promise<void>(resolve => {
            setTimeout(() => {
                expect(observable$.getValue()).to.be.undefined;
                expect(observable$.size()).to.be.equal(0);
                resolve();
            }, 0);
        });
    }

    @test 'destroy called twice (idempotent)'() {
        const observable$ = new Observable<number>(42);
        observable$.subscribe((value: number) => {});

        expect(observable$.isDestroyed).to.be.equal(false);

        observable$.destroy();
        expect(observable$.isDestroyed).to.be.equal(true);

        // The second call should be no-op (line 162 branch)
        observable$.destroy();
        expect(observable$.isDestroyed).to.be.equal(true);
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
        (subscribeObject as any).observer = 0;
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
        (subscribeObject as any).listener = 0;
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
            .and(() => {
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
        this.OBSERVABLE$.of(streamArr);
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
            .and((data) => +data < 2)
            .subscribe(listener1, errorHandler);
        this.OBSERVABLE$.of(streamArr);
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
        this.OBSERVABLE$.of(streamArr);
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
        this.OBSERVABLE$.of(streamArr);
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
        this.OBSERVABLE$.of(streamArr);
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
        this.OBSERVABLE$.of(streamArr);
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
        this.OBSERVABLE$.of(streamArr);
        expect([]).to.be.deep.equal(accum);
        expect(0).to.be.equal(counter);
        expect(false).to.be.equal(this.OBSERVABLE$.isEnable);
        expect(1).to.be.equal(this.OBSERVABLE$.size());
        this.OBSERVABLE$.enable();
        this.OBSERVABLE$.of(streamArr);
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
            .and(data => data.length === 5)
            .and(data => data[2] === "3")
            .and(data => data[4] === "5")
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
            .and(data => data.length < 5)
            .once()
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
    //         .once()
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
            .and((str) => str === "11315")
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
            .and((str) => str === 'test1')
            .subscribe(observable1, errorHandler);
        this.OBSERVABLE$.pipe()
            .and((str) => str === 'test2')
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
            .choice()
            .or(data => data === "111")
            .or(data => data === "222")
            .or(data => data === "333")
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
            .and(manFilter)
            .choice()
            .or(person => person.age > 17 && person.age < 60)
            .or(person => person.major === MAJOR.FARMER)
            .subscribe(manListener);

        observable$.of([
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
            .and((str) => str === "111")
            .subscribe(listener1);

        observable2.pipe()
            .and((str) => str === "222")
            .subscribe(listener2);

        observable3.pipe()
            .and((str) => str === "333")
            .subscribe(listener3);

        this.OBSERVABLE$.pipe()
            .and(data => data.length > 2)
            .subscribe([
                globalCounter,
                observable1,
                observable2,
                observable3
            ], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str === "0");
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str.length > 1)
            .and(str => str.includes("0"));
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str.length > 1)
            .and(str => str.includes("0"))
            .choice()
            .or(str => str === "011")
            .or(str => str === "111100011");
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .choice()
            .or(str => str === "011")
            .or(str => str === "111100011");
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .choice()
            .or(str => str === "011")
            .or(str => str === "111100011");
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$]);

        this.OBSERVABLE$.of([
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
            .choice()
            .or(str => str === "011")
            .or(str => {
                console.log(str === "111100011");
                throw new Error("This is an error message");
            });
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .choice()
            .or(str => str === "011")
            .or(str => {
                console.log(str === "111100011");
                throw new Error("This is an error message");
            });
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$]);

        this.OBSERVABLE$.of([
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
            .and(str => str.includes("1"))
            .allOf([
                str => str.includes("2"),
                str => str.length < 5,
            ]);
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str.includes("1"))
            .allOf(<any>"10")
            .and(str => str.includes("5"));
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .choice()
            .anyOf([
                str => str.includes("2"),
                str => str.includes("5"),
            ])
            .or(str => str.includes("7"));
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .choice()
            .or(str => str.includes("7"))
            .anyOf(<any>10)
            .or(str => str.includes("6"));
        targetObservable$.subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str.includes("1"))
            .allOf([
                str => str.includes("2"),
                str => str.length < 5,
            ])
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str.includes("1"))
            .allOf(<any>"10")
            .and(str => str.includes("5"))
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .choice()
            .anyOf([
                str => str.includes("2"),
                str => str.includes("5"),
            ])
            .or(str => str.includes("7"))
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .choice()
            .or(str => str.includes("7"))
            .anyOf(<any>10)
            .or(str => str.includes("6"))
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str.includes("2"))
            .map<number>(str => str.length)
            .and(num => num > 3)
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str.includes("2"))
            .map<number>(str => str.length)
            .and(num => num > 4)
            .once()
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .and(str => str.includes("2"))
            .map<number>(str => str.length)
            .and(num => num > 4)
            .map<number>(num => num * 2)
            .once()
            .subscribe(targetListener);

        this.OBSERVABLE$.subscribe([globalCounter, targetObservable$], errorHandler);

        this.OBSERVABLE$.of([
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
            .toJson()
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
            .fromJson<{ x: number, y: number }>()
            .subscribe(listener);
        observable.next(json);
    }

    // ==================== EDGE CASES ====================

    @test 'unsubscribe during next() - trash logic'() {
        const observable = new Observable<number>(0);
        const received: number[] = [];
        let sub1Called = 0;
        let sub2Called = 0;

        const sub1 = observable.subscribe((value) => {
            sub1Called++;
            received.push(value * 10);
            // Unsubscribe during next()
            if (value === 2) sub1.unsubscribe();
        });

        observable.subscribe((value) => {
            sub2Called++;
            received.push(value * 100);
        });

        expect(observable.size()).to.be.equal(2);

        observable.next(1);
        observable.next(2); // sub1 unsubscribes here
        observable.next(3); // sub1 won't receive this

        expect(sub1Called).to.be.equal(2); // received 1 and 2
        expect(sub2Called).to.be.equal(3); // received 1, 2, 3
        expect(observable.size()).to.be.equal(1);
        expect(received).to.be.eql([10, 100, 20, 200, 300]);
    }

    @test 'multiple unsubscribe during single next()'() {
        const observable = new Observable<number>(0);
        const received: string[] = [];
        const subs: any[] = [];

        // Create 5 subscribers
        for (let i = 0; i < 5; i++) {
            const sub = observable.subscribe((value) => {
                received.push(`sub${i}:${value}`);
                // All odd subscribers unsubscribe when value=1
                if (value === 1 && i % 2 === 1) {
                    sub.unsubscribe();
                }
            });
            subs.push(sub);
        }

        expect(observable.size()).to.be.equal(5);

        observable.next(1); // sub1, sub3 will unsubscribe
        expect(observable.size()).to.be.equal(3);

        observable.next(2); // only sub0, sub2, sub4 will receive
        expect(received.filter(r => r.includes(':2')).length).to.be.equal(3);
    }

    @test 'pause and resume subscription'() {
        const observable = new Observable<number>(0);
        const received: number[] = [];

        const sub = observable.pipe()!.subscribe((value) => {
            received.push(value);
        });

        observable.next(1);
        expect(received).to.be.eql([1]);

        (<any>sub).pause();
        observable.next(2);
        observable.next(3);
        expect(received).to.be.eql([1]); // didn't receive 2, 3

        (<any>sub).resume();
        observable.next(4);
        expect(received).to.be.eql([1, 4]);
    }

    @test 'unSubscribe with null/undefined listener'() {
        const observable = new Observable<number>(0);
        observable.subscribe((v) => v);
        expect(observable.size()).to.be.equal(1);

        // Should not throw
        observable.unSubscribe(<any>null);
        observable.unSubscribe(<any>undefined);

        expect(observable.size()).to.be.equal(1);
    }

    @test 'size() returns 0 after destroy'() {
        const observable = new Observable<number>(0);
        observable.subscribe((v) => v);
        observable.subscribe((v) => v);
        expect(observable.size()).to.be.equal(2);

        observable.destroy();
        expect(observable.size()).to.be.equal(0);
    }

    @test 'deserialize invalid JSON triggers error handler'() {
        const observable = new Observable<string>("");
        let errorCaught = false;
        let errorValue: any = null;

        const errorHandler = (data: any, err: any) => {
            errorCaught = true;
            errorValue = data;
        };

        observable.pipe()!
            .fromJson()
            .subscribe((v) => {
                // Should not be called
                expect(true).to.be.equal(false);
            }, errorHandler);

        observable.next("invalid json {{{");

        expect(errorCaught).to.be.equal(true);
        expect(errorValue).to.be.equal("invalid json {{{");
    }

    @test 'filter blocks emission when returns false'() {
        const observable = new Observable<number>(0);
        const received: number[] = [];

        observable.addFilter().and((v) => v > 5);
        observable.subscribe((v) => received.push(v));

        observable.of([1, 2, 3, 6, 7, 4, 8]);

        expect(received).to.be.eql([6, 7, 8]);
    }

    @test 'addFilter without errorHandler uses default'() {
        const observable = new Observable<number>(0);
        const received: number[] = [];

        // addFilter without errorHandler
        observable.addFilter().and((v) => v > 0);
        observable.subscribe((v) => received.push(v));

        observable.next(1);
        observable.next(-1); // blocked by filter
        observable.next(2);

        expect(received).to.be.eql([1, 2]);
    }

    @test 'subscriber unsubscribes itself on first call via setOnce in regular subscribe'() {
        const observable = new Observable<number>(0);
        const received: number[] = [];

        // setOnce via pipe
        observable.pipe()!.once().subscribe((v) => received.push(v));

        // Also regular subscriber
        observable.subscribe((v) => received.push(v * 10));

        expect(observable.size()).to.be.equal(2);

        observable.next(1);
        expect(observable.size()).to.be.equal(1); // setOnce unsubscribed
        expect(received).to.be.eql([1, 10]);

        observable.next(2);
        expect(received).to.be.eql([1, 10, 20]); // only regular subscriber received
    }

    @test 'destroy during next() uses trash mechanism correctly'() {
        const observable = new Observable<number>(0);
        const received: number[] = [];

        // First subscriber calls destroy during next
        observable.subscribe((v) => {
            received.push(v * 10);
            if (v === 2) observable.destroy();
        });

        // The second subscriber should receive value before destruction
        observable.subscribe((v) => {
            received.push(v * 100);
        });

        observable.next(1);
        expect(received).to.be.eql([10, 100]);

        observable.next(2); // destroy is called after this next
        // Both subscribers receive the value
        expect(received).to.be.eql([10, 100, 20, 200]);

        observable.next(3); // killed, nothing happens
        expect(received).to.be.eql([10, 100, 20, 200]);
        expect(observable.isDestroyed).to.be.equal(true);
    }

    @test 'unsubscribeAll during next() is safe - uses deferred cleanup'() {
        const observable = new Observable<number>(0);
        let callCount = 0;

        observable.subscribe((v) => {
            callCount++;
            if (v === 2) observable.unsubscribeAll();
        });

        observable.subscribe((v) => {
            callCount++;
        });

        observable.next(1);
        expect(callCount).to.be.equal(2);

        observable.next(2); // unsubscribeAll is called but deferred
        // All subscribers receive the value in this cycle
        expect(callCount).to.be.equal(4);

        observable.next(3); // no one receives - all unsubscribed
        expect(callCount).to.be.equal(4);
        expect(observable.size()).to.be.equal(0);
    }

    @test 'many subscribers (100)'() {
        const observable = new Observable<string>('');
        const values: number[] = [];

        for (let i = 0; i < 100; i++) {
            const idx = i;
            observable.subscribe((value: string) => {
                values.push(idx);
            });
        }

        expect(observable.size()).to.be.equal(100);

        observable.next('test');

        expect(values.length).to.be.equal(100);
        for (let i = 0; i < 100; i++) {
            expect(values[i]).to.be.equal(i);
        }
    }

    @test 'error in subscriber does not break emission to others'() {
        const observable = new Observable<number>(0);
        let callCount = 0;
        let errorCaught = false;

        observable.subscribe(
            (value: number) => {
                throw new Error('Test error');
            },
            (err: any, msg: string) => {
                errorCaught = true;
            }
        );

        observable.subscribe((value: number) => {
            callCount++;
        });

        observable.next(42);

        expect(errorCaught).to.be.equal(true);
        expect(callCount).to.be.equal(1); // the second subscriber still called
    }

    @test 'advanced usage: filters, pipes, switch/case, observable-to-observable'() {
        // Constants
        const HAIR = { BLOND: "BLOND", BLACK: "BLACK", BROWN: "BROWN" };
        const GENDER = { MAN: "MAN", WOMAN: "WOMAN" };
        const MAJOR = { DOCTOR: "DOCTOR", DRIVER: "DRIVER", CHILD: "CHILD" };

        // Person class
        class Person {
            constructor(
                public name: string,
                public age: number,
                public gender: string,
                public major: string,
                public hairColor: string
            ) {}
        }

        // Create Observables
        const personal$ = new Observable<Person | null>(null);
        const men$ = new Observable<Person | null>(null);
        const women$ = new Observable<Person | null>(null);

        // Define filters
        const youngAgeFilter = (person: Person | null) => person !== null && person.age > 17;
        const oldAgeFilter = (person: Person | null) => person !== null && person.age < 60;
        const menFilter = (person: Person | null) => person !== null && person.gender === GENDER.MAN;
        const womenFilter = (person: Person | null) => person !== null && person.gender === GENDER.WOMAN;
        const blondFilter = (person: Person | null) => person !== null && person.hairColor === HAIR.BLOND;
        const blackFilter = (person: Person | null) => person !== null && person.hairColor === HAIR.BLACK;

        const personValidationFilters = [
            (person: Person | null) => !!person,
            (person: Person | null) => person !== null && "name" in person,
            (person: Person | null) => person !== null && "age" in person,
            (person: Person | null) => person !== null && "gender" in person,
            (person: Person | null) => person !== null && "major" in person,
            (person: Person | null) => person !== null && "hairColor" in person,
        ];

        // Collect results
        const menReadyToWork: string[] = [];
        const womenReadyToWork: string[] = [];
        const blondAndBlackPeople: string[] = [];

        // Apply filters to men$ and women$
        men$.addFilter()
            .allOf(personValidationFilters)
            .and(menFilter);

        women$.addFilter()
            .allOf(personValidationFilters)
            .and(womenFilter);

        // Subscribe callbacks
        men$.pipe()!
            .allOf(personValidationFilters)
            .subscribe((worker: Person | null) => {
                if (worker) menReadyToWork.push(`${worker.name} ${worker.age} ${worker.major}`);
            });

        women$.pipe()!
            .allOf(personValidationFilters)
            .subscribe((worker: Person | null) => {
                if (worker) womenReadyToWork.push(`${worker.name} ${worker.age} ${worker.major}`);
            });

        // Stream by age filters to men$/women$
        personal$.pipe()!
            .and(youngAgeFilter)
            .and(oldAgeFilter)
            .subscribe([men$, women$]);

        // Stream by hair color
        personal$.pipe()!
            .choice()
            .or(blackFilter)
            .or(blondFilter)
            .subscribe((person: Person | null) => {
                if (person) blondAndBlackPeople.push(`${person.name} ${person.age} ${person.hairColor}`);
            });

        // Stream people
        personal$.of([
            new Person('Alex', 35, GENDER.MAN, MAJOR.DOCTOR, HAIR.BLOND),
            new Person('John', 45, GENDER.MAN, MAJOR.DRIVER, HAIR.BLACK),
            new Person('Alice', 30, GENDER.WOMAN, MAJOR.DOCTOR, HAIR.BROWN),
            new Person('Sophia', 36, GENDER.WOMAN, MAJOR.DRIVER, HAIR.BLOND),
            new Person('Matthew', 15, GENDER.MAN, MAJOR.CHILD, HAIR.BROWN),
            new Person('Emily', 17, GENDER.WOMAN, MAJOR.CHILD, HAIR.BLACK),
            new Person('James', 40, GENDER.MAN, MAJOR.DOCTOR, HAIR.BLOND),
            new Person('Emma', 35, GENDER.WOMAN, MAJOR.DRIVER, HAIR.BROWN),
            new Person('Michael', 15, GENDER.MAN, MAJOR.CHILD, HAIR.BLACK),
            new Person('Olivia', 16, GENDER.WOMAN, MAJOR.CHILD, HAIR.BLOND)
        ]);

        // Verify men ready to work (age 18-59, gender MAN)
        expect(menReadyToWork).to.deep.equal([
            'Alex 35 DOCTOR',
            'John 45 DRIVER',
            'James 40 DOCTOR'
        ]);

        // Verify women ready to work (age 18-59, gender WOMAN)
        expect(womenReadyToWork).to.deep.equal([
            'Alice 30 DOCTOR',
            'Sophia 36 DRIVER',
            'Emma 35 DRIVER'
        ]);

        // Verify blond and black hair of people (all ages)
        expect(blondAndBlackPeople).to.deep.equal([
            'Alex 35 BLOND',
            'John 45 BLACK',
            'Sophia 36 BLOND',
            'Emily 17 BLACK',
            'James 40 BLOND',
            'Michael 15 BLACK',
            'Olivia 16 BLOND'
        ]);
    }

    @test 'in() should emit object entries as [key, value] tuples'() {
        const received: Array<[string, number]> = [];
        const obj = {a: 1, b: 2, c: 3};

        this.OBSERVABLE$.subscribe((tuple: any) => received.push(tuple));
        this.OBSERVABLE$.in(obj);

        expect(received.length).to.be.equal(3);
        expect(received).to.deep.include(['a', 1]);
        expect(received).to.deep.include(['b', 2]);
        expect(received).to.deep.include(['c', 3]);
        // Verify tuple access
        expect(received[0][0]).to.be.a('string');
        expect(received[0][1]).to.be.a('number');
    }

    @test 'in() should handle empty objects'() {
        const received: any[] = [];
        const obj = {};

        this.OBSERVABLE$.subscribe((pair: any) => received.push(pair));
        this.OBSERVABLE$.in(obj);

        expect(received.length).to.be.equal(0);
    }

    @test 'in() should work with pipe transformations'() {
        const received: string[] = [];
        const obj = {name: 'Alice', age: '30', city: 'NYC'};

        this.OBSERVABLE$.pipe()
            .and((tuple: any) => tuple[1].length > 2)
            .subscribe((tuple: any) => received.push(`${tuple[0]}:${tuple[1]}`));

        this.OBSERVABLE$.in(obj);

        expect(received.length).to.be.equal(2);
        expect(received).to.include('name:Alice');
        expect(received).to.include('city:NYC');
    }

    @test 'in() should not emit when disabled'() {
        const received: any[] = [];
        const obj = {x: 10, y: 20};

        this.OBSERVABLE$.subscribe((pair: any) => received.push(pair));
        this.OBSERVABLE$.disable();
        this.OBSERVABLE$.in(obj);

        expect(received.length).to.be.equal(0);
    }

    @test 'in() should respect hasOwnProperty check'() {
        const received: any[] = [];
        const obj = Object.create({inherited: 'value'});
        obj.own = 'ownValue';

        this.OBSERVABLE$.subscribe((tuple: any) => received.push(tuple));
        this.OBSERVABLE$.in(obj);

        expect(received.length).to.be.equal(1);
        expect(received[0]).to.deep.equal(['own', 'ownValue']);
    }

    @test 'in() should work with numeric keys'() {
        const received: any[] = [];
        const obj: Record<number, string> = {1: 'one', 2: 'two', 3: 'three'};

        this.OBSERVABLE$.subscribe((tuple: any) => received.push(tuple));
        this.OBSERVABLE$.in(obj);

        expect(received.length).to.be.equal(3);
        expect(received).to.deep.include(['1', 'one']);
    }

    @test 'group() should allow adding multiple listeners'() {
        const received1: string[] = [];
        const received2: string[] = [];
        const received3: string[] = [];

        const group = this.OBSERVABLE$.pipe()
            .and((x: any) => x.length > 1)
            .group();

        group.add((x: any) => received1.push(x));
        group.add((x: any) => received2.push(x));
        group.add((x: any) => received3.push(x));

        this.OBSERVABLE$.next('a');
        this.OBSERVABLE$.next('ab');
        this.OBSERVABLE$.next('abc');

        expect(received1).to.deep.equal(['ab', 'abc']);
        expect(received2).to.deep.equal(['ab', 'abc']);
        expect(received3).to.deep.equal(['ab', 'abc']);
    }

    @test 'group() should share single pipe execution'() {
        let pipeExecutions = 0;
        const received1: number[] = [];
        const received2: number[] = [];

        const group = this.OBSERVABLE$.pipe()
            .and((x: any) => {
                pipeExecutions++;
                return x > 5;
            })
            .group();

        group.add((x: any) => received1.push(x));
        group.add((x: any) => received2.push(x));

        this.OBSERVABLE$.next('3');
        this.OBSERVABLE$.next('7');
        this.OBSERVABLE$.next('10');

        // Pipe should execute only ONCE per emission, not N times for N listeners
        expect(pipeExecutions).to.be.equal(3);
        expect(received1).to.deep.equal(['7', '10']);
        expect(received2).to.deep.equal(['7', '10']);
    }

    @test 'group() should support array of listeners'() {
        const received1: string[] = [];
        const received2: string[] = [];
        const received3: string[] = [];

        const group = this.OBSERVABLE$.pipe().group();

        group.add([
            (x: any) => received1.push(x),
            (x: any) => received2.push(x),
            (x: any) => received3.push(x)
        ]);

        this.OBSERVABLE$.next('test1');
        this.OBSERVABLE$.next('test2');

        expect(received1).to.deep.equal(['test1', 'test2']);
        expect(received2).to.deep.equal(['test1', 'test2']);
        expect(received3).to.deep.equal(['test1', 'test2']);
    }

    @test 'group() should handle errors independently'() {
        const received1: string[] = [];
        const received2: string[] = [];
        const errors1: any[] = [];
        const errors2: any[] = [];

        const group = this.OBSERVABLE$.pipe().group();

        group.add(
            (x: any) => {
                if (x === 'error1') throw new Error('Error 1');
                received1.push(x);
            },
            (data: any, err: any) => errors1.push(err.message)
        );

        group.add(
            (x: any) => {
                if (x === 'error2') throw new Error('Error 2');
                received2.push(x);
            },
            (data: any, err: any) => errors2.push(err.message)
        );

        this.OBSERVABLE$.next('ok');
        this.OBSERVABLE$.next('error1');
        this.OBSERVABLE$.next('error2');
        this.OBSERVABLE$.next('ok2');

        expect(received1).to.deep.equal(['ok', 'error2', 'ok2']);
        expect(received2).to.deep.equal(['ok', 'error1', 'ok2']);
        expect(errors1).to.deep.equal(['Error 1']);
        expect(errors2).to.deep.equal(['Error 2']);
    }

    @test 'group() should work with transformations'() {
        const received1: number[] = [];
        const received2: number[] = [];

        const group = this.OBSERVABLE$.pipe()
            .and((x: any) => x.includes('2'))
            .group();

        group.add((x: any) => received1.push(x.length));
        group.add((x: any) => received2.push(x.length));

        this.OBSERVABLE$.of(['1', '2', '12', '123', '456']);

        expect(received1).to.deep.equal([1, 2, 3]);
        expect(received2).to.deep.equal([1, 2, 3]);
    }

    @test 'group() should allow chaining add() calls'() {
        const received1: string[] = [];
        const received2: string[] = [];
        const received3: string[] = [];

        this.OBSERVABLE$.pipe()
            .group()
            .add((x: any) => received1.push(x))
            .add((x: any) => received2.push(x))
            .add((x: any) => received3.push(x));

        this.OBSERVABLE$.next('test');

        expect(received1).to.deep.equal(['test']);
        expect(received2).to.deep.equal(['test']);
        expect(received3).to.deep.equal(['test']);
    }

    @test 'group() should support unsubscribe()'() {
        const received1: string[] = [];
        const received2: string[] = [];

        const group = this.OBSERVABLE$.pipe().group();

        group.add((x: any) => received1.push(x));
        group.add((x: any) => received2.push(x));

        this.OBSERVABLE$.next('before');
        group.unsubscribe();
        this.OBSERVABLE$.next('after');

        expect(received1).to.deep.equal(['before']);
        expect(received2).to.deep.equal(['before']);
    }

    @test 'group() should work with no pipe (fast path)'() {
        const received1: string[] = [];
        const received2: string[] = [];

        const group = this.OBSERVABLE$.pipe().group();

        group.add((x: any) => received1.push(x));
        group.add((x: any) => received2.push(x));

        this.OBSERVABLE$.next('test1');
        this.OBSERVABLE$.next('test2');

        expect(received1).to.deep.equal(['test1', 'test2']);
        expect(received2).to.deep.equal(['test1', 'test2']);
    }

    @test 'group() with pipe should process value once for all listeners'() {
        let transformations = 0;
        const received1: number[] = [];
        const received2: number[] = [];

        const group = this.OBSERVABLE$.pipe()
            .and((x: any) => {
                transformations++;
                return x > 0;
            })
            .group();

        group.add((x: any) => received1.push(x * 2));
        group.add((x: any) => received2.push(x * 3));

        this.OBSERVABLE$.next('-1');
        this.OBSERVABLE$.next('5');
        this.OBSERVABLE$.next('10');

        // Filter should execute 3 times (once per emission), not 6 times (not per listener)
        expect(transformations).to.be.equal(3);
        expect(received1).to.deep.equal([10, 20]);
        expect(received2).to.deep.equal([15, 30]);
    }

    @test 'group() with unsubscribeBy should unsubscribe when condition met'() {
        const received1: string[] = [];
        const received2: string[] = [];

        const group = this.OBSERVABLE$.pipe()
            .unsubscribeBy((x: any) => x === '5')
            .group();

        group.add((x: any) => received1.push(x));
        group.add((x: any) => received2.push(x));

        this.OBSERVABLE$.next('1');
        this.OBSERVABLE$.next('3');
        this.OBSERVABLE$.next('5'); // Should trigger unsubscribe (value not emitted to listeners)
        this.OBSERVABLE$.next('7'); // Should not be received

        expect(received1).to.deep.equal(['1', '3']);
        expect(received2).to.deep.equal(['1', '3']);
        expect(this.OBSERVABLE$.size()).to.be.equal(0); // All unsubscribed
    }

    @test 'group() without primary listener should process pipe chain correctly'() {
        const observable$ = new Observable<number>(0);
        const results: number[] = [];
        let pipeExecutions = 0;

        const group = observable$
            .pipe()
            .and(x => {
                pipeExecutions++;
                return x > 0;
            })
            .map<number>(x => x * 2)
            .group();  // No primary listener!

        group.add((x: number) => results.push(x));

        observable$.next(-1);  // Should be filtered
        observable$.next(5);   // Should pass and transform

        expect(pipeExecutions).to.be.equal(2);  // Both emissions processed
        expect(results).to.deep.equal([10]);  // Only 5 * 2 received
    }

    @test 'group().add() with partial error handler array should use default handlers'() {
        const errors: string[] = [];
        const results: number[] = [];
        const defaultHandler = (data: any, err: any) => errors.push('default');

        const observable$ = new Observable<number>(0);

        // Create group and set default error handler
        const group = observable$.pipe().group();
        (group as any).errorHandler = defaultHandler;  // Set default error handler for fallback

        const listener1 = (x: number) => {
            results.push(x);
            throw new Error('error1');
        };
        const listener2 = (x: number) => {
            results.push(x);
            throw new Error('error2');
        };
        const listener3 = (x: number) => {
            results.push(x);
            throw new Error('error3');
        };

        const customHandler = (data: any, err: any) => errors.push('custom');

        // Add 3 listeners but only 1 custom error handler
        group.add([listener1, listener2, listener3], [customHandler]);

        observable$.next(1);

        // Verify all 3 listeners were called
        expect(results).to.deep.equal([1, 1, 1]);

        // Verify error handlers
        expect(errors.length).to.be.equal(3);
        expect(errors[0]).to.be.equal('custom');   // First listener uses custom handler
        expect(errors[1]).to.be.equal('default');  // The second listener falls back to default
        expect(errors[2]).to.be.equal('default');  // The third listener falls back to default
    }

    @test 'Complex pipe chain: 10 and() operators + or() block - all scenarios'() {
        // ========================================
        // SCENARIO 1: All and() pass + one or() matches → listener called ✅
        // ========================================
        {
            const observable$ = new Observable<number>(0);
            const results: number[] = [];
            let andExecutions = 0;
            let orExecutions = 0;

            observable$.pipe()
                .and(x => { andExecutions++; return x > 0; })     // 1
                .and(x => { andExecutions++; return x > 1; })     // 2
                .and(x => { andExecutions++; return x > 2; })     // 3
                .and(x => { andExecutions++; return x > 3; })     // 4
                .and(x => { andExecutions++; return x > 4; })     // 5
                .and(x => { andExecutions++; return x > 5; })     // 6
                .and(x => { andExecutions++; return x > 6; })     // 7
                .and(x => { andExecutions++; return x > 7; })     // 8
                .and(x => { andExecutions++; return x > 8; })     // 9
                .and(x => { andExecutions++; return x > 9; })     // 10
                .choice()
                .or(x => { orExecutions++; return x === 50; })    // First or
                .or(x => { orExecutions++; return x === 100; })   // Second or (MATCH!)
                .or(x => { orExecutions++; return x === 150; })   // Third or (should NOT execute!)
                .subscribe(value => results.push(value));

            observable$.next(100);  // Passes all and(), matches second or()

            expect(andExecutions).to.be.equal(10, 'All 10 and() operators executed');
            expect(orExecutions).to.be.equal(2, 'Only 2 or() executed (break after match)');
            expect(results).to.deep.equal([100], 'Listener received value');

            observable$.destroy();
        }

        // ========================================
        // SCENARIO 2: All and() pass + NO or() matches → listener NOT called ❌
        // ========================================
        {
            const observable$ = new Observable<number>(0);
            const results: number[] = [];
            let andExecutions = 0;
            let orExecutions = 0;

            observable$.pipe()
                .and(x => { andExecutions++; return x > 0; })     // 1
                .and(x => { andExecutions++; return x > 1; })     // 2
                .and(x => { andExecutions++; return x > 2; })     // 3
                .and(x => { andExecutions++; return x > 3; })     // 4
                .and(x => { andExecutions++; return x > 4; })     // 5
                .and(x => { andExecutions++; return x > 5; })     // 6
                .and(x => { andExecutions++; return x > 6; })     // 7
                .and(x => { andExecutions++; return x > 7; })     // 8
                .and(x => { andExecutions++; return x > 8; })     // 9
                .and(x => { andExecutions++; return x > 9; })     // 10
                .choice()
                .or(x => { orExecutions++; return x === 50; })    // No match
                .or(x => { orExecutions++; return x === 200; })   // No match
                .or(x => { orExecutions++; return x === 150; })   // No match (last sets isAvailable=false!)
                .subscribe(value => results.push(value));

            observable$.next(100);  // Passes all and(), but NO or() matches

            expect(andExecutions).to.be.equal(10, 'All 10 and() operators executed');
            expect(orExecutions).to.be.equal(3, 'All 3 or() executed (no match)');
            expect(results).to.deep.equal([], 'Listener NOT called - last or() rejected value');

            observable$.destroy();
        }

        // ========================================
        // SCENARIO 3: One and() fails → early exit, or() NOT executed ❌
        // ========================================
        {
            const observable$ = new Observable<number>(0);
            const results: number[] = [];
            let andExecutions = 0;
            let orExecutions = 0;

            observable$.pipe()
                .and(x => { andExecutions++; return x > 0; })     // 1 - PASS
                .and(x => { andExecutions++; return x > 1; })     // 2 - PASS
                .and(x => { andExecutions++; return x > 2; })     // 3 - PASS
                .and(x => { andExecutions++; return x > 3; })     // 4 - PASS
                .and(x => { andExecutions++; return x > 4; })     // 5 - PASS
                .and(x => { andExecutions++; return x > 100; })   // 6 - FAIL! (10 is NOT > 100)
                .and(x => { andExecutions++; return x > 6; })     // 7 - SHOULD NOT EXECUTE
                .and(x => { andExecutions++; return x > 7; })     // 8 - SHOULD NOT EXECUTE
                .and(x => { andExecutions++; return x > 8; })     // 9 - SHOULD NOT EXECUTE
                .and(x => { andExecutions++; return x > 9; })     // 10 - SHOULD NOT EXECUTE
                .choice()
                .or(x => { orExecutions++; return x === 10; })    // SHOULD NOT EXECUTE
                .or(x => { orExecutions++; return x === 100; })   // SHOULD NOT EXECUTE
                .or(x => { orExecutions++; return x === 150; })   // SHOULD NOT EXECUTE
                .subscribe(value => results.push(value));

            observable$.next(10);  // Fails at and(x > 100)

            expect(andExecutions).to.be.equal(6, 'Only 6 and() executed (early exit at 6th)');
            expect(orExecutions).to.be.equal(0, 'ZERO or() executed (never reached)');
            expect(results).to.deep.equal([], 'Listener NOT called - and() rejected value');

            observable$.destroy();
        }

        // ========================================
        // SCENARIO 4: Test with group() after choice/or - complex chain shared by multiple listeners
        // ========================================
        {
            const observable$ = new Observable<number>(0);
            const results1: number[] = [];
            const results2: number[] = [];
            const results3: number[] = [];
            let pipeExecutions = 0;

            // BUG FIX: Now choice().or() SUPPORTS .group()!
            const group = observable$.pipe()
                .and(x => { pipeExecutions++; return x > 0; })
                .and(x => { pipeExecutions++; return x > 1; })
                .and(x => { pipeExecutions++; return x > 2; })
                .and(x => { pipeExecutions++; return x > 3; })
                .and(x => { pipeExecutions++; return x > 4; })
                .choice()
                .or(x => { pipeExecutions++; return x === 10; })
                .or(x => { pipeExecutions++; return x === 20; })
                .or(x => { pipeExecutions++; return x === 30; })
                .group();  // ← NOW WORKS!

            group.add(value => results1.push(value));
            group.add(value => results2.push(value));
            group.add(value => results3.push(value));

            observable$.next(2);   // Fails at and(x > 2)
            observable$.next(10);  // Passes all and(), matches first or()
            observable$.next(15);  // Passes all and(), NO or() matches
            observable$.next(20);  // Passes all and(), matches second or()

            // Scenario 1: next(2) → fails at and(x > 2)
            // - 3 and() executed (stops at x > 2)
            // - 0 or() executed
            // Scenario 2: next(10) → passes all, matches first or()
            // - 5 and() + 1 or() = 6 executions
            // Scenario 3: next(15) → passes all, NO or() matches
            // - 5 and() + 3 or() = 8 executions
            // Scenario 4: next(20) → passes all, matches second or()
            // - 5 and() + 2 or() = 7 executions
            // Total: 3 + 6 + 8 + 7 = 24
            expect(pipeExecutions).to.be.equal(24, 'Pipe executed correct number of times');

            expect(results1).to.deep.equal([10, 20], 'Listener 1 received only matched values');
            expect(results2).to.deep.equal([10, 20], 'Listener 2 received same values');
            expect(results3).to.deep.equal([10, 20], 'Listener 3 received same values');

            observable$.destroy();
        }
    }
}
