import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { WalkingTrailLocationService } from './../../../../services/walkingtrail/location.service';
import { IAsset } from '../../../../models/asset.model';
import { ILocation } from 'src/app/models/location.model';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Map, Layer, LatLngBounds, latLngBounds, imageOverlay, CRS, tileLayer, latLng, geoJSON, divIcon, marker, Point, layerGroup } from 'leaflet';
import { IGeolocation, Geolocation } from 'src/app/models/geolocation.model';
import { GeoJsonObject } from 'geojson';
import {MAP_TILES_URL_ACTIVE, UNKNOWN_PARENT_ID} from 'src/app/shared/global';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { Router } from '@angular/router';

declare global {
  interface Window {
    moment: any;
  }
}

moment.locale('fr-be');
window.moment = moment;
mTZ();

@Component({
  selector: 'pvf-trail-map',
  templateUrl: './trail-map.component.html',
  styleUrls: ['./trail-map.component.scss']
})
export class TrailMapComponent implements OnInit {

  @Input() height = 300;
  @Input() location: IPeopleCountingLocation;
  @Input() leaf: IPeopleCountingLocation;
  @Input() assetUrl: string;

  private currentMap: Map;
  private center: IGeolocation;

  public options: any;
  public trailsLayer: Layer[] = [];
  public assetsLayer: Layer[] = [];
  public imageBounds: LatLngBounds;
  public trailBounds: LatLngBounds;
  public selectedTrail: IPeopleCountingLocation;
  public markerClusterOptions: any;
  public UNKNOWN_PARENT_ID = UNKNOWN_PARENT_ID;

  private sumsLastWeekUntilSameReference = [];
  private sumsThisWeekSameReference = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private locationService: WalkingTrailLocationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.center = new Geolocation();
    this.markerClusterOptions = {
      iconCreateFunction(cluster) {
        const childCount = cluster.getChildCount();
        let c = ' marker-cluster-';

        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return divIcon({ html: '<div><span>' + childCount + '</span></div>',
         className: 'marker-cluster' + c, iconSize: new Point(40, 40) });
        }
    };

    this.initMap();
  }

  private async initMap() {
    let floorPlan = null;
    if (this.location.id === this.leaf.id || this.location.id === UNKNOWN_PARENT_ID) {
      this.selectedTrail = this.leaf;
    }
    if (this.selectedTrail) {
      floorPlan = this.selectedTrail ? this.selectedTrail.image : null;
    } else {
      floorPlan = this.location ? this.location.image : null;
    }
    if (floorPlan) {
      await new Promise(
        (resolve, reject) => {
          const image: HTMLImageElement = new Image();
          image.src = floorPlan;
          image.onload = () => {
            const { width, height } = image;
            const ratioW = height / width;
            const ratioH = width / height;
            this.imageBounds = latLngBounds([0, 0], [(image.width / 100) * ratioW, (image.height / 100) * ratioH]);
            const imageMap = imageOverlay(floorPlan, this.imageBounds);
            this.options = null;
            this.changeDetectorRef.detectChanges();
            this.options = {
              crs: CRS.Simple,
              layers: [imageMap],
              zoom: 1,
              maxZoom: 12,
            };
            resolve();
          };
          image.onerror = () => {
            reject();
          };
        }
      );
    } else {
      this.options = {
        layers: tileLayer(MAP_TILES_URL_ACTIVE),
        zoom: 12,
        center: latLng(this.center.lat, this.center.lng),
        // tslint:disable-next-line: max-line-length
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      };
    }
    if (this.selectedTrail) {
      this.populateMarkersWithAssets(this.selectedTrail.assets);
    } else {
      this.populateMarkersWithTrails();
    }
    this.changeDetectorRef.detectChanges();
  }

  private async populateMarkersWithTrails() {
    this.trailsLayer = [];
    this.assetsLayer = [];

    const markers = [];

    const trailIcon = (name, status, selected = false) => divIcon({
      className: 'walking-trail',
      iconSize: null,
      html: `<div class="trail"><span class="status ${status} ${selected ? 'selected' : ''}"></span><div class="name"><span>${name}</span></div></div>`
    });

    const children = this.location.children.filter(child => child.module === 'PEOPLE_COUNTING_WALKING_TRAIL');

    if (children && children.length) {

      if (!this.sumsLastWeekUntilSameReference.length) {
        try {
          this.sumsLastWeekUntilSameReference = (await this.locationService.getLocationsDataByIds(
            children.map(location => location.id),
            'WEEKLY',
            moment().startOf('isoWeek').subtract(1, 'weeks').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
            moment().subtract(1, 'weeks').valueOf()
          ).toPromise());
        } catch (error) {
          console.error(error);
        }
      }

      if (!this.sumsThisWeekSameReference.length) {
        try {
          this.sumsThisWeekSameReference = (await this.locationService.getLocationsDataByIds(
            children.map(location => location.id),
            'WEEKLY',
            moment().startOf('isoWeek').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
            moment().valueOf()
          ).toPromise());
        } catch (error) {
          console.error(error);
        }
      }

      for (const child of children) {
        child.parent = this.location;
        let sumLastWeekUntilSameReference = null;
        let sumThisWeekSameReference = null;

        const indexLastWeekRef = this.sumsLastWeekUntilSameReference.findIndex(x => x.id === child.id);
        if (indexLastWeekRef > -1) {
          const ref = this.sumsLastWeekUntilSameReference[indexLastWeekRef];
          if ((ref.series || []).length) {
            sumLastWeekUntilSameReference = ref.series[0].valueIn;
          }
        }

        const indexWeekRef = this.sumsThisWeekSameReference.findIndex(x => x.id === child.id);
        if (indexWeekRef > -1) {
          const ref = this.sumsThisWeekSameReference[indexWeekRef];
          if ((ref.series || []).length) {
            sumThisWeekSameReference = ref.series[0].valueIn;
          }
        }

        let status: string;
        if (sumLastWeekUntilSameReference === sumThisWeekSameReference) {
          status = 'equal';
        } else {
          status = sumLastWeekUntilSameReference > sumThisWeekSameReference ? 'down' : 'up';
        }

        const newMarker = marker(
          [child.geolocation.lat, child.geolocation.lng],
          {
            icon: trailIcon(child.name, status, this.leaf.id === child.id)
          }
        ).on('click', async () => {
          if (this.leaf.id === child.id) {
            if (this.leaf.assets.length) {
              if (!(!this.location.image && !child.image)) {
                this.options = null;
                this.changeDetectorRef.detectChanges();
              }
              this.trailsLayer = [];
              this.assetsLayer = [];
              this.changeDetectorRef.detectChanges();
              this.selectedTrail = this.leaf;
              this.initMap();
            }
          } else {
            this.router.navigateByUrl(`private/walkingtrail/trail/${child.id}`);
            this.ngOnInit();
          }
        });
        markers.push(newMarker);
      }

      this.trailsLayer.push(layerGroup(markers));

      this.setTrailBounds(children);
      this.fitBoundsAndZoomOnTrail();
    }
  }

  private populateMarkersWithAssets(assets: IAsset[]) {
    console.log('populateMarkersWithAssets', assets);
    this.assetsLayer = [];
    this.trailsLayer = [];

    const markers = [];

    const asstIcon = (name) => divIcon({
      className: 'walking-trail',
      iconSize: null,
      html: `<div class="checkpoint"><span></span><div class="name"><span>${name}</span></div></div>`
    });

    if (assets && assets.length) {
      for (const asset of assets) {
        const newMarker = marker(
          [asset.geolocation.lat, asset.geolocation.lng],
          {
            icon: asstIcon(asset.name)
          }
        ).on('click', async (event) => {
          this.router.navigateByUrl(`${this.assetUrl}${asset.id}`);
        });
        markers.push(newMarker);
      }
      this.assetsLayer.push(layerGroup(markers));
      this.fitBoundsAndZoomOnCheckpoints(assets);
    }
  }

  private setTrailBounds(locations: ILocation[]) {
    const geoJsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[]]
      }
    };
    this.addLocationsBounds(geoJsonData, locations);
    const geoJsonLayer = geoJSON(geoJsonData as GeoJsonObject);
    this.trailBounds = geoJsonLayer.getBounds();
  }

  private getCheckpointBounds(assets: IPeopleCountingAsset[]) {
    const geoJsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[]]
      }
    };
    this.addCheckpointsBounds(geoJsonData, assets);
    const geoJsonLayer = geoJSON(geoJsonData as GeoJsonObject);
    return geoJsonLayer.getBounds();
  }

  public fitBoundsAndZoomOnTrail() {
    if (this.trailBounds.isValid()) {
      if (
        this.trailBounds.getSouthWest().lat === this.trailBounds.getNorthEast().lat &&
        this.trailBounds.getSouthWest().lng === this.trailBounds.getNorthEast().lng
      ) {
        setTimeout(() => {
          if (!this.location.image) {
            this.currentMap.panTo(this.location.geolocation);
          }
        });
      } else {
        this.currentMap.fitBounds(this.trailBounds);
        setTimeout(() => {
          const currentZoom = this.currentMap.getZoom();
          if (this.location.geolocation) {
            this.currentMap.setView(this.location.geolocation, currentZoom - 1);
          }
        }, 0);
      }
    } else {
      setTimeout(() => {
        this.currentMap.panTo(this.location.geolocation);
      });
    }
  }

  public fitBoundsAndZoomOnCheckpoints(assets: IPeopleCountingAsset[]) {
    const bounds = this.getCheckpointBounds(assets);
    if (bounds.isValid()) {
      if (
        bounds.getSouthWest().lat === bounds.getNorthEast().lat &&
        bounds.getSouthWest().lng === bounds.getNorthEast().lng
      ) {
        setTimeout(() => {
          this.currentMap.panTo(bounds.getSouthWest());
        });
      } else {
        this.currentMap.fitBounds(bounds);
      }
    } else {
      setTimeout(() => {
        this.currentMap.panTo(this.selectedTrail.geolocation);
      });
    }
  }

  private addLocationsBounds(geoJsonData, locations) {
    if (location) {
      if (locations && locations.length) {
        locations.forEach(child => {
          const {lng, lat} = child.geolocation;
          geoJsonData.geometry.coordinates[0].push([lng, lat]);
        });
      }
    }
  }

  private addCheckpointsBounds(geoJsonData, assets: IPeopleCountingAsset[]) {
    if (assets && assets.length) {
      assets.forEach(asset => {
        const {lng, lat} = asset.geolocation;
        geoJsonData.geometry.coordinates[0].push([lng, lat]);
      });
    }
  }

  public onMapReady(map: Map) {
    this.currentMap = map;
    if (this.imageBounds) {
      this.currentMap.fitBounds(this.imageBounds);
      this.currentMap.setMaxBounds(this.imageBounds);
    }
  }

  public resetMap() {
    this.options = null;
    this.selectedTrail = undefined;
    this.imageBounds = undefined;
    this.changeDetectorRef.detectChanges();
    this.initMap();
  }
}
