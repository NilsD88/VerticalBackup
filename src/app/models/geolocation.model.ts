import { isNullOrUndefined } from 'util';

export interface IGeolocation {
    lng: number;
    lat: number;
}

export class Geolocation implements IGeolocation {
    lng: number;
    lat: number;

    constructor(geolocation: IGeolocation = null) {
        if (geolocation) {
            for (const key in geolocation) {
                if (!isNullOrUndefined(key)) {
                    this[key] = geolocation[key];
                }
            }
        } else {
            this.lat = 50.85045;
            this.lng = 4.34878;
        }
    }
}