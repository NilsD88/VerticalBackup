export interface ISensorDefinition {
    useOnChart: boolean;
    chartType: ChartType;
    useOnThresholdTemplate: boolean;
    aggregatedValues: IAggregatedValues;
}

export interface IAggregatedValues {
    min: boolean;
    max: boolean;
    avg: boolean;
    sum: boolean;
}

export type ChartType = 'linear' | 'bar';

export const chartTypes = ['linear', 'bar'];
export const aggregatedValues = ['min', 'max', 'avg', 'sum'];
