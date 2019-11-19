import { IPeopleCountingAsset } from './asset.model';
import { AbstractLocation } from '../g-location.model';

export interface IPeopleCountingLocation extends AbstractLocation<IPeopleCountingLocation, IPeopleCountingAsset> {
    series?: IPeopleCountingLocationSerie[];
}

export interface IPeopleCountingLocationSerie {
    timestamp: number;
    value: number;
}
