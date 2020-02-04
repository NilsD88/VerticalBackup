export interface ISensorDefinition {
    id?: string;
    name?: string;
    useOnChart?: boolean;
    chartType?: ChartType;
    useOnNotification?: boolean;
    aggregatedValues?: IAggregatedValues;
    inOutType?: InOutType;
}

export interface IAggregatedValues {
    min: boolean;
    max: boolean;
    avg: boolean;
    sum: boolean;
}

export type ChartType = 'spline' | 'line' | 'column';
export type InOutType = 'IN' | 'OUT' | 'BOTH';

export const chartTypes = ['spline', 'line', 'column'];
export const aggregatedValues = ['min', 'max', 'avg', 'sum'];
export const InOutValues = ['BOTH', 'IN', 'OUT'];
