import { isNullOrUndefined } from 'util';
import { IGeolocation } from './geolocation.model';
import { IAsset } from './g-asset.model';

export interface AbstractLocation <T> {
    id?: string;
    parentId?: string;
    parent?: T;
    name?: string;
    description?: string;
    geolocation?: IGeolocation;
    children?: T[];
    image?: string;
    assets?: IAsset[];
    leftId?: string;
    rightId?: string;
}

export interface ILocation extends AbstractLocation <ILocation> {}

export class Location {
    id: string;
    parent?: ILocation;
    parentId?: string;
    name: string;
    description: string;
    geolocation?: IGeolocation;
    children?: ILocation[] = [];
    image?: string;
    assets?: IAsset[];
    leftId?: string;
    rightId?: string;

    constructor(location: ILocation = null) {
        if (location) {
            for (const key in location) {
                if (!isNullOrUndefined(key)) {
                    this[key] = location[key];
                }
            }
        }
    }
}
