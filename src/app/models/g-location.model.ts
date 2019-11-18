import { IAsset } from 'src/app/models/g-asset.model';
import { isNullOrUndefined } from 'util';
import { IGeolocation } from './geolocation.model';

export interface AbstractLocation <TLocation, TAsset> {
    id?: string;
    parentId?: string;
    parent?: TLocation;
    name?: string;
    description?: string;
    geolocation?: IGeolocation;
    children?: TLocation[];
    image?: string;
    assets?: TAsset[];
    leftId?: string;
    rightId?: string;
}

export interface ILocation extends AbstractLocation <ILocation, IAsset> {}

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

export interface IPagedLocations {
    locations?: ILocation[];
    pageNumber?: number;
    totalElements?: number;
    totalPages?: number;
}