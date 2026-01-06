#!/usr/bin/env node
/**
 * Скрипт для запуска бенчмарков с правильной методологией:
 * - 5 запусков для усреднения
 * - Прогрев кода (JIT warmup)
 * - Статистическая обработка результатов
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const NUM_RUNS = 5;
const WARMUP_RUNS = 2; // Количество прогревочных запусков (не учитываются в статистике)

console.log('='.repeat(60));
console.log('Benchmark Runner with Proper Methodology');
console.log('='.repeat(60));
console.log(`Warmup runs: ${WARMUP_RUNS}`);
console.log(`Measured runs: ${NUM_RUNS}`);
console.log(`Total runs: ${WARMUP_RUNS + NUM_RUNS}`);
console.log('='.repeat(60));

// Функция для парсинга результатов бенчмарка
function parseBenchmarkOutput(output) {
    const results = {};
    const lines = output.split('\n');

    for (const line of lines) {
        // Ищем строки вида: "test name x 123,456 ops/sec ±1.23% (89 runs sampled)"
        const match = line.match(/^(.+?)\sx\s([\d,]+)\sops\/sec/);
        if (match) {
            const name = match[1].trim();
            const opsPerSec = parseInt(match[2].replace(/,/g, ''), 10);
            results[name] = opsPerSec;
        }
    }

    return results;
}

// Функция для запуска одного бенчмарка
function runSingleBenchmark(runNumber, isWarmup = false) {
    const label = isWarmup ? 'WARMUP' : 'RUN';
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${label} ${isWarmup ? runNumber : runNumber - WARMUP_RUNS}/${isWarmup ? WARMUP_RUNS : NUM_RUNS}`);
    console.log('='.repeat(60));

    try {
        const output = execSync('npm run benchmark:comparison', {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        console.log(output);
        return parseBenchmarkOutput(output);
    } catch (error) {
        console.error(`Error running benchmark: ${error.message}`);
        return null;
    }
}

// Функция для вычисления статистики
function calculateStats(values) {
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;

    // Медиана
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];

    // Стандартное отклонение
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Коэффициент вариации (CV)
    const cv = (stdDev / mean) * 100;

    return {
        mean: Math.round(mean),
        median: Math.round(median),
        min: sorted[0],
        max: sorted[sorted.length - 1],
        stdDev: Math.round(stdDev),
        cv: cv.toFixed(2),
        values: values
    };
}

// Основная функция
function main() {
    console.log('\nChecking if benchmark script exists...');

    if (!fs.existsSync('./benchmark-comparison.ts')) {
        console.error('Error: benchmark-comparison.ts not found!');
        process.exit(1);
    }

    console.log('✓ Benchmark script found\n');

    // Собираем все результаты
    const allResults = {};

    // Прогревочные запуски
    console.log('\n' + '='.repeat(60));
    console.log('WARMUP PHASE - Results will not be counted');
    console.log('='.repeat(60));

    for (let i = 1; i <= WARMUP_RUNS; i++) {
        runSingleBenchmark(i, true);
        console.log(`\nWarmup ${i}/${WARMUP_RUNS} completed. Sleeping 2s...`);
        execSync('sleep 2');
    }

    // Измеряемые запуски
    console.log('\n' + '='.repeat(60));
    console.log('MEASUREMENT PHASE - These results will be averaged');
    console.log('='.repeat(60));

    for (let i = 1; i <= NUM_RUNS; i++) {
        const results = runSingleBenchmark(WARMUP_RUNS + i, false);

        if (results) {
            // Сохраняем результаты
            for (const [testName, opsPerSec] of Object.entries(results)) {
                if (!allResults[testName]) {
                    allResults[testName] = [];
                }
                allResults[testName].push(opsPerSec);
            }
        }

        if (i < NUM_RUNS) {
            console.log(`\nRun ${i}/${NUM_RUNS} completed. Sleeping 2s before next run...`);
            execSync('sleep 2');
        }
    }

    // Вычисляем и выводим статистику
    console.log('\n\n' + '='.repeat(60));
    console.log('STATISTICAL ANALYSIS');
    console.log('='.repeat(60));

    const statsResults = [];

    for (const [testName, values] of Object.entries(allResults)) {
        const stats = calculateStats(values);
        if (stats) {
            statsResults.push({ testName, stats });

            console.log(`\n${testName}`);
            console.log('-'.repeat(60));
            console.log(`  Mean:   ${stats.mean.toLocaleString()} ops/sec`);
            console.log(`  Median: ${stats.median.toLocaleString()} ops/sec`);
            console.log(`  Min:    ${stats.min.toLocaleString()} ops/sec`);
            console.log(`  Max:    ${stats.max.toLocaleString()} ops/sec`);
            console.log(`  StdDev: ${stats.stdDev.toLocaleString()} ops/sec`);
            console.log(`  CV:     ${stats.cv}%`);
            console.log(`  Raw values: [${stats.values.map(v => v.toLocaleString()).join(', ')}]`);
        }
    }

    // Сохраняем результаты в JSON
    const resultsFile = 'benchmark-results.json';
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const timestamp = new Date().toISOString();

    const outputData = {
        branch,
        timestamp,
        methodology: {
            warmupRuns: WARMUP_RUNS,
            measuredRuns: NUM_RUNS,
            totalRuns: WARMUP_RUNS + NUM_RUNS
        },
        results: statsResults.map(({ testName, stats }) => ({
            test: testName,
            mean: stats.mean,
            median: stats.median,
            min: stats.min,
            max: stats.max,
            stdDev: stats.stdDev,
            cv: parseFloat(stats.cv),
            rawValues: stats.values
        }))
    };

    fs.writeFileSync(resultsFile, JSON.stringify(outputData, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log(`Results saved to: ${resultsFile}`);
    console.log('='.repeat(60));

    // Выводим краткую сводку
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    const lightObsTests = statsResults.filter(r => r.testName.includes('light-observable'));
    const rxjsTests = statsResults.filter(r => r.testName.includes('RxJS'));

    console.log('\nlight-observable-ts:');
    lightObsTests.forEach(({ testName, stats }) => {
        console.log(`  ${testName}: ${stats.mean.toLocaleString()} ops/sec (±${stats.cv}%)`);
    });

    console.log('\nRxJS:');
    rxjsTests.forEach(({ testName, stats }) => {
        console.log(`  ${testName}: ${stats.mean.toLocaleString()} ops/sec (±${stats.cv}%)`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('Benchmark completed successfully!');
    console.log('='.repeat(60));
}

// Запуск
if (require.main === module) {
    main();
}
