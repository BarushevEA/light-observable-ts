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
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        // @ts-ignore
        const once = subscribeObject.once;
        // @ts-ignore
        expect(once.isOnce).to.be.equal(false);
        // @ts-ignore
        expect(once.isFinished).to.be.equal(false);
    }

    @test 'unsubscribe one by subject'() {
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        subscribeObject.unsubscribe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'unsubscribe one by observable'() {
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.unSubscribe(subscribeObject);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'unsubscribe all by ony'() {
        this.ORDERED_OBSERVABLE$.subscribe((value: string) => console.log(value));
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.unsubscribeAll();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one subscriber and listen one event'() {
        const str = '1';
        const listener = (value: string) => {
            expect(value).to.be.equal(str);
        };
        this.ORDERED_OBSERVABLE$.subscribe(listener);
        this.ORDERED_OBSERVABLE$.next(str);
    }

    @test 'Add one subscriber and listen ten events'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);

        this.ORDERED_OBSERVABLE$.subscribe(listener);
        for (; counter < 10; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);
    }

    @test 'Add one subscriber and get value after one change'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.ORDERED_OBSERVABLE$.subscribe(listener);
        for (; counter < 1; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);

        expect(this.ORDERED_OBSERVABLE$.getValue()).to.be.equal('0');
    }

    @test 'Add one subscriber and get value after five changes'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.ORDERED_OBSERVABLE$.subscribe(listener);
        for (; counter < 5; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);

        expect(this.ORDERED_OBSERVABLE$.getValue()).to.be.equal('4');
    }

    @test 'Add one subscriber and get value after ten changes'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => value;

        this.ORDERED_OBSERVABLE$.subscribe(listener);
        for (; counter < 10; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);

        expect(this.ORDERED_OBSERVABLE$.getValue()).to.be.equal('9');
    }

    @test 'Add one by pipe and "once"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.once.isOnce).to.be.equal(true);
        // @ts-ignore
        expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one by pipe and "once" after 10 changes'() {
        const str = '0123456789';
        let counter = 0;
        const listener = (value: string) => expect(value).to.be.equal(str[0]);

        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .setOnce()
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        // @ts-ignore
        expect(subscribeObject.once.isOnce).to.be.equal(true);
        for (; counter < 10; counter++) this.ORDERED_OBSERVABLE$.next(str[counter]);
        // @ts-ignore
        expect(subscribeObject.once.isFinished).to.be.equal(true);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add bad pipe'() {
        const str = '0123456789';
        this.ORDERED_OBSERVABLE$.pipe();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByNegative true"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "unsubscribeByNegative false"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => false;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByNegative" (5 positive, 5 negative)'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);
        const condition = () => counter < 5;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByNegative(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByPositive true"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(null);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one by pipe and "unsubscribeByPositive false"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => false;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.unsubscribeByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "unsubscribeByPositive" (5 negative, 5 positive)'() {
        let counter = 0;
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str[counter]);
        const condition = () => counter > 4;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .unsubscribeByPositive(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.unsubscribeByNegativeCondition).to.be.equal(null);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
    }

    @test 'Add one by pipe and "emitByNegative true"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => true;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByNegative false"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => false;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByNegative(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByNegative" (5 negative, 5 positive)'() {
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
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByNegative" (5 positive 5 negative)'() {
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
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByNegativeCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByPositive true"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const condition = () => true;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByPositive false"'() {
        const str = '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const condition = () => false;
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitByPositive(condition)
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.next(str);
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByPositive" (5 negative, 5 positive)'() {
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
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitByPositive" (5 positive 5 negative)'() {
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
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitByPositiveCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch true"'() {
        const str = '0123456789';
        const condition = () => '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(str);
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener);
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch false"'() {
        const str = '0123456789';
        const condition = () => '0123456789';
        const listener = (value: string) => expect(value).to.be.equal(null);
        const subscribeObject = this.ORDERED_OBSERVABLE$
            .pipe()
            .emitMatch(condition)
            .subscribe(listener);
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "0")'() {
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
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "9")'() {
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
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'Add one by pipe and "emitMatch 10 elements" (on value "5")'() {
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
            .subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        // @ts-ignore
        expect(subscribeObject.emitMatchCondition).to.be.equal(condition);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
    }

    @test 'pause / resume'() {
        let counter = 0;
        let accumulatorStr = '';
        const str = '0123456789';
        const listener = (value: string) => accumulatorStr += value;
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && (<IPause><any>subscribeObject).pause();
            (counter === 8) && (<IPause><any>subscribeObject).resume();
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(accumulatorStr).to.be.equal('012389');
    }

    @test 'order identification'() {
        const listener = (value: string) => value;
        const subscribeObject = <IOrder><any>this.ORDERED_OBSERVABLE$.subscribe(listener);
        subscribeObject.order = 11011;
        expect(subscribeObject.order).to.be.equal(11011);
    }

    @test 'observable disable/enable'() {
        let counter = 0;
        let accumulatorStr = '';
        const str = '0123456789';
        const listener = (value: string) => accumulatorStr += value;
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe(listener);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        for (; counter < 10; counter++) {
            (counter === 4) && this.ORDERED_OBSERVABLE$.disable();
            (counter === 8) && this.ORDERED_OBSERVABLE$.enable();
            this.ORDERED_OBSERVABLE$.next(str[counter]);
        }
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        expect(this.ORDERED_OBSERVABLE$.isEnable).to.be.equal(true);
        expect(accumulatorStr).to.be.equal('012389');
    }

    @test 'observable destroy'() {
        let counter = 0;
        let accumulatorStr = '';
        const str = '0123456789';
        const listener = (value: string) => accumulatorStr += value;
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe(listener);
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
        expect(this.ORDERED_OBSERVABLE$.value).to.be.equal(0);
        // @ts-ignore
        expect(this.ORDERED_OBSERVABLE$.listeners).to.be.equal(0);
        // @ts-ignore
        expect(subscribeObject.observable).to.be.equal(0);
        // @ts-ignore
        expect(subscribeObject.listener).to.be.equal(0);
    }

    @test 'defect field "observable" from subscribeObject'() {
        const listener = (value: string) => {
            expect(value).to.be.equal('ERROR WAY');
        };
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe(listener);
        // @ts-ignore
        subscribeObject.observable = 0;
        this.ORDERED_OBSERVABLE$.next('some data');
    }

    @test 'defect field "listener" from subscribeObject'() {
        const listener = (value: string) => {
            expect(value).to.be.equal('ERROR DATA');
        };
        const subscribeObject = this.ORDERED_OBSERVABLE$.subscribe(listener);
        // @ts-ignore
        subscribeObject.listener = 0;
        this.ORDERED_OBSERVABLE$.next('VALID DATA');
    }

    @test 'multi use'() {
        let counter = 0;
        const str = '0123456789';
        const subscribeObject1 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject1).order = 1;
        });
        const subscribeObject2 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject2).order = 2;
        });
        const subscribeObject3 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject3).order = 3;
        });
        const subscribeObject4 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject4).order = 4;
        });
        const subscribeObject5 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal(str[counter]);
            (<IOrder><any>subscribeObject5).order = 5;
        });
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
    }

    @test 'destroy and try to use next'() {
        const subscribeObject1 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        });

        this.ORDERED_OBSERVABLE$.destroy();
        this.ORDERED_OBSERVABLE$.next('VALID DATA');
    }

    @test 'destroy and try to use unSubscribe'() {
        const subscribeObject1 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        });
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        this.ORDERED_OBSERVABLE$.unSubscribe(subscribeObject1);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
    }

    @test 'destroy and try to use unSubscribeAll'() {
        const subscribeObject1 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        });
        const subscribeObject2 = this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('ERROR DATA');
        });
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(2);
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        this.ORDERED_OBSERVABLE$.unsubscribeAll();
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
    }

    @test 'destroy and try to use getValue'() {
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        });
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.getValue()).to.be.equal(undefined);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
    }

    @test 'destroy and try to use subscribe'() {
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        });
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.destroy();
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        });
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
    }

    @test 'destroy and try to use pipe'() {
        this.ORDERED_OBSERVABLE$.subscribe((value) => {
            expect(value).to.be.equal('SOME DATA');
        });
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(1);
        this.ORDERED_OBSERVABLE$.destroy();
        expect(this.ORDERED_OBSERVABLE$.pipe()).to.be.equal(undefined);
        expect(this.ORDERED_OBSERVABLE$.size()).to.be.equal(0);
        expect(this.ORDERED_OBSERVABLE$.isDestroyed).to.be.equal(true);
    }

    @test 'sorted two subscribers by default'() {
        let innerCounter = 0;
        const listener = (value: string) => {
            innerCounter++;
            if (innerCounter === 1) {
                expect(subscriber1.order).to.be.equal(innerCounter);
            }
            if (innerCounter === 2) {
                expect(subscriber2.order).to.be.equal(innerCounter);
            }
        };
        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener);
        subscriber1.order = 1;
        const subscriber2 = this.ORDERED_OBSERVABLE$.subscribe(listener);
        subscriber2.order = 2;
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
    }

    @test 'sorted two subscribers by revers'() {
        let innerCounter = 0;
        const listener = (value: string) => {
            innerCounter++;
            if (innerCounter === 1) {
                expect(subscriber2.order).to.be.equal(innerCounter);
            }
            if (innerCounter === 2) {
                expect(subscriber1.order).to.be.equal(innerCounter);
            }
        };
        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener);
        subscriber1.order = 2;
        const subscriber2 = this.ORDERED_OBSERVABLE$.subscribe(listener);
        subscriber2.order = 1;
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
    }

    @test 'sorted ten subscribers by default'() {
        const subscribers: IOrderedSubscriptionLike<string>[] = [];
        let innerCounter = 0;
        const listener = (value: string) => {
            expect(subscribers[innerCounter].order).to.be.equal(innerCounter);
            innerCounter++;
        };
        for (let i = 0; i < 10; i++) {
            const subscriber = this.ORDERED_OBSERVABLE$.subscribe(listener);
            subscriber.order = i;
            subscribers.push(subscriber);
        }
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
    }

    @test 'sorted ten subscribers by revers'() {
        const subscribers: IOrderedSubscriptionLike<string>[] = [];
        let innerCounter = 0;
        const listener = (value: string) => {
            expect(subscribers[innerCounter].order).to.be.equal(9 - innerCounter);
            innerCounter++;
        };
        for (let i = 0; i < 10; i++) {
            const subscriber = this.ORDERED_OBSERVABLE$.subscribe(listener);
            subscriber.order = 9 - i;
            subscribers.push(subscriber);
        }
        this.ORDERED_OBSERVABLE$.next('SOME DATA');
    }

    @test 'sorted ten subscribers by default but last element order to first'() {
        let innerCounter = 0;
        let orders: number[] = [];
        let subscribers: IOrderedSubscriptionLike<string>[] = [];
        const listener = (value: string) => {
            orders.push(subscribers[innerCounter].order);
            innerCounter++;
        };
        for (let i = 0; i < 10; i++) {
            const subscriber = this.ORDERED_OBSERVABLE$.subscribe(listener);
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
    }

    @test 'sorted ten subscribers by default but last and previews element order to first'() {
        let innerCounter = 0;
        let orders: number[] = [];
        let subscribers: IOrderedSubscriptionLike<string>[] = [];
        const listener = (value: string) => {
            orders.push(subscribers[innerCounter].order);
            innerCounter++;
        };
        for (let i = 0; i < 10; i++) {
            const subscriber = this.ORDERED_OBSERVABLE$.subscribe(listener);
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
    }

    @test 'try use broken observable'() {
        const listener = (value: string) => value;
        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener);
        // @ts-ignore
        this.ORDERED_OBSERVABLE$._isDestroyed = true;
        subscriber1.order = 10;
        expect(this.ORDERED_OBSERVABLE$.sortByOrder()).to.be.equal(undefined);
        expect(subscriber1.order).to.be.equal(undefined);
    }

    @test 'try use destroyed observable'() {
        const listener = (value: string) => value;
        const subscriber1 = this.ORDERED_OBSERVABLE$.subscribe(listener);

        this.ORDERED_OBSERVABLE$.destroy();
        subscriber1.order = 10;
        expect(this.ORDERED_OBSERVABLE$.sortByOrder()).to.be.equal(undefined);
        expect(subscriber1.order).to.be.equal(undefined);
    }
}