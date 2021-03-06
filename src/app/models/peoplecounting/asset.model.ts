import { IPeopleCountingLocation } from './location.model';
import {IAbstractAsset} from '../asset.model';

export interface IPeopleCountingAsset extends IAbstractAsset<IPeopleCountingLocation> {
    series?: IPeopleCountingAssetSerie[];
}

export interface IPeopleCountingAssetSerie {
    timestamp: number;
    valueIn?: number;
    valueOut?: number;
}