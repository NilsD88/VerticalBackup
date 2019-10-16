import { IRange } from './g-threshold-item.model';
import { IAsset } from './g-asset.model';
import { ISensorType } from './g-sensor-type.model';
import { IThing } from './g-thing.model';

export interface IAlert {
    id?: string;
    read?: boolean;
    thresholdTemplateName?: string;
    timestamp?: Date;
    asset?: IAsset;
    range?: IRange;
    severity?: string;
    label?: string;
    sensorType?: ISensorType;
    value?: number;
    thing?: IThing;
}

export interface IPagedAlerts {
    totalElements?: number;
    totalPages?: number;
    alerts?: [IAlert];
}
