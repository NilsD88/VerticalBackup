import { IRange } from './threshold-item.model';
import { IAsset } from './asset.model';
import { ISensorType } from './sensor-type.model';
import { IThing } from './thing.model';

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
