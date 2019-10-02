import { ILocation } from './g-location.model';
import { ISensor } from './sensor.model';
import { IThreshold, IThresholdTemplate } from './threshold.model';
import { IGeolocation } from './asset.model';
import { IAlert } from './alert.model';
import { IThing } from './thing.model';
import { IOrganization } from './organization.model';
import { INewThresholdTemplate } from './new-threshold-template.model';

export interface IPagedNewAssets {
    data: INewAsset[];
    pageNumber: number;
    totalElements: number;
}

export interface INewAsset {
    id?: number | string;
    name?: string;
    locationId?: number;
    description?: string;
    sensors?: ISensor[];
    thumbnail?: string;
    geolocation?: IGeolocation;
    alerts?: IAlert[];
    things?: IThing[];
    location?: ILocation;
    thresholdTemplate?: INewThresholdTemplate;
    organization?: IOrganization;
    lastMeasurements?: any[]; // TODO: lastMeasurements
    lastAlert?: IAlert;
    timeLastMeasurementReceived?: Date;
    status?: 'OK' | 'LOW' | 'HIGH' | 'CRITICAL';
    image?: string;
    test?: any;
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
    location?: ILocation;
    thresholdTemplate?: INewThresholdTemplate;
    organization?: IOrganization;
    lastMeasurements?: any[]; // TODO: lastMeasurements
    lastAlert?: IAlert;
    timeLastMeasurementReceived?: Date;
    status?: 'OK' | 'LOW' | 'HIGH' | 'CRITICAL';
    image?: string;
    test?: any;

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
            this.locationId = null;
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
