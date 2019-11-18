import { IWalkingTrailAsset } from './asset.model';
import { AbstractLocation } from '../g-location.model';

export interface IWalkingTrailLocation extends AbstractLocation<IWalkingTrailLocation, IWalkingTrailAsset> {
    series?: IWalkingTrailLocationSerie[];
}

export interface IWalkingTrailLocationSerie {
    timestamp: number;
    sum: number;
}
