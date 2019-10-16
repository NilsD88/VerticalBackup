import { ISensorType } from './g-sensor-type.model';
import { IThresholdItem, IThresholdItemWithPercentRange } from './g-threshold-item.model';
import { IThresholdTemplate } from './g-threshold-template.model';

export interface IThreshold {
    sensorType?: ISensorType;
    thresholdItems?: IThresholdItem[];
    thresholdTemplate?: IThresholdTemplate;
}

export interface IThresholdWithLastValuesAndIndicators extends IThreshold {
    lastValues?: {
        sensorTypeId: string;
        thingName: string;
        value: number
    }[];
    indicators?: Map <number, number>;
    thresholdItems: IThresholdItemWithPercentRange[];
}

