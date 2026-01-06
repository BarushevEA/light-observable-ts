#!/bin/bash
# Скрипт для корректного сравнения производительности веток
# Использует методологию: 5 запусков на ветку с прогревом кода

set -e

RESULTS_DIR="benchmark-results"
MASTER_BRANCH="master"
PERF_BRANCH="feature/performance-optimizations"
NUM_RUNS=5

echo "==================================="
echo "Benchmark Comparison Script"
echo "==================================="
echo "Master branch: $MASTER_BRANCH"
echo "Performance branch: $PERF_BRANCH"
echo "Number of runs per branch: $NUM_RUNS"
echo "==================================="

# Создаем директорию для результатов
mkdir -p "$RESULTS_DIR"
rm -f "$RESULTS_DIR"/*.log

# Функция для запуска бенчмарка
run_benchmark() {
    local branch=$1
    local run_number=$2
    local output_file="$RESULTS_DIR/${branch//\//_}_run${run_number}.log"

    echo ""
    echo "Running benchmark on branch: $branch (run $run_number/$NUM_RUNS)"
    echo "Output: $output_file"

    # Переключаемся на ветку
    git checkout "$branch" 2>&1 | grep -v "Already on"

    # Устанавливаем зависимости (только если нет node_modules)
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install > /dev/null 2>&1
    fi

    # Собираем проект
    echo "Building project..."
    npm run build > /dev/null 2>&1

    # Запускаем бенчмарк
    echo "Running benchmark..."
    npm run benchmark:comparison 2>&1 | tee "$output_file"

    # Даем системе немного отдохнуть между запусками
    sleep 2
}

# Функция для усреднения результатов
calculate_average() {
    local branch=$1
    local pattern="$2"

    echo ""
    echo "==================================="
    echo "Calculating average for: $pattern"
    echo "Branch: $branch"
    echo "==================================="

    local sum=0
    local count=0

    for i in $(seq 1 $NUM_RUNS); do
        local file="$RESULTS_DIR/${branch//\//_}_run${i}.log"
        if [ -f "$file" ]; then
            # Извлекаем число ops/sec из строки с паттерном
            local value=$(grep "$pattern" "$file" | grep -oP '\d+[,\d]*(?= ops/sec)' | tr -d ',')
            if [ ! -z "$value" ]; then
                sum=$((sum + value))
                count=$((count + 1))
                echo "  Run $i: $(printf "%'d" $value) ops/sec"
            fi
        fi
    done

    if [ $count -gt 0 ]; then
        local avg=$((sum / count))
        echo "  Average: $(printf "%'d" $avg) ops/sec (from $count runs)"
        echo "$avg"
    else
        echo "  No data found"
        echo "0"
    fi
}

# Сохраняем текущую ветку
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

# Коммитим изменения если есть
if [ -n "$(git status --porcelain)" ]; then
    echo "Stashing current changes..."
    git stash
    STASHED=1
else
    STASHED=0
fi

# Запускаем бенчмарки на master
echo ""
echo "==================================="
echo "BENCHMARKING MASTER BRANCH"
echo "==================================="
for i in $(seq 1 $NUM_RUNS); do
    run_benchmark "$MASTER_BRANCH" $i
done

# Запускаем бенчмарки на performance-optimizations
echo ""
echo "==================================="
echo "BENCHMARKING PERFORMANCE BRANCH"
echo "==================================="
for i in $(seq 1 $NUM_RUNS); do
    run_benchmark "$PERF_BRANCH" $i
done

# Возвращаемся на исходную ветку
git checkout "$CURRENT_BRANCH" 2>&1 | grep -v "Already on"

# Восстанавливаем изменения
if [ $STASHED -eq 1 ]; then
    echo "Restoring stashed changes..."
    git stash pop
fi

# Вычисляем и выводим результаты
echo ""
echo ""
echo "==================================="
echo "FINAL RESULTS (AVERAGED)"
echo "==================================="

# Тесты для усреднения
declare -a TESTS=(
    "light-observable - creation and subscription"
    "RxJS - creation and subscription"
    "light-observable - эмиссия 100 значений"
    "RxJS - эмиссия 100 значений"
    "light-observable - фильтрация и трансформация"
    "RxJS - фильтрация и трансформация"
)

# Сохраняем результаты в CSV
CSV_FILE="$RESULTS_DIR/comparison_summary.csv"
echo "Test,Master Avg (ops/sec),Performance Avg (ops/sec),Improvement (%)" > "$CSV_FILE"

for test in "${TESTS[@]}"; do
    master_avg=$(calculate_average "$MASTER_BRANCH" "$test")
    perf_avg=$(calculate_average "$PERF_BRANCH" "$test")

    if [ "$master_avg" -gt 0 ] && [ "$perf_avg" -gt 0 ]; then
        improvement=$(echo "scale=2; (($perf_avg - $master_avg) * 100.0) / $master_avg" | bc)
        echo "\"$test\",$master_avg,$perf_avg,$improvement" >> "$CSV_FILE"
    fi
done

echo ""
echo "==================================="
echo "Results saved to: $CSV_FILE"
echo "Raw logs saved to: $RESULTS_DIR/"
echo "==================================="

cat "$CSV_FILE"

echo ""
echo "Benchmark comparison completed!"
