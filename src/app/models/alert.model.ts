import {IOrganization, Organization} from './organization.model';
import {ISublocation, Sublocation} from './locations.model';
import {ISensorReading, SensorReading} from './sensor.model';
import {IThresholdAlert, ThresholdAlert} from './threshold.model';
import {isNullOrUndefined} from 'util';
import {Asset, IAsset} from './asset.model';

export interface IPagedAlerts {
  alerts: Alert[];
  pageNumber: number;
  totalElements: number;
}

export interface IAlert {
  id?: string | number;
  read: boolean;
  selected: boolean;
  organization: IOrganization | Organization;
  asset: IAsset | Asset;
  sublocation: ISublocation | Sublocation;

  // THRESHOLD ALERT
  thresholdAlert: IThresholdAlert | ThresholdAlert;

  // SENSORREADING
  sensorReading: ISensorReading | SensorReading;
}

export class Alert implements IAlert {
  public id: string | number;
  public selected: boolean;
  public read: boolean;
  public organization: Organization | IOrganization;
  public asset: Asset | IAsset;
  public sublocation: Sublocation | ISublocation;
  public thresholdAlert: IThresholdAlert | ThresholdAlert;
  public sensorReading: ISensorReading | SensorReading;

  constructor(private _alert: IAlert) {
    if (!isNullOrUndefined(_alert)) {
      this.id = _alert.id ? _alert.id : null;
      this.read = _alert.read ? _alert.read : false;
    } else {
      this.id = null;
      this.read = false;
    }
    this.thresholdAlert = new ThresholdAlert(_alert ? _alert.thresholdAlert : null);
    this.sensorReading = new SensorReading(_alert ? _alert.sensorReading : null);
    this.organization = new Organization(_alert ? _alert.organization : null);
    this.sublocation = new Sublocation(_alert ? _alert.sublocation : null);
    this.asset = new Asset(_alert ? _alert.asset : null);
  }

  public static createArray(values: IAlert[]): Alert[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new Alert(value);
      });
    } else {
      return [];
    }
  }

  public static createPagedArray(response: any): IPagedAlerts {
    if (!isNullOrUndefined(response.content)) {
      const alerts = response.content.map((value) => {
        return new Alert(value);
      });

      const pageNumber = response.number ? response.number : 0;
      const totalElements = response.totalElements ? response.totalElements : 0;

      return {alerts, pageNumber, totalElements};
    } else {
      return {alerts: [], pageNumber: 0, totalElements: 0};
    }
  }
}




