import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {ICollector} from "../src/Libraries/Observables/Types";
import {Collector} from "../src/Libraries/Observables/Collector";
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class CollectorUnitTest {
    private COLLECTOR: ICollector;

    before() {
        this.COLLECTOR = new Collector();
    }

    @test 'collector is created'() {
        expect(this.COLLECTOR.size()).to.be.eql(0);
    }

    @test 'collector collect one subscriber'() {
        const observable$ = new Observable(0);
        this.COLLECTOR.collect(observable$.subscribe(value => value));
        expect(this.COLLECTOR.size()).to.be.equal(1);
    }

    @test 'collector collect two subscribers'() {
        const observable$ = new Observable(0);
        this.COLLECTOR.collect(observable$.subscribe(value => value));
        this.COLLECTOR.collect(observable$.subscribe(value => value));
        expect(this.COLLECTOR.size()).to.be.equal(2);
    }

    @test 'collector collect three subscribers'() {
        const observable$ = new Observable(0);
        this.COLLECTOR.collect(
            observable$.subscribe(value => value),
            observable$.subscribe(value => value),
            observable$.subscribe(value => value),
        );
        expect(this.COLLECTOR.size()).to.be.equal(3);
    }

    @test 'collector collect ten subscribers'() {
        const observable$ = new Observable(0);
        for (let i = 0; i < 10; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }
        expect(this.COLLECTOR.size()).to.be.equal(10);
    }

    @test 'collector collect zero subscribers'() {
        this.COLLECTOR.collect();
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    @test 'collector collect one subscriber and unsubscribe'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(1);
        this.COLLECTOR.unsubscribe(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    @test 'collector collect one subscriber and unsubscribe all'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(1);
        this.COLLECTOR.unsubscribeAll();
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    @test 'collector collect zero subscribers and unsubscribe'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        this.COLLECTOR.unsubscribe(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect((<any>subscriptionLike).observable).to.be.equal(null);
    }

    @test 'collector collect zero subscribers and unsubscribeAll'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        this.COLLECTOR.unsubscribeAll();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(!!(<any>subscriptionLike).observable).to.be.equal(true);
    }

    @test 'collector collect two subscribers and unsubscribe one'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        const subscriptionLike2 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1, subscriptionLike2);
        expect(this.COLLECTOR.size()).to.be.equal(2);
        this.COLLECTOR.unsubscribe(subscriptionLike1);
        expect(this.COLLECTOR.size()).to.be.equal(1);
    }

    @test 'collector collect two subscribers and unsubscribe two'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        const subscriptionLike2 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1, subscriptionLike2);
        expect(this.COLLECTOR.size()).to.be.equal(2);
        this.COLLECTOR.unsubscribe(subscriptionLike1);
        this.COLLECTOR.unsubscribe(subscriptionLike2);
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    @test 'collector collect two subscribers and unsubscribe all'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        const subscriptionLike2 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1, subscriptionLike2);
        expect(this.COLLECTOR.size()).to.be.equal(2);
        this.COLLECTOR.unsubscribeAll();
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    @test 'collector collect ten subscribers and unsubscribe one'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1);
        for (let i = 0; i < 9; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }
        expect(this.COLLECTOR.size()).to.be.equal(10);
        this.COLLECTOR.unsubscribe(subscriptionLike1);
        expect(this.COLLECTOR.size()).to.be.equal(9);
    }

    @test 'collector collect ten subscribers and unsubscribe two'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        const subscriptionLike2 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1);
        this.COLLECTOR.collect(subscriptionLike2);
        for (let i = 0; i < 8; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }
        expect(this.COLLECTOR.size()).to.be.equal(10);
        this.COLLECTOR.unsubscribe(subscriptionLike1);
        this.COLLECTOR.unsubscribe(subscriptionLike2);
        expect(this.COLLECTOR.size()).to.be.equal(8);
    }

    @test 'collector collect ten subscribers and unsubscribe all'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        const subscriptionLike2 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1);
        this.COLLECTOR.collect(subscriptionLike2);
        for (let i = 0; i < 8; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }
        expect(this.COLLECTOR.size()).to.be.equal(10);
        this.COLLECTOR.unsubscribeAll();
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    @test 'collector collect one subscriber and destroy'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(1);
        this.COLLECTOR.destroy();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(this.COLLECTOR.isDestroyed).to.be.equal(true);
    }

    @test 'collector collect two subscribers and destroy'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        const subscriptionLike2 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1, subscriptionLike2);
        expect(this.COLLECTOR.size()).to.be.equal(2);
        this.COLLECTOR.destroy();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(this.COLLECTOR.isDestroyed).to.be.equal(true);
    }

    @test 'collector collect ten subscribers and destroy'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1);
        for (let i = 0; i < 9; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }
        expect(this.COLLECTOR.size()).to.be.equal(10);
        this.COLLECTOR.destroy();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(this.COLLECTOR.isDestroyed).to.be.equal(true);
    }

    @test 'collector collect ten subscribers, destroy and collect '() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1);
        for (let i = 0; i < 9; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }
        expect(this.COLLECTOR.size()).to.be.equal(10);
        this.COLLECTOR.destroy();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(this.COLLECTOR.isDestroyed).to.be.equal(true);
        expect(this.COLLECTOR.collect()).to.be.equal(undefined);
    }

    @test 'collector collect ten subscribers, destroy and unsubscribe '() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1);
        for (let i = 0; i < 9; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }
        expect(this.COLLECTOR.size()).to.be.equal(10);
        this.COLLECTOR.destroy();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(this.COLLECTOR.isDestroyed).to.be.equal(true);
        expect(this.COLLECTOR.unsubscribe(subscriptionLike1)).to.be.equal(undefined);
    }

    @test 'collector collect ten subscribers, destroy and unsubscribeAll '() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1);

        for (let i = 0; i < 9; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }

        expect(this.COLLECTOR.size()).to.be.equal(10);
        this.COLLECTOR.destroy();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(this.COLLECTOR.isDestroyed).to.be.equal(true);
        expect(this.COLLECTOR.unsubscribeAll()).to.be.equal(undefined);
    }

    @test 'collector collect ten subscribers, unsubscribe undefined subs'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1);

        for (let i = 0; i < 9; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }

        expect(this.COLLECTOR.size()).to.be.equal(10);
        this.COLLECTOR.unsubscribe(undefined);
        expect(this.COLLECTOR.size()).to.be.equal(10);
    }
}
