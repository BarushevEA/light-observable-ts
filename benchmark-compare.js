#!/usr/bin/env node
/**
 * Скрипт для сравнения результатов бенчмарков между двумя ветками
 * Использование: node benchmark-compare.js results1.json results2.json
 */

const fs = require('fs');

function loadResults(filename) {
    if (!fs.existsSync(filename)) {
        console.error(`Error: File ${filename} not found!`);
        process.exit(1);
    }

    try {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (error) {
        console.error(`Error parsing ${filename}: ${error.message}`);
        process.exit(1);
    }
}

function findMatchingTest(testName, results) {
    return results.results.find(r => r.test === testName);
}

function calculateImprovement(baseline, optimized) {
    return ((optimized - baseline) / baseline) * 100;
}

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

function main() {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
        console.error('Usage: node benchmark-compare.js <baseline.json> <optimized.json>');
        console.error('Example: node benchmark-compare.js master-results.json perf-results.json');
        process.exit(1);
    }

    const [baselineFile, optimizedFile] = args;

    console.log('='.repeat(80));
    console.log('BENCHMARK COMPARISON ANALYSIS');
    console.log('='.repeat(80));

    const baseline = loadResults(baselineFile);
    const optimized = loadResults(optimizedFile);

    console.log(`\nBaseline:  ${baseline.branch} (${baseline.timestamp})`);
    console.log(`Optimized: ${optimized.branch} (${optimized.timestamp})`);
    console.log(`\nBaseline methodology: ${baseline.methodology.warmupRuns} warmup + ${baseline.methodology.measuredRuns} measured runs`);
    console.log(`Optimized methodology: ${optimized.methodology.warmupRuns} warmup + ${optimized.methodology.measuredRuns} measured runs`);

    console.log('\n' + '='.repeat(80));
    console.log('DETAILED COMPARISON');
    console.log('='.repeat(80));

    const comparisons = [];

    // Проходим по всем тестам из baseline
    for (const baselineTest of baseline.results) {
        const optimizedTest = findMatchingTest(baselineTest.test, optimized);

        if (!optimizedTest) {
            console.log(`\n⚠️  Test not found in optimized results: ${baselineTest.test}`);
            continue;
        }

        const improvement = calculateImprovement(baselineTest.mean, optimizedTest.mean);
        const isImprovement = improvement > 0;
        const significanceThreshold = 5; // 5% считаем значимым изменением

        comparisons.push({
            test: baselineTest.test,
            baselineMean: baselineTest.mean,
            optimizedMean: optimizedTest.mean,
            improvement,
            isSignificant: Math.abs(improvement) >= significanceThreshold,
            isImprovement
        });

        console.log(`\n${baselineTest.test}`);
        console.log('-'.repeat(80));
        console.log(`  Baseline:  ${formatNumber(baselineTest.mean)} ops/sec (CV: ${baselineTest.cv}%)`);
        console.log(`  Optimized: ${formatNumber(optimizedTest.mean)} ops/sec (CV: ${optimizedTest.cv}%)`);

        const improvementSymbol = isImprovement ? '📈' : '📉';
        const improvementText = isImprovement ? 'faster' : 'slower';
        const significanceText = Math.abs(improvement) >= significanceThreshold ? '✅ SIGNIFICANT' : '⚠️  Minor';

        console.log(`  Change:    ${improvementSymbol} ${improvement > 0 ? '+' : ''}${improvement.toFixed(2)}% ${improvementText} ${significanceText}`);

        // Показываем разброс значений
        console.log(`  Baseline range:  [${formatNumber(baselineTest.min)} - ${formatNumber(baselineTest.max)}]`);
        console.log(`  Optimized range: [${formatNumber(optimizedTest.min)} - ${formatNumber(optimizedTest.max)}]`);
    }

    // Сводная таблица
    console.log('\n\n' + '='.repeat(80));
    console.log('SUMMARY TABLE');
    console.log('='.repeat(80));
    console.log('\n');

    // Группируем по типу теста
    const lightObsComparisons = comparisons.filter(c => c.test.includes('light-observable'));
    const rxjsComparisons = comparisons.filter(c => c.test.includes('RxJS'));

    console.log('light-observable-ts Results:');
    console.log('-'.repeat(80));
    console.log(
        'Test'.padEnd(50) +
        'Baseline'.padEnd(15) +
        'Optimized'.padEnd(15) +
        'Change'.padEnd(10)
    );
    console.log('-'.repeat(80));

    for (const comp of lightObsComparisons) {
        const testName = comp.test.replace('light-observable - ', '');
        const improvementStr = (comp.improvement > 0 ? '+' : '') + comp.improvement.toFixed(2) + '%';
        const symbol = comp.isImprovement ? '📈' : '📉';

        console.log(
            testName.padEnd(50) +
            formatNumber(comp.baselineMean).padEnd(15) +
            formatNumber(comp.optimizedMean).padEnd(15) +
            `${symbol} ${improvementStr}`.padEnd(10)
        );
    }

    console.log('\n\nRxJS Results (для справки):');
    console.log('-'.repeat(80));
    console.log(
        'Test'.padEnd(50) +
        'Baseline'.padEnd(15) +
        'Optimized'.padEnd(15) +
        'Change'.padEnd(10)
    );
    console.log('-'.repeat(80));

    for (const comp of rxjsComparisons) {
        const testName = comp.test.replace('RxJS - ', '');
        const improvementStr = (comp.improvement > 0 ? '+' : '') + comp.improvement.toFixed(2) + '%';

        console.log(
            testName.padEnd(50) +
            formatNumber(comp.baselineMean).padEnd(15) +
            formatNumber(comp.optimizedMean).padEnd(15) +
            improvementStr.padEnd(10)
        );
    }

    // Статистика по улучшениям
    console.log('\n\n' + '='.repeat(80));
    console.log('PERFORMANCE IMPACT ANALYSIS');
    console.log('='.repeat(80));

    const significantImprovements = lightObsComparisons.filter(c => c.isSignificant && c.isImprovement);
    const significantRegressions = lightObsComparisons.filter(c => c.isSignificant && !c.isImprovement);
    const minorChanges = lightObsComparisons.filter(c => !c.isSignificant);

    console.log(`\nTotal tests: ${lightObsComparisons.length}`);
    console.log(`Significant improvements (≥5%): ${significantImprovements.length}`);
    console.log(`Significant regressions (≤-5%): ${significantRegressions.length}`);
    console.log(`Minor changes (<5%): ${minorChanges.length}`);

    if (significantImprovements.length > 0) {
        console.log('\n✅ Significant improvements:');
        for (const comp of significantImprovements) {
            console.log(`  • ${comp.test}: +${comp.improvement.toFixed(2)}%`);
        }
    }

    if (significantRegressions.length > 0) {
        console.log('\n⚠️  Significant regressions:');
        for (const comp of significantRegressions) {
            console.log(`  • ${comp.test}: ${comp.improvement.toFixed(2)}%`);
        }
    }

    // Общий средний прирост производительности
    const avgImprovement = lightObsComparisons.reduce((sum, c) => sum + c.improvement, 0) / lightObsComparisons.length;

    console.log(`\n📊 Average performance change: ${avgImprovement > 0 ? '+' : ''}${avgImprovement.toFixed(2)}%`);

    // Рекомендация
    console.log('\n' + '='.repeat(80));
    console.log('RECOMMENDATION');
    console.log('='.repeat(80));

    if (significantImprovements.length > 0 && significantRegressions.length === 0) {
        console.log('\n✅ APPROVE: Optimizations show clear performance improvements with no regressions.');
    } else if (significantImprovements.length > significantRegressions.length) {
        console.log('\n⚠️  CONDITIONAL APPROVE: More improvements than regressions, but review regressions carefully.');
    } else if (significantRegressions.length > 0) {
        console.log('\n❌ REVIEW NEEDED: Significant regressions detected. Further analysis required.');
    } else {
        console.log('\n➖ NEUTRAL: No significant changes detected. Optimizations may be too minor to measure reliably.');
    }

    console.log('\n' + '='.repeat(80));

    // Сохраняем сравнительный отчет
    const reportFile = 'benchmark-comparison-report.json';
    const report = {
        baseline: {
            branch: baseline.branch,
            timestamp: baseline.timestamp
        },
        optimized: {
            branch: optimized.branch,
            timestamp: optimized.timestamp
        },
        comparisons,
        summary: {
            totalTests: lightObsComparisons.length,
            significantImprovements: significantImprovements.length,
            significantRegressions: significantRegressions.length,
            minorChanges: minorChanges.length,
            averageImprovement: avgImprovement
        }
    };

    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\nDetailed comparison report saved to: ${reportFile}`);
    console.log('='.repeat(80));
}

if (require.main === module) {
    main();
}
