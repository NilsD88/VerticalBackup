import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { WalkingTrailLocationService } from './../../../../services/walkingtrail/location.service';
import { IAsset } from '../../../../models/asset.model';
import { WalkingTrailAssetService } from './../../../../services/walkingtrail/asset.service';
import { ILocation } from 'src/app/models/location.model';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Map, Layer, LatLngBounds, latLngBounds, imageOverlay, CRS, tileLayer, latLng, geoJSON, divIcon, marker, Point } from 'leaflet';
import { IGeolocation, Geolocation } from 'src/app/models/geolocation.model';
import { GeoJsonObject } from 'geojson';
import {MAP_TILES_URL_ACTIVE} from 'src/app/shared/global';

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

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private assetService: WalkingTrailAssetService,
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

  private initMap() {
    this.populateMarkersWithTrails();
    const floorPlan = (this.location) ? this.location.image : null;
    if (floorPlan) {
      const image: HTMLImageElement = new Image();
      image.src = floorPlan;
      image.onload = () => {
        const { width, height } = image;
        const ratioW = height / width;
        const ratioH = width / height;
        this.imageBounds = latLngBounds([0, 0], [(image.width / 100) * ratioW, (image.height / 100) * ratioH]);
        const imageMap = imageOverlay(floorPlan, this.imageBounds);
        this.options = {
          crs: CRS.Simple,
          layers: [imageMap],
          zoom: 1,
          maxZoom: 12,
        };
        this.changeDetectorRef.detectChanges();
      };
    } else {
      this.options = {
        layers: tileLayer(MAP_TILES_URL_ACTIVE),
        zoom: 12,
        center: latLng(this.center.lat, this.center.lng),
        // tslint:disable-next-line: max-line-length
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      };
    }
  }

  private async populateMarkersWithTrails() {
    this.trailsLayer = [];
    this.assetsLayer = [];

    const trailIcon = (name, status) => divIcon({
      className: 'walking-trail',
      iconSize: null,
      html: `<div class="trail"><span class="status ${status}"></span><div class="name"><span>${name}</span></div></div>`
    });

    const children = this.location.children;
    if (children && children.length) {
      const sumsLastWeekUntilSameReference = (await this.locationService.getLocationsDataByIds(
        this.location.children.map(location => location.id),
        'WEEKLY',
        moment().startOf('isoWeek').subtract(1, 'weeks').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
        moment().subtract(1, 'weeks').valueOf()
      ).toPromise());

      const sumsThisWeekSameReference = (await this.locationService.getLocationsDataByIds(
        this.location.children.map(location => location.id),
        'WEEKLY',
        moment().startOf('isoWeek').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
        moment().valueOf()
      ).toPromise());

      for (const child of children) {
        child.parent = this.location;
        let sumLastWeekUntilSameReference = null;
        let sumThisWeekSameReference = null;

        const indexLastWeekRef = sumsLastWeekUntilSameReference.findIndex(x => x.id === child.id);
        if (indexLastWeekRef > -1) {
          const ref = sumsLastWeekUntilSameReference[indexLastWeekRef];
          if((ref.series || []).length) {
            sumLastWeekUntilSameReference = ref.series[0].valueIn;
          }
        }

        const indexWeekRef = sumsThisWeekSameReference.findIndex(x => x.id === child.id);
        if (indexWeekRef > -1) {
          const ref = sumsThisWeekSameReference[indexWeekRef];
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
            icon: trailIcon(child.name, status)
          }
        ).on('click', async (event) => {
          this.selectedTrail = child;
          const assets = await this.assetService.getAssetsByLocationId(child.id).toPromise();
          this.populateMarkersWithAssets(assets);
        });
        this.trailsLayer.push(newMarker);
      }
      this.setTrailBounds(this.location);
      this.fitBoundsAndZoomOnTrail();
    }
  }

  private populateMarkersWithAssets(assets: IAsset[]) {
    this.assetsLayer = [];
    this.trailsLayer = [];

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
        this.assetsLayer.push(newMarker);
      }
      this.fitBoundsAndZoomOnCheckpoints(assets);
    }
  }

  private setTrailBounds(location: ILocation = this.location) {
    const geoJsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[]]
      }
    };

    this.addLocationsBounds(geoJsonData, location);
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
      this.currentMap.fitBounds(this.trailBounds);
      setTimeout(() => {
        const currentZoom = this.currentMap.getZoom();
        this.currentMap.setView(this.leaf.geolocation, currentZoom - 1);
      }, 0);
    } else {
      setTimeout(() => {
        this.currentMap.panTo(this.leaf.geolocation);
      });
    }
  }

  public fitBoundsAndZoomOnCheckpoints(assets: IPeopleCountingAsset[]) {
    const bounds = this.getCheckpointBounds(assets);
    if (bounds.isValid()) {
      this.currentMap.fitBounds(bounds);
    } else {
      setTimeout(() => {
        this.currentMap.panTo(this.leaf.geolocation);
      });
    }
  }

  private addLocationsBounds(geoJsonData, location) {
    if (location) {
      const children = location.children;
      if (children && children.length) {
        children.forEach(child => {
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
    this.selectedTrail = null;
    this.initMap();
  }
}
