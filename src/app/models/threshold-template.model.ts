import { IThreshold } from './threshold.model';
import { isNullOrUndefined } from 'util';

export interface IThresholdTemplate {
    id?: string;
    name?: string;
    thresholds?: IThreshold[];
    hasAssetsAttached?: boolean;
}

export interface IThresholdTemplatePaged {
    thresholdTemplates?: IThresholdTemplate[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
}

export class ThresholdTemplate {
    id: string;
    name: string;
    thresholds: IThreshold[] = [];

    constructor(thresholdTemplate: IThresholdTemplate = null) {
        if (thresholdTemplate) {
            for (const key in thresholdTemplate) {
                if (!isNullOrUndefined(key)) {
                    this[key] = thresholdTemplate[key];
                }
            }
        }
    }
}
