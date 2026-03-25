import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {ICollector} from "../src/Libraries/Observables/Types";
import {Collector} from "../src/Libraries/Observables/Collector";
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

/**
 * Tests for Collector — a subscription management utility.
 * Collector stores subscriptions (ISubscriptionLike) and provides
 * bulk unsubscribe and destroy capabilities.
 */
@suite
class CollectorUnitTest {
    private COLLECTOR: ICollector;

    // Create a fresh Collector instance before each test
    before() {
        this.COLLECTOR = new Collector();
    }

    // A new Collector should be empty (size = 0)
    @test 'collector is created'() {
        expect(this.COLLECTOR.size()).to.be.eql(0);
    }

    // collect() with one subscription increases size to 1
    @test 'collector collect one subscriber'() {
        const observable$ = new Observable(0);
        this.COLLECTOR.collect(observable$.subscribe(value => value));
        expect(this.COLLECTOR.size()).to.be.equal(1);
    }

    // Two sequential collect() calls — size = 2
    @test 'collector collect two subscribers'() {
        const observable$ = new Observable(0);
        this.COLLECTOR.collect(observable$.subscribe(value => value));
        this.COLLECTOR.collect(observable$.subscribe(value => value));
        expect(this.COLLECTOR.size()).to.be.equal(2);
    }

    // collect() accepts multiple subscriptions in a single call (variadic)
    @test 'collector collect three subscribers'() {
        const observable$ = new Observable(0);
        this.COLLECTOR.collect(
            observable$.subscribe(value => value),
            observable$.subscribe(value => value),
            observable$.subscribe(value => value),
        );
        expect(this.COLLECTOR.size()).to.be.equal(3);
    }

    // Adding 10 subscriptions in a loop — size counts them all correctly
    @test 'collector collect ten subscribers'() {
        const observable$ = new Observable(0);
        for (let i = 0; i < 10; i++) {
            this.COLLECTOR.collect(observable$.subscribe(value => value));
        }
        expect(this.COLLECTOR.size()).to.be.equal(10);
    }

    // collect() with no arguments does not change size
    @test 'collector collect zero subscribers'() {
        this.COLLECTOR.collect();
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    // unsubscribe() removes a specific subscription from the collector
    @test 'collector collect one subscriber and unsubscribe'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(1);
        this.COLLECTOR.unsubscribe(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    // unsubscribeAll() unsubscribes all subscriptions at once
    @test 'collector collect one subscriber and unsubscribe all'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(1);
        this.COLLECTOR.unsubscribeAll();
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    // unsubscribe() on a subscription not in the collector still unsubscribes
    // the subscription itself (observer becomes null), but size stays unchanged
    @test 'collector collect zero subscribers and unsubscribe'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        this.COLLECTOR.unsubscribe(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect((<any>subscriptionLike).observer).to.be.equal(null);
    }

    // unsubscribeAll() on an empty collector does not affect external subscriptions —
    // a subscription not added to the collector remains active (observer != null)
    @test 'collector collect zero subscribers and unsubscribeAll'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        this.COLLECTOR.unsubscribeAll();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(!!(<any>subscriptionLike).observer).to.be.equal(true);
    }

    // Unsubscribing one of two subscriptions — size decreases by 1
    @test 'collector collect two subscribers and unsubscribe one'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        const subscriptionLike2 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1, subscriptionLike2);
        expect(this.COLLECTOR.size()).to.be.equal(2);
        this.COLLECTOR.unsubscribe(subscriptionLike1);
        expect(this.COLLECTOR.size()).to.be.equal(1);
    }

    // Sequentially unsubscribing both subscriptions — size = 0
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

    // unsubscribeAll() unsubscribes all collected subscriptions
    @test 'collector collect two subscribers and unsubscribe all'() {
        const observable$ = new Observable(0);
        const subscriptionLike1 = observable$.subscribe(value => value);
        const subscriptionLike2 = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike1, subscriptionLike2);
        expect(this.COLLECTOR.size()).to.be.equal(2);
        this.COLLECTOR.unsubscribeAll();
        expect(this.COLLECTOR.size()).to.be.equal(0);
    }

    // Unsubscribing one out of 10 subscriptions — size decreases by 1
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

    // Sequentially unsubscribing two out of 10 — size = 8
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

    // unsubscribeAll() on 10 subscriptions — all unsubscribed, size = 0
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

    // destroy() unsubscribes all and marks the collector as destroyed
    @test 'collector collect one subscriber and destroy'() {
        const observable$ = new Observable(0);
        const subscriptionLike = observable$.subscribe(value => value);
        this.COLLECTOR.collect(subscriptionLike);
        expect(this.COLLECTOR.size()).to.be.equal(1);
        this.COLLECTOR.destroy();
        expect(this.COLLECTOR.size()).to.be.equal(0);
        expect(this.COLLECTOR.isDestroyed).to.be.equal(true);
    }

    // destroy() works correctly with multiple subscriptions
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

    // destroy() works correctly with a large number of subscriptions
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

    // After destroy(), calling collect() does not throw — returns undefined (no-op)
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

    // After destroy(), calling unsubscribe() does not throw — returns undefined (no-op)
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

    // After destroy(), calling unsubscribeAll() does not throw — returns undefined (no-op)
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

    // unsubscribe(undefined) does not break the collector and does not change size
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
