import {ISensorType, SensorType} from './sensor.model';
import {isNullOrUndefined} from 'util';

export interface IPagedThresholdTemplates {
  data: ThresholdTemplate[];
  pageNumber: number;
  totalElements: number;
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

export type SeverityLevel = 'LOW' | 'HIGH' | 'CRITICAL';

export interface INewThreshold {
  id: number;
  range: {
    from: number;
    to: number;
  };
  severity: SeverityLevel;
  alert: {
    notification: boolean;
    sms: boolean;
    mail: boolean;
  };
}


export class NewThresholdTemplate implements INewThresholdTemplate {
  public id = null;
  public isCustom = false;
  public name = '';
  public sensors: {
    sensorType: ISensorType | SensorType;
    thresholds: INewThreshold[];
  }[] = [];

  constructor(private thresholdTemplate: INewThresholdTemplate) {
    if (!isNullOrUndefined(thresholdTemplate)) {
      this.id = !isNullOrUndefined(thresholdTemplate.id) ? thresholdTemplate.id : null;
      this.isCustom = !isNullOrUndefined(thresholdTemplate.isCustom) ? thresholdTemplate.isCustom : false;
      this.name = !isNullOrUndefined(thresholdTemplate.name) ? thresholdTemplate.name : '';
      if (this.thresholdTemplate.sensors && this.thresholdTemplate.sensors.length) {
        this.sensors = this.thresholdTemplate.sensors.map((item) => {
          return {
            sensorType: new SensorType(item.sensorType),
            thresholds: NewThreshold.createArray(item.thresholds)
          };
        });
      } else {
        this.sensors = [];
      }
    } else {
      this.id = null;
      this.isCustom = false;
      this.name = '';
    }

  }
}

export class NewThreshold implements INewThreshold {

  public id: number;
  public range = {
    from: null,
    to: null
  };
  public severity: SeverityLevel = 'LOW';
  public alert = {
    notification: false,
    sms: false,
    mail: false
  };

  constructor(private _threshold: INewThreshold) {
    if (!isNullOrUndefined(_threshold)) {
      this.id = _threshold.id ? _threshold.id : new Date().getTime();
      this.range.from = _threshold.range && !isNullOrUndefined(_threshold.range.from) ? _threshold.range.from : null;
      this.range.to = _threshold.range && !isNullOrUndefined(_threshold.range.to) ? _threshold.range.to : null;
      this.severity = _threshold.severity ? _threshold.severity : 'LOW';
      this.alert.mail = _threshold.alert && _threshold.alert.mail ? _threshold.alert.mail : false;
      this.alert.sms = _threshold.alert && _threshold.alert.sms ? _threshold.alert.sms : false;
      this.alert.notification = _threshold.alert && _threshold.alert.notification ? _threshold.alert.notification : false;
    } else {
      this.range = {
        from: null,
        to: null
      };
      this.severity = 'LOW';
      this.alert = {
        notification: false,
        sms: false,
        mail: false
      };
    }
    delete this._threshold;
  }

  public static createArray(values: INewThreshold[]): NewThreshold[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new NewThreshold(value);
      });
    } else {
      return [];
    }
  }

}
