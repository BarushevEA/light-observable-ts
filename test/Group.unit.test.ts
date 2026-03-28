import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Observable} from "../src/Libraries/Observables/Observable";

_chai.should();
_chai.expect;

@suite
class GroupUnitTest {
    private OBSERVABLE$: Observable<string>;

    before() {
        this.OBSERVABLE$ = new Observable('');
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
