import { ISmartTankAsset, TSmartTankStatus } from './asset.model';
import { AbstractLocation } from '../location.model';


export interface ISmartTankLocation extends AbstractLocation<ISmartTankLocation, ISmartTankAsset> {
    status?: TSmartTankStatus;
}
