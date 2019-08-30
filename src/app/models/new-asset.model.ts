import { INewLocation } from './new-location';
import { ISensor } from './sensor.model';
import { IThreshold, IThresholdTemplate } from './threshold.model';
import { IGeolocation } from './asset.model';
import { IAlert } from './alert.model';
import { IThing } from './thing.model';
import { IOrganization } from './organization.model';


export interface INewAsset {
    id: number | string;
    name: string;
    locationId: number;
    description?: string;
    sensors?: ISensor[];
    thumbnail?: string;
    thresholds?: IThreshold[];
    geolocation?: IGeolocation;
    alerts?: IAlert[];
    things?: IThing[];
    location?: INewLocation;
    thresholdTemplate?: IThresholdTemplate;
    organization?: IOrganization;
    lastMeasurements?: any[]; // TODO: lastMeasurements
    lastAlert?: IAlert;
    timeLastMeasurementReceived?: Date;
    status?: 'OK' | 'LOW' | 'HIGH' | 'CRITICAL';
}

export class NewAsset implements INewAsset {
    id: number | string;
    name: string;
    locationId: number;
    description?: string;
    sensors?: ISensor[];
    thumbnail?: string;
    thresholds?: IThreshold[];
    geolocation?: IGeolocation;
    alerts?: IAlert[];
    things?: IThing[];
    location?: INewLocation;
    thresholdTemplate?: IThresholdTemplate;
    organization?: IOrganization;
    lastMeasurements?: any[]; // TODO: lastMeasurements
    lastAlert?: IAlert;
    timeLastMeasurementReceived?: Date;
    status?: 'OK' | 'LOW' | 'HIGH' | 'CRITICAL';

    constructor(private asset: INewAsset) {
        if (asset) {
            for (const property in asset) {
                if (this.hasOwnProperty(property)) {
                    this[property] = asset[property];
                }
            }
        } else {
            this.id = null;
            this.name = '';
            this.description = '';
        }
    }

    public static createArray(assets: INewAsset[]): NewAsset[] {
        if (assets) {
          return assets.map((value) => {
            return new NewAsset(value);
          });
        } else {
          return [];
        }
    }
}
