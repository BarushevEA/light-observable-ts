import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class SerializationUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
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
}
