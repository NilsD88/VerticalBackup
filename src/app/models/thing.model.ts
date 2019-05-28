import {Alert, IAlert} from './alert.model';
import {ISensor, Sensor} from './sensor.model';
import {isNullOrUndefined} from 'util';

export interface IThing {
  id: number | string;
  devEui: string;
  name: string;
  batteryPercentage: number;
  unreadAlerts?: IAlert[];
  sensors?: ISensor[];
}

export class Thing implements IThing {
  public id: number | string;
  public devEui: string;
  public name: string;
  public batteryPercentage: number;
  public unreadAlerts?: IAlert[] | Alert[];
  public sensors?: ISensor[] | Sensor[];

  constructor(private _thing: IThing) {
    if (!isNullOrUndefined(_thing)) {
      this.id = _thing.id;
      this.devEui = _thing.devEui;
      this.name = _thing.name;
      this.batteryPercentage = _thing.batteryPercentage;
    } else {
      this.id = null;
      this.devEui = '';
      this.name = '';
      this.batteryPercentage = null;
    }
    this.unreadAlerts = Alert.createArray(_thing ? _thing.unreadAlerts : null);
    this.sensors = Sensor.createArray(_thing ? _thing.sensors : null);
  }

  public static createArray(values: IThing[]): Thing[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new Thing(value);
      });
    } else {
      return [];
    }
  }
}


