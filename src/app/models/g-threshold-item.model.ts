import { ISensorType } from './g-sensor-type.model';
import { isNullOrUndefined } from 'util';
import { IThreshold } from './g-threshold.model';

export interface IThresholdItem {
    id?: string;
    range?: IRange;
    label?: string;
    severity?: SeverityLevel;
    notification?: INotification;
    sensorType?: ISensorType;

    threshold?: IThreshold;
}

export class ThresholdItem {
    id: string;
    range: IRange;
    label: string;
    severity: SeverityLevel;
    notification: INotification;
    sensorType: ISensorType;
    threshold: IThreshold;

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

export class IThresholdItemWithPercentRange {
    range: IRangeWithPercent;
}

export interface IRangeWithPercent extends IRange {
    fromPercent: number;
    toPercent: number;
    widthPercent: number;
}

export interface INotification {
    web: boolean;
    mail: boolean;
    sms: boolean;
}

export enum SeverityLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    CRITICAL = 'CRITICAL'
}
