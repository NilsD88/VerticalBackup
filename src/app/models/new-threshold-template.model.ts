import { ISensorType, SensorType } from './sensor.model';
import { isNullOrUndefined } from 'util';

export type SeverityLevel = 'LOW' | 'HIGH' | 'CRITICAL';

export interface INewThreshold {
    id: string | number;
    range: {
        from: number;
        to?: number;
    };
    severity: SeverityLevel;
    alert: {
        web: boolean;
        sms: boolean;
        mail: boolean
    };
    label?: string;
}

export class NewThreshold implements INewThreshold {

    public id: string | number;
    public severity: SeverityLevel;
    public label?: string;

    public range: {
        from: number;
        to?: number;
    };

    public alert: {
        web: boolean;
        sms: boolean;
        mail: boolean
    };

    constructor(private threshold: INewThreshold) {
        if (!isNullOrUndefined(threshold)) {
            this.id = threshold.id ? threshold.id : new Date().getTime();
            this.range.from = threshold.range && !isNullOrUndefined(threshold.range.from) ? threshold.range.from : null;
            this.range.to = threshold.range && !isNullOrUndefined(threshold.range.to) ? threshold.range.to : null;
            this.severity = threshold.severity ? threshold.severity : 'LOW';
            this.alert.mail = threshold.alert && threshold.alert.mail ? threshold.alert.mail : false;
            this.alert.sms = threshold.alert && threshold.alert.sms ? threshold.alert.sms : false;
            this.alert.web = threshold.alert && threshold.alert.web ? threshold.alert.web : false;
        } else {
            this.range = {
                from: null,
                to: null
            };
            this.severity = 'LOW';
            this.alert = {
                web: false,
                sms: false,
                mail: false
            };
        }
        delete this.threshold;
    }

    public static createArray(values: INewThreshold[]): NewThreshold[] {
        if (!isNullOrUndefined(values)) {
            return values.map((value) => {
                return new NewThreshold(value);
            });
        } else {
            return [];
        }
    }
}

export interface INewThresholdTemplate {
    id: string | number;
    name: string;
    metadata: {
        lastModificationDate: Date,
        creationDate: Date,
        lastModificationAuthor: string,
        creationAuthor: string,
    };
    sensors: {
        sensorType: ISensorType,
        thresholds: {
            id: string | number;
            range: {
                from: number;
                to?: number;
            },
            severity: SeverityLevel;
            alert: {
                web: boolean;
                sms: boolean;
                mail: boolean
            },
            label?: string;
        }[]
    }[];
}

export class NewThresholdTemplate implements INewThresholdTemplate {
    public id = null;
    public name = '';
    public metadata = {
        lastModificationDate: null,
        creationDate: null,
        lastModificationAuthor: null,
        creationAuthor: null,
    };
    public sensors = [];

    constructor(private thresholdTemplate: INewThresholdTemplate) {
        if (!isNullOrUndefined(thresholdTemplate)) {
            this.id = !isNullOrUndefined(thresholdTemplate.id) ? thresholdTemplate.id : null;
            this.name = !isNullOrUndefined(thresholdTemplate.name) ? thresholdTemplate.name : '';
            if (this.thresholdTemplate.sensors && this.thresholdTemplate.sensors.length) {
                this.sensors = this.thresholdTemplate.sensors.map((item) => {
                    return {
                        sensorType: new SensorType(item.sensorType),
                        thresholds: NewThreshold.createArray(item.thresholds)
                    };
                });
            } else {
                this.sensors = [];
            }
        }
    }
}

