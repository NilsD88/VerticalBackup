import { ISensorType } from './g-sensor-type.model';
import { IThing } from './g-thing.model';
import { IOrganization } from './g-organization.model';

export interface ISensor {
    id?: string;
    sensorType?: ISensorType;
    organization?: IOrganization;
    thing?: IThing;
    value?: string | number;
    timestamp?: number;
    data?: ISensorData[];
}


interface ISensorData {
    timestamp: number;
    avg: number;
    min: number;
    max: number;
    sum: number;
}
