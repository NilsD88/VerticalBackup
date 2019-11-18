import { IWalkingTrailLocation } from './location.model';
import {IAbstractAsset} from '../g-asset.model';

export interface IWalkingTrailAsset extends IAbstractAsset<IWalkingTrailLocation> {
    series?: IWalkingTrailAssetSerie[];
}

export interface IWalkingTrailAssetSerie {
    timestamp: number;
    sum: number;
}