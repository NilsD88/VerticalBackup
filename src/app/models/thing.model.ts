import { ISensor } from './sensor.model';
import { IAsset } from './asset.model';

export interface IThing {
    id?: string;
    devEui?: string;
    name?: string;
    batteryPercentage?: number;
    sensors?: ISensor[];
    assets?: IAsset[];
}
