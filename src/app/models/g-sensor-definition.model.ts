export interface ISensorDefinition {
    id?: string;
    name?: string;
    useOnChart?: boolean;
    chartType?: ChartType;
    useOnNotification?: boolean;
    aggregatedValues?: IAggregatedValues;
}

export interface IAggregatedValues {
    min: boolean;
    max: boolean;
    avg: boolean;
    sum: boolean;
}

export type ChartType = 'spline' | 'line' | 'column';

export const chartTypes = ['spline', 'line', 'column'];
export const aggregatedValues = ['min', 'max', 'avg', 'sum'];
