import { ISensorType } from './g-sensor-type.model';
import { IThresholdItem } from './g-threshold-item.model';

export interface IThreshold {
    sensorType?: ISensorType;
    thresholdItems?: IThresholdItem[];
}