import { ISensorType } from './g-sensor-type.model';
import { IThing } from './g-thing.model';
import { IOrganization } from './g-organization.model';

export interface ISensor {
    id?: string;
    sensorType?: ISensorType;
    organization?: IOrganization;
    thing?: IThing;
    // TODO: get data?
}

export interface ISensorReading extends ISensor {
    value: string | number;
    timestamp: number;
}
