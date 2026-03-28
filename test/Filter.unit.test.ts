import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class FilterUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
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

    @test 'filter blocks emission when returns false'() {
        const observable = new Observable<number>(0);
        const received: number[] = [];

        observable.addFilter().and((v) => v > 5);
        observable.subscribe((v) => received.push(v));

        observable.of([1, 2, 3, 6, 7, 4, 8]);

        expect(received).to.be.eql([6, 7, 8]);
    }
}
