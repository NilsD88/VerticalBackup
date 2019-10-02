import { ISensor } from './g-sensor.model';

export interface IThing {
    id?: string;
    devEui?: string;
    name?: string;
    batteryPercentage?: number;
    sensors?: ISensor[];
}
