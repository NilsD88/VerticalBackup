import {IOrganization, Organization} from './organization.model';
import {IThing, Thing} from './thing.model';
import {isNullOrUndefined} from 'util';

export interface ISensorReadingFilter {
  deveui: string;
  sensortypeid: number | string;
  from: number;
  to: number;
  interval: string; //'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export interface ISensorReading {
  devEui: string;
  timestamp: number;
  value: number;
}

export class SensorReading {
  devEui: string;
  timestamp: number;
  value: number;

  constructor(private _sensorReading: ISensorReading) {
    if (!isNullOrUndefined(_sensorReading)) {
      this.devEui = _sensorReading.devEui;
      this.timestamp = _sensorReading.timestamp;
      this.value = _sensorReading.value;
    } else {
      this.devEui = '';
      this.timestamp = null;
      this.value = null;
    }
  }

  public static createArray(values: ISensorReading[]): SensorReading[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new SensorReading(value);
      });
    } else {
      return [];
    }
  }
}


export interface ISensorType {
  id: string | number;
  name: string;
  postfix: string;
  min: number;
  max: number;
  type: string;
}

export class SensorType {
  id: string | number;
  name: string;
  postfix: string;
  min: number;
  max: number;
  type: string;

  constructor(private _sensorType: ISensorType) {
    if (!isNullOrUndefined(_sensorType)) {
      this.id = _sensorType.id;
      this.name = _sensorType.name;
      this.postfix = _sensorType.postfix;
      this.min = _sensorType.min;
      this.max = _sensorType.max;
      this.type = _sensorType.type;
    } else {
      this.id = null;
      this.name = '';
      this.postfix = '';
      this.min = 0;
      this.max = 0;
    }
  }

  public static createArray(values: ISensorType[]): SensorType[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new SensorType(value);
      });
    } else {
      return [];
    }
  }
}

export interface ISensor {
  devEui: string;
  organization: IOrganization | Organization;
  thing: IThing | Thing;
  sensorType: ISensorType | SensorType;
}

export class Sensor implements ISensor {
  devEui: string;
  organization: IOrganization | Organization;
  thing: IThing | Thing;
  sensorType: ISensorType | SensorType;

  constructor(private _sensor: ISensor | Sensor) {
    if (!isNullOrUndefined(_sensor)) {
      this.devEui = _sensor.devEui;
    } else {
      this.devEui = '';
    }

    this.organization = new Organization(_sensor ? _sensor.organization : null);
    this.thing = new Thing(_sensor ? _sensor.thing : null);
    this.sensorType = new SensorType(_sensor ? _sensor.sensorType : null);
  }

  public static createArray(values: ISensor[]): Sensor[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new Sensor(value);
      });
    } else {
      return [];
    }
  }
}
