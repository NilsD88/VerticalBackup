import { ISensorType } from './g-sensor-type.model';
import { isNullOrUndefined } from 'util';

export interface IThresholdItem {
    id?: string;
    range?: IRange;
    label?: string;
    severity?: SeverityLevel;
    notification?: INotification;
    sensorType?: ISensorType;
}

export class ThresholdItem {
    id: string;
    range: IRange;
    label: string;
    severity: SeverityLevel;
    notification: INotification;
    sensorType: ISensorType;

    constructor(thresholdItem: IThresholdItem = null) {
        if (thresholdItem) {
            for (const key in thresholdItem) {
                if (!isNullOrUndefined(key)) {
                    this[key] = thresholdItem[key];
                }
            }
        }
    }
}




export interface IRange {
    from: number;
    to: number;
}

export interface INotification {
    web: boolean;
    mail: boolean;
    sms: boolean;
}

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';
