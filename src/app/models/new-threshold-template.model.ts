import { ISensorType } from './sensor.model';

export interface INewThresholdTemplate {
    id: string | number;
    name: string;
    sensors: {
        sensorType: ISensorType,
        thresholds: {
            range: {
                from: number;
                to?: number;
            },
            severity: string;
            alert: {
                web: boolean;
                sms: boolean;
                mail: boolean
            },
            label?: string;
        }[]
    }[];
}

