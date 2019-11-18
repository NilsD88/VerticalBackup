import { ILocation } from 'src/app/models/g-location.model';
import { IWalkingTrailLocation, IWalkingTrailLocationSerie } from 'src/app/models/walkingtrail/location.model';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Map, Layer, LatLngBounds, latLngBounds, imageOverlay, CRS, tileLayer, latLng, geoJSON, divIcon, marker } from 'leaflet';
import { IGeolocation, Geolocation } from 'src/app/models/geolocation.model';
import { GeoJsonObject } from 'geojson';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';

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
  @Input() location: IWalkingTrailLocation;

  private currentMap: Map;
  private center: IGeolocation;

  public options: any;
  public trailsLayer: Layer[] = [];
  public imageBounds: LatLngBounds;
  public trailBounds: LatLngBounds;


  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.center = new Geolocation();
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
      this.setBounds();
      this.options = {
        // tslint:disable-next-line: max-line-length
        layers: tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw'),
        zoom: 12,
        center: latLng(this.center.lat, this.center.lng),
        // tslint:disable-next-line: max-line-length
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      };
    }
  }

  private populateMarkersWithTrails() {
    this.trailsLayer = [];

    const trailIcon = (name, status) => divIcon({
      className: 'walking-trail',
      iconSize: null,
      html: `<div class="trail"><span class="status ${status}"></span><div class="name"><span>${name}</span></div></div>`
    });

    const children = this.location.children;
    if (children && children.length) {
      for (const child of children) {
        child.parent = this.location;

        // TODO: Get these data from backend
        const sumLastWeekUntilSameReference = Math.floor(Math.random() * 101);
        const sumThisWeekSameReference = Math.floor(Math.random() * 101);

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
        );
        /*
        .bindPopup(() => this.createLocationPopup(child)).openPopup();
        */
        this.trailsLayer.push(newMarker);
      }
    }
  }

  private setBounds(location: ILocation = this.location) {
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

  public fitBoundsAndZoom() {
    if (this.trailBounds.isValid()) {
      this.currentMap.fitBounds(this.trailBounds);
      setTimeout(() => {
        const currentZoom = this.currentMap.getZoom();
        this.currentMap.setZoom(currentZoom - 0.75);
      }, 0);
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

  public onMapReady(map: Map) {
    this.currentMap = map;

    if (this.imageBounds) {
      this.currentMap.fitBounds(this.imageBounds);
      this.currentMap.setMaxBounds(this.imageBounds);
    } else if (this.trailBounds) {
      if (this.trailBounds.getNorthEast() && this.trailBounds.getSouthWest()) {
        this.fitBoundsAndZoom();
      } else {
        const parent = this.location.parent;
        if (parent) {
          if (parent.geolocation) {
            const {lat, lng} = this.location.parent.geolocation;
            this.currentMap.panTo({lng, lat});
            this.currentMap.setZoom(12);
          } else {
            this.setBounds(this.location.parent);
            this.fitBoundsAndZoom();
          }
        }
      }
    }
  }
}




function generatePastWeekOfDataSeries(): IWalkingTrailLocationSerie[] {
  const dataSeries: IWalkingTrailLocationSerie[] = [];
  for (let index = 0; index < 7; index++) {
    dataSeries.push(
      {
        timestamp: moment().startOf('isoWeek').add(index, 'day').valueOf(),
        sum: Math.floor(Math.random() * 101)
      }
    );
  }
  return dataSeries;
}

function generateThisWeekOfDataSeries(): IWalkingTrailLocationSerie[] {
  const dataSeries: IWalkingTrailLocationSerie[] = [];
  const dayNumber = moment().isoWeekday();

  for (let index = 1; index <= dayNumber; index++) {
    dataSeries.push(
      {
        timestamp: moment().subtract(index - 1, 'day').valueOf(),
        sum: Math.floor(Math.random() * 101)
      }
    );
  }
  return dataSeries;
}