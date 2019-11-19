import { IPeopleCountingLocation } from './location.model';
import {IAbstractAsset} from '../g-asset.model';

export interface IPeopleCountingAsset extends IAbstractAsset<IPeopleCountingLocation> {
    series?: IPeopleCountingAssetSerie[];
}

export interface IPeopleCountingAssetSerie {
    timestamp: number;
    value: number;
}