import { IAsset } from '../asset.model';

export interface ISmartTankAsset extends IAsset {
    fillLevel?: number;
    batteryLevel?: number;
    status?: TSmartTankStatus;
    lastRefill?: {
        id?: string;
        timestamp?: string;
        value?: string;
    };
}

export type TSmartTankStatus = 'EMPTY' | 'LOW' | 'OK' | 'UNKNOWN';

export const STATUSES: TSmartTankStatus[] = ['OK', 'LOW', 'UNKNOWN', 'EMPTY'];
