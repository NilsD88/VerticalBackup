import { IAsset } from '../g-asset.model';

export interface ITankMonitoringAsset extends IAsset {
    status?: TTankMonitoringStatus;
    lastRefill?: {
        id?: string;
        timestamp?: string;
        value?: string;
    };
}

export type TTankMonitoringStatus = 'EMPTY' | 'LOW' | 'OK' | 'UNKNOW';
