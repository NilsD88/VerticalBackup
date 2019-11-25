import { IPeopleCountingAsset } from './asset.model';
import { AbstractLocation, IPagedAbstractLocations } from '../g-location.model';

export interface IPeopleCountingLocation extends AbstractLocation<IPeopleCountingLocation, IPeopleCountingAsset> {
    series?: IPeopleCountingLocationSerie[];
    images?: string[];
    cover?: string;
}

export interface IPeopleCountingLocationSerie {
    timestamp: number;
    value: number;
}

export interface IPagedPeopleCountingLocations extends IPagedAbstractLocations <IPeopleCountingLocation> {}