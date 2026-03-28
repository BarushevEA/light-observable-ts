import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {deleteFromArray, quickDeleteFromArray} from "../src/Libraries/Observables/FunctionLibs";

_chai.should();
_chai.expect;

@suite
class FunctionLibUnitTest {
    private deleteFromArray: <T>(arr: T[], component: T) => boolean;

    before() {
        this.deleteFromArray = deleteFromArray;
    }

    @test 'deleteFromArray: 1 from arr empty'() {
        expect(this.deleteFromArray([], 1)).to.be.equal(false);
    }

    @test 'deleteFromArray: 1 from arr [1]'() {
        const arr = [1];
        expect(this.deleteFromArray(arr, 1)).to.be.equal(true);
        expect(arr).to.be.eql([]);
    }

    @test 'deleteFromArray: 1 from arr [1, 2]'() {
        const arr = [1, 2];
        expect(this.deleteFromArray(arr, 1)).to.be.equal(true);
        expect(arr).to.be.eql([2]);
    }

    @test 'deleteFromArray: 2 from arr [1, 2]'() {
        const arr = [1, 2];
        expect(this.deleteFromArray(arr, 2)).to.be.equal(true);
        expect(arr).to.be.eql([1]);
    }

    @test 'deleteFromArray: 1 from arr [1, 2, 3]'() {
        const arr = [1, 2, 3];
        expect(this.deleteFromArray(arr, 1)).to.be.equal(true);
        expect(arr).to.be.eql([2, 3]);
    }

    @test 'deleteFromArray: 2 from arr [1, 2, 3]'() {
        const arr = [1, 2, 3];
        expect(this.deleteFromArray(arr, 2)).to.be.equal(true);
        expect(arr).to.be.eql([1, 3]);
    }

    @test 'deleteFromArray: 3 from arr [1, 2, 3]'() {
        const arr = [1, 2, 3];
        expect(this.deleteFromArray(arr, 3)).to.be.equal(true);
        expect(arr).to.be.eql([1, 2]);
    }

    @test 'deleteFromArray: 4 from arr [1, 2, 3]'() {
        const arr = [1, 2, 3];
        expect(this.deleteFromArray(arr, 4)).to.be.equal(false);
        expect(arr).to.be.eql([1, 2, 3]);
    }

    @test 'deleteFromArray: 1 from arr [1, 1, 2, 3]'() {
        const arr = [1, 1, 2, 3];
        expect(this.deleteFromArray(arr, 1)).to.be.equal(true);
        expect(arr).to.be.eql([1, 2, 3]);
    }

    @test 'deleteFromArray: 2 from arr [1, 1, 2, 3]'() {
        const arr = [1, 1, 2, 3];
        expect(this.deleteFromArray(arr, 2)).to.be.equal(true);
        expect(arr).to.be.eql([1, 1, 3]);
    }

    @test 'deleteFromArray: 3 from arr [1, 1, 2, 3]'() {
        const arr = [1, 1, 2, 3];
        expect(this.deleteFromArray(arr, 3)).to.be.equal(true);
        expect(arr).to.be.eql([1, 1, 2]);
    }

    @test 'deleteFromArray: 4 from arr [1, 1, 2, 3]'() {
        const arr = [1, 1, 2, 3];
        expect(this.deleteFromArray(arr, 4)).to.be.equal(false);
        expect(arr).to.be.eql([1, 1, 2, 3]);
    }
}

@suite
class QuickDeleteFromArrayUnitTest {
    private quickDeleteFromArray: <T>(arr: T[], component: T) => boolean;

    before() {
        this.quickDeleteFromArray = quickDeleteFromArray;
    }

    @test 'quickDeleteFromArray: 1 from arr empty'() {
        expect(this.quickDeleteFromArray([], 1)).to.be.equal(false);
    }

    @test 'quickDeleteFromArray: 1 from arr [1]'() {
        const arr = [1];
        expect(this.quickDeleteFromArray(arr, 1)).to.be.equal(true);
        expect(arr).to.be.eql([]);
    }

    @test 'quickDeleteFromArray: 2 from arr [1] not found'() {
        const arr = [1];
        expect(this.quickDeleteFromArray(arr, 2)).to.be.equal(false);
        expect(arr).to.be.eql([1]);
    }

    @test 'quickDeleteFromArray: 1 from arr [1, 2] swap last to first'() {
        const arr = [1, 2];
        expect(this.quickDeleteFromArray(arr, 1)).to.be.equal(true);
        expect(arr).to.be.eql([2]);
    }

    @test 'quickDeleteFromArray: 2 from arr [1, 2] truncate last'() {
        const arr = [1, 2];
        expect(this.quickDeleteFromArray(arr, 2)).to.be.equal(true);
        expect(arr).to.be.eql([1]);
    }

    @test 'quickDeleteFromArray: 1 from arr [1, 2, 3] swap last to first'() {
        const arr = [1, 2, 3];
        expect(this.quickDeleteFromArray(arr, 1)).to.be.equal(true);
        expect(arr).to.be.eql([3, 2]);
    }

    @test 'quickDeleteFromArray: 2 from arr [1, 2, 3] swap last to middle'() {
        const arr = [1, 2, 3];
        expect(this.quickDeleteFromArray(arr, 2)).to.be.equal(true);
        expect(arr).to.be.eql([1, 3]);
    }

    @test 'quickDeleteFromArray: 3 from arr [1, 2, 3] truncate last'() {
        const arr = [1, 2, 3];
        expect(this.quickDeleteFromArray(arr, 3)).to.be.equal(true);
        expect(arr).to.be.eql([1, 2]);
    }

    @test 'quickDeleteFromArray: 4 from arr [1, 2, 3] not found'() {
        const arr = [1, 2, 3];
        expect(this.quickDeleteFromArray(arr, 4)).to.be.equal(false);
        expect(arr).to.be.eql([1, 2, 3]);
    }

    @test 'quickDeleteFromArray: 1 from arr [1, 1, 2, 3] swap last to first duplicate'() {
        const arr = [1, 1, 2, 3];
        expect(this.quickDeleteFromArray(arr, 1)).to.be.equal(true);
        expect(arr).to.be.eql([3, 1, 2]);
    }

    @test 'quickDeleteFromArray: 2 from arr [1, 2, 2, 3] swap last to first duplicate'() {
        const arr = [1, 2, 2, 3];
        expect(this.quickDeleteFromArray(arr, 2)).to.be.equal(true);
        expect(arr).to.be.eql([1, 3, 2]);
    }
}