import { ITankMonitoringAsset, TTankMonitoringStatus } from './asset.model';
import { AbstractLocation } from '../location.model';


export interface ITankMonitoringLocation extends AbstractLocation<ITankMonitoringLocation, ITankMonitoringAsset> {
    status?: TTankMonitoringStatus;
}
