import { AbstractLocation } from '../g-location.model';

export interface IWalkingTrailLocation extends AbstractLocation<IWalkingTrailLocation> {
    amount?: number;
}
