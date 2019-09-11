import {ISensorType, SensorType} from './sensor.model';
import {isNullOrUndefined} from 'util';
import { INewThreshold } from './new-threshold-template.model';

export interface IPagedThresholdTemplates {
  data: INewThresholdTemplate[];
  pageNumber: number;
  totalElements: number;

  number?: number;
  size?: number;
  hasContent?: boolean;
  last?: boolean;
  numberOfElements?: number;
  totalPages?: number;
  first?: boolean;
  sort?: string;
}

export interface IThresholdAlert {
  sensorType: ISensorType | SensorType;
  type: 'DOUBLE' | 'INTEGER' | 'LONG' | 'NUMBER' | 'STRING' | 'BOOLEAN';
  high: number;
  low: number;
}

export class ThresholdAlert implements IThresholdAlert {
  public sensorType: ISensorType | SensorType;
  public type: 'DOUBLE' | 'INTEGER' | 'LONG' | 'NUMBER' | 'STRING' | 'BOOLEAN';
  public high: number;
  public low: number;

  constructor(private _thresholdAlert: IThresholdAlert) {
    if (!isNullOrUndefined(_thresholdAlert)) {
      this.type = _thresholdAlert.type ? _thresholdAlert.type : null;
      this.high = _thresholdAlert.high ? _thresholdAlert.high : 0;
      this.low = _thresholdAlert.low ? _thresholdAlert.low : 0;
    } else {
      this.type = null;
      this.high = 0;
      this.low = 0;
    }
    this.sensorType = new SensorType(_thresholdAlert ? _thresholdAlert.sensorType : null);
  }

  public static createArray(values: IThresholdAlert[]): ThresholdAlert[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new ThresholdAlert(value);
      });
    } else {
      return [];
    }
  }
}

export interface IThreshold {
  id?: string | number;
  sensorType: ISensorType;
  high: number;
  low: number;
  sensorTypeId: string | number;
  thresholdTemplateId?: string | number;
}

export interface IAssembledThreshold {
  id?: string | number;
  sensorTypeId?: string | number;
  high: number;
  low: number;
  thresholdTemplateId?: string | number;
}

export class Threshold implements IThreshold {
  public id: string | number;
  public sensorType: ISensorType;
  public high: number;
  public low: number;
  public sensorTypeId: string | number;
  public thresholdTemplateId?: string | number;

  constructor(private _threshold: IThreshold) {
    if (!isNullOrUndefined(_threshold)) {
      this.id = !isNullOrUndefined(_threshold.id) ? _threshold.id : null;
      this.high = _threshold.high ? _threshold.high : 0;
      this.low = _threshold.low ? _threshold.low : 0;
      this.sensorTypeId = _threshold.sensorTypeId ? _threshold.sensorTypeId : 0;
      this.thresholdTemplateId = _threshold.thresholdTemplateId ? _threshold.thresholdTemplateId : 0;
    } else {
      this.id = null;
      this.high = 0;
      this.low = 0;
      this.sensorTypeId = 0;
      this.thresholdTemplateId = 0;
    }
    this.sensorType = new SensorType(_threshold ? _threshold.sensorType : null);
  }

  public static createArray(values: IThreshold[]): Threshold[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new Threshold(value);
      });
    } else {
      return [];
    }
  }

  public assemble(id: string | number): IAssembledThreshold {
    return {
      id: this.id,
      sensorTypeId: this.sensorType.id,
      high: this.high,
      low: this.low,
      thresholdTemplateId: id
    };
  }
}

export interface IThresholdTemplate {
  id?: string | number;
  isCustom?: boolean;
  name: string;
  thresholds: IThreshold[] | Threshold[];
}

export class ThresholdTemplate implements ThresholdTemplate {
  public id: string | number;
  public name: string;
  public isCustom?: boolean;
  public thresholds: Threshold[];

  constructor(private _thresholdTemplate: IThresholdTemplate) {
    console.log(_thresholdTemplate);
    if (!isNullOrUndefined(_thresholdTemplate)) {
      this.id = _thresholdTemplate.id;
      this.name = _thresholdTemplate.name;
      this.isCustom = !!_thresholdTemplate.isCustom;
    } else {
      this.id = null;
      this.name = '';
      this.isCustom = false;
    }
    this.thresholds = Threshold.createArray(_thresholdTemplate ? _thresholdTemplate.thresholds : null);
  }

  public static createArray(values: IThresholdTemplate[]): ThresholdTemplate[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new ThresholdTemplate(value);
      });
    } else {
      return [];
    }
  }

  public static createPagedArray(response: any): IPagedThresholdTemplates {
    if (!isNullOrUndefined(response)) {
      const thresholdTemplates = response.map((value) => {
        console.log(value);
        return new ThresholdTemplate(value);
      });
      const pageNumber = response.number ? response.number : 0;
      const totalElements = response.totalElements ? response.totalElements : 0;

      return {data: thresholdTemplates, pageNumber, totalElements};
    } else {
      return {data: [], pageNumber: 0, totalElements: 0};
    }
  }
}


// TODO: Replace with old threshold templates once fully implemented
export interface INewThresholdTemplate {
  id?: string | number;
  isCustom?: boolean;
  name: string;
  sensors: {
    sensorType: ISensorType | SensorType;
    thresholds: INewThreshold[];
  }[];
}
