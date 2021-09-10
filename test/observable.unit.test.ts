import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class ObservableUnitTest {
    private EVENT$: Observable<string>

    before() {
        this.EVENT$ = new Observable('');
    }

    @test 'Observable is created'() {
        // @ts-ignore
        expect(this.EVENT$.value).to.be.equal('');
        // @ts-ignore
        expect(this.EVENT$.listeners).to.be.eql([]);
    }
}