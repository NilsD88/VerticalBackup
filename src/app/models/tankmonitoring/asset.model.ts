import { IAsset } from '../asset.model';

export interface ITankMonitoringAsset extends IAsset {
    fillLevel?: number;
    batteryLevel?: number;
    status?: TTankMonitoringStatus;
    lastRefill?: {
        id?: string;
        timestamp?: string;
        value?: string;
    };
}

export type TTankMonitoringStatus = 'EMPTY' | 'LOW' | 'OK' | 'UNKNOWN';

export const STATUSES: TTankMonitoringStatus[] = ['OK', 'LOW', 'UNKNOWN', 'EMPTY'];
