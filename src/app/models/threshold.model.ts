import { ISensorType } from './sensor-type.model';
import { IThresholdItem, IThresholdItemWithPercentRange } from './threshold-item.model';
import { IThresholdTemplate } from './threshold-template.model';

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

