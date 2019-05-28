import {Alert, IAlert, IPagedAlerts} from './alert.model';
import {ISublocation, Sublocation} from './locations.model';
import {IOrganization, Organization} from './organization.model';
import {IAssembledThreshold, IThreshold, IThresholdTemplate, Threshold, ThresholdTemplate} from './threshold.model';
import {IThing, Thing} from './thing.model';
import {IMapPosition, MapPosition} from './map-position.model';
import {isNullOrUndefined} from 'util';
import {ISensor, Sensor} from './sensor.model';

export interface IAsset {
  id: number | string;
  name: string;
  description: string;
  meta1?: string;
  meta2?: string;
  meta3?: string;
  sensors?: ISensor[];
  pictureBase64: string;
  thumbnail: string;
  mediumImage: string;
  largeImage: string;
  thresholds?: IThreshold[];
  mapPosition: IMapPosition;
  alertsLoading?: boolean;
  alerts?: IAlert[];
  things?: IThing[];
  sublocation: ISublocation;
  thresholdTemplate: IThresholdTemplate;
  organization?: IOrganization;
  lastMeasurements?: any[]; // TODO: lastMeasurements
  timeLastMeasurementReceived?: Date;
}

export interface IPagedAssets {
  assets: Asset[];
  pageNumber: number;
  totalElements: number;
}

export interface IAssembledAsset {
  id: string | number;
  name: string;
  pictureBase64: string;
  thumbnail: string;
  mediumImage: string;
  largeImage: string;
  description: string;
  meta1?: string;
  meta2?: string;
  meta3?: string;
  mapPosition: IMapPosition;
  sublocationId: string | number,
  thresholdTemplateId: string | number;
  thresholds: IAssembledThreshold[];
  things: IThing[];
}


export class Asset implements IAsset {
  id: number | string;
  name: string;
  description: string;
  meta1: string;
  meta2: string;
  meta3: string;
  alertsLoading?: boolean;
  pictureBase64: string;
  thumbnail: string;
  mediumImage: string;
  largeImage: string;
  thresholds: Threshold[];
  mapPosition: MapPosition;
  alerts: Alert[];
  things: Thing[];
  sublocation: Sublocation;
  thresholdTemplate: ThresholdTemplate;
  organization: Organization;
  lastMeasurements: any[]; // TODO: lastMeasurements


  get timeLastMeasurementReceived(): Date {
    if (this.lastMeasurements && this.lastMeasurements.length) {
      const max = Math.max(...this.lastMeasurements.map((measurement): number => {
        return measurement.timestamp;
      }));
      if (max) {
        return new Date(max);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  get sensors() {
    const sensors = [];
    this.things.forEach((thing: Thing) => {
      (thing.sensors as any[]).forEach((sensor: any) => {
        sensor.name = thing.name;
        sensors.push(sensor);
      });
    });
    return sensors;
  }

  constructor(private _asset: IAsset) {
    if (!isNullOrUndefined(_asset)) {
      this.id = _asset.id;
      this.name = _asset.name;
      this.description = _asset.description;
      this.meta1 = _asset.meta1;
      this.meta2 = _asset.meta2;
      this.meta3 = _asset.meta3;
      this.thumbnail = _asset.thumbnail;
      this.mediumImage = _asset.mediumImage;
      this.largeImage = _asset.largeImage;
      this.pictureBase64 = _asset.pictureBase64;
      this.lastMeasurements = _asset.lastMeasurements; // TODO: Last measurements
    } else {
      this.id = null;
      this.name = '';
      this.description = '';
      this.meta1 = '';
      this.meta2 = '';
      this.meta3 = '';
      this.pictureBase64 = '';
      this.thumbnail = '';
      this.mediumImage = '';
      this.largeImage = '';
      this.lastMeasurements = []; // TODO: Last measurements
    }

    this.pictureBase64 = this.pictureBase64 ? this.pictureBase64 : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAZAAA/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAgagAAKl0AAEdfAABOmv/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8IAEQgDIAUAAwERAAIRAQMRAf/EANYAAQADAQEBAQEAAAAAAAAAAAAFBgcEAwECCQEBAAAAAAAAAAAAAAAAAAAAABAAAAUDAwMDBAMBAAAAAAAAAAIDBAUQNBVgARJQEzMgETEwQHAjwNAiIREAAQIBBAwNAwUAAgMAAAAAAgEDABARMpIhMXGREiJyssIzc9MgUGCBobHB0VLSg6OzUWFiMEBwQWPAokKCExIBAAAAAAAAAAAAAAAAAAAA0BMBAAECAgkDBAIDAQAAAAAAAREAITFREHBBYXGBkaHxIPDRMGCxwUBQwNDhgP/aAAwDAQACEQMRAAAB/swAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeZHEaRhdj0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhwEaRpGkYcJ8ANTJUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHKRpGEaRpHHmAAAAaCWcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHkRpGkaRhGnOAAAAAAAW8vIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPycBGkYRpGnCAAAAAADqJIkySKsQ4J00sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4yNI0jCNI8/AAAAAAB6EkSRJkkSZ0AApBTgdhrgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4kaRhGkaRp4AAAAAAH07ySJIkySO4+gAAAFaM8ANiPYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArpWCMOMAAAAAAHSSZJEmSRInoAAAAAAARplIBqBMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSKIAAAAD0JEkySJMkjpAAAAAAAAAAPyY2fkF+LUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQhmQAPp3EmSRJEmdx9AAAAAAAAAAAAAMpI0FsL4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAc5j4BeC2HoAAAAAAAAAAAAAAAAZ4VoE2aaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADITlBdC6AAHmfgAAAAAAAAAAAAAFRKYDpNYAAAB+z0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzIMFiNGAAM+KwAAAAAAAAAAAAAAAAAAAC1F+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKKVEHeayAAZ8VgAAAAAAAAAAAAAAAAAAAFqL8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVgz4H02M9AAZ8VgAAAAAAAAAAAAAAAAAAAFqL8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARRlgBqRLAAz4rAJIuoAAAAAAAAAAAAAAAAKQR4LUX4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8zHD4DQC0AAz4rAJo04AAAAAAAAAAAAAAAAGXEQC1F+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkxwAtxegAZ8VgE0acAAAAAAAAAAAAAAAADLiIBai/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzkroJs00AGfFYBNGnAAAAAAAAAAAAAAAAAy4iAWovwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKWUsHSa+ADPisAmjTgAAAAAAAAAAAAAAAAZcRALUX4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFdM5ANeOoAz4rAJo04AAAAAAAAAAAAAAAAGXEQC1F+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHmTgGmE4AZ8VgE0acAAAAAAAAAAAAAAAADLiIBai/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+GOHmC9FuAM+KwCaNOAAAAAAAAAAAAAAAABlxEAtRfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADLCKBZzQQDPisAmjTgAAAAAAAAAAAAAAAAZcRALUX4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz4rAJU1MAz4rAJo04AAAAAAAAAAAAAAAAGXEQC1F+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKgUYH7NkPoM+KwCaNOAAAAAAAAAAAAAAAABlxEAtRfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDMzANYJAGfFYBNGnAAAAAAAAAAAAAAAAAy4iAWovwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABymQgGjFiBnxWATRpwAAAAAAAAAAAAAAAAMuIgFqL8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADHznBcy6gz4rAJo04AAAAAAAAAAAAAAAAGXEQC1F+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmJCgsJo4M+KwCaNOAAAAAAAAAAAAAAAABlxEAtRfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUQqQO41oGfFYBNGnAAAAAAAAAAAAAAAAAy4iAWovwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKsUAH02I9TPisAmjTgAAAAAAAAAAAAAAAAZcRALUX4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQZcAakSxnxWATRpwAAAAAAAAAAAAAAAAMuIgFqL8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADyMcAL+Wkz4rAJo04AAAAAAAAAAAAAAAAGXEQC1F+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMlOEFtL2Z8VgE0acAAAAAAAAAAAAAAAADLiIBai/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGblfBNGnGfFYBNGnAAAAAAAAAAAAAAAAAy4iAWovwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSSmg6DYDPisAmjTgAAAAAAAAAAAAAAAAZcRALUX4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArhnQBbCvnGCaNOAAAAAAAAAAAAAAAABlxEAtRfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACOMoAAAJo04AAAAAAAAAAAAAAAAGXEQC1F+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPyY4fgAAE0acAAAAAAAAAAAAAAAADLiIBai/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyojAdp5nMD2JQAAAAAAAAAAAAAAAAEWeILUX4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEKfskj1M+KwAAAAAAAAAAAAAAAAAAAC1F+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABnxWAAAAAAAAAAAAAAAAAAAAWovwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKsQ4AAAAAAAAAAAAAAAAAAAJos4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIJAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBIIAAAAAABAIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJJAAAAAAAIIIAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAIJBAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIJAAAAAABBAIAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAABIIIAAAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAIJAAAAAAAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJJJJJJJJJJJJJIABJJJIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAJJJJJJJJJJJJJJJJJABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAIAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAIAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAIAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAIAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAIAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAIAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIIIBAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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';
    this.thresholds = Threshold.createArray(_asset ? _asset.thresholds : null);
    this.mapPosition = new MapPosition(_asset ? _asset.mapPosition : null);
    this.alerts = Alert.createArray(_asset ? _asset.alerts : null);
    this.things = Thing.createArray(_asset ? _asset.things : null);
    this.sublocation = new Sublocation(_asset ? _asset.sublocation : null);
    this.thresholdTemplate = new ThresholdTemplate(_asset ? _asset.thresholdTemplate : null);
    this.organization = new Organization(_asset ? _asset.organization : null);
  }

  public static createArray(values: IAsset[]): Asset[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new Asset(value);
      });
    } else {
      return [];
    }
  }

  public static createPagedArray(response: any): IPagedAssets {
    if (!isNullOrUndefined(response.content)) {
      const assets = response.content.map((value) => {
        return new Asset(value);
      });

      const pageNumber = response.number ? response.number : 0;
      const totalElements = response.totalElements ? response.totalElements : 0;

      return {assets, pageNumber, totalElements};
    } else {
      return {assets: [], pageNumber: 0, totalElements: 0};
    }
  }

  public assemble(): IAssembledAsset {
    const thresholds = [];
    for (const item of this.thresholds) {
      thresholds.push(new Threshold(item).assemble(this.thresholdTemplate.id));
    }
    return {
      id: this.id,
      name: this.name,
      pictureBase64: this.pictureBase64,
      thumbnail: this.thumbnail,
      mediumImage: this.mediumImage,
      largeImage: this.largeImage,
      description: this.description,
      meta1: this.meta1,
      meta2: this.meta2,
      meta3: this.meta3,
      mapPosition: this.mapPosition,
      sublocationId: this.sublocation.id,
      thresholdTemplateId: this.thresholdTemplate.id,
      thresholds: thresholds,
      things: this.things
    };
  }


}
