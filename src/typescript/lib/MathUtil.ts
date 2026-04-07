export function getMean(values: number[]): number {
    return values.reduce((partialSum, value) => partialSum + value) / values.length;
}

export function getMedian(values: number[]): number {
    return values.toSorted((a, b) => a - b)[Math.floor((values.length - 1) / 2)];
}