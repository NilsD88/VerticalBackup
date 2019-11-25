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
    customFields?: {};
    module?: string;
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
    assets?: IAsset[] = [];
    leftId?: string;
    rightId?: string;
    customFields?: {} = {};
    module?: string;

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

export interface IPagedAbstractLocations <TLocation> {
    locations?: TLocation[];
    pageNumber?: number;
    totalElements?: number;
    totalPages?: number;
}

export interface IPagedLocations extends IPagedAbstractLocations <ILocation> {}
