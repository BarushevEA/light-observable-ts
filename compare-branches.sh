#!/bin/bash

set -e

echo "=== Benchmark Comparison: master vs performance-optimizations ==="
echo ""

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Create results directory
mkdir -p benchmark-results

# Function to run benchmarks
run_benchmarks() {
    local branch=$1
    echo ""
    echo "=== Running benchmarks on branch: $branch ==="

    # Install dependencies
    echo "Installing dependencies..."
    npm install --silent

    # Run comparison benchmark (vs RxJS)
    echo "Running benchmark:comparison..."
    npm run benchmark:comparison > "benchmark-results/${branch}-comparison.txt" 2>&1 || true

    # Run internal benchmarks
    echo "Running benchmark..."
    npm run benchmark > "benchmark-results/${branch}-internal.txt" 2>&1 || true

    echo "Benchmarks completed for $branch"
}

# Benchmark master
echo ""
echo "▶ Switching to master..."
git checkout master
run_benchmarks "master"

# Benchmark performance-optimizations
echo ""
echo "▶ Switching to feature/performance-optimizations..."
git checkout feature/performance-optimizations
run_benchmarks "performance-optimizations"

# Return to original branch
echo ""
echo "▶ Returning to $CURRENT_BRANCH..."
git checkout "$CURRENT_BRANCH"

echo ""
echo "=== Benchmark Results ==="
echo ""
echo "Master results:"
cat benchmark-results/master-comparison.txt || echo "No comparison results"
echo ""
echo "Performance-optimizations results:"
cat benchmark-results/performance-optimizations-comparison.txt || echo "No comparison results"

echo ""
echo "=== Comparison Complete ==="
