import {isNullOrUndefined} from 'util';

export interface IMapPosition {
  x: number;
  y: number;
}

export class MapPosition implements IMapPosition {
  public x: number;
  public y: number;

  constructor(private _mapPosition: IMapPosition) {
    if (!isNullOrUndefined(_mapPosition)) {
      this.x = !isNullOrUndefined(_mapPosition.x) ? _mapPosition.x : null;
      this.y = !isNullOrUndefined(_mapPosition.y) ? _mapPosition.y : null;
    } else {
      this.x = null;
      this.y = null;
    }
  }

  public static createArray(values: IMapPosition[]): MapPosition[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new MapPosition(value);
      });
    } else {
      return [];
    }
  }

}
