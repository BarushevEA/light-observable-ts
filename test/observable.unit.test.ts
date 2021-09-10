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
        expect(this.EVENT$.getValue()).to.be.equal('');
    }
}