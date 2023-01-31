export function deleteFromArray<T>(arr: T[], component: T): boolean {
    const index = arr.indexOf(component);
    if (index === -1) return false;
    const length = arr.length - 1;
    for (let i = index; i < length;) arr[i++] = arr[i];
    arr.length = length;
    return true;
}
