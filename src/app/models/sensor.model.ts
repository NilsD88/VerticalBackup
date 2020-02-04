import { ISensorDefinition } from './sensor-definition.model';
import { ISensorType } from './sensor-type.model';
import { IThing } from './thing.model';
import { IOrganization } from './organization.model';

export interface ISensor {
    id?: string;
    sensorType?: ISensorType;
    organization?: IOrganization;
    thing?: IThing;
    value?: string | number;
    timestamp?: number;
    series?: ISensorData[];
    sensorDefinition?: ISensorDefinition;
}


interface ISensorData {
    timestamp: number;
    avg?: number;
    min?: number;
    max?: number;
    sum?: number;
    value?: number;
}
