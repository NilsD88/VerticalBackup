import { IPointOfAttention } from 'src/app/models/point-of-attention.model';
import { IAsset } from 'src/app/models/asset.model';
import { isNullOrUndefined } from 'util';
import { IGeolocation } from './geolocation.model';
import { ICustomField } from './field.model';

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
    pointsOfAttention?: IPointOfAttention[];
    leftId?: string;
    rightId?: string;
    customFields?: ICustomField[];
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
    pointsOfAttention?: IPointOfAttention[] = [];
    leftId?: string;
    rightId?: string;
    customFields: ICustomField[] = [];
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
