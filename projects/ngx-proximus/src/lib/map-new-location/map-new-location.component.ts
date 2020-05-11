import { LocationService } from 'src/app/services/location.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges} from '@angular/core';
import { IGeolocation } from 'src/app/models/geolocation.model';
import { Map, latLng, tileLayer, icon, Layer, marker, LatLngBounds, latLngBounds, imageOverlay, CRS, Point } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { ILocation } from 'src/app/models/location.model';
import { isNullOrUndefined } from 'util';
import { MAP_TILES_URL_ACTIVE, DEFAULT_LOCATION } from 'src/app/shared/global';

@Component({
  selector: 'pxs-map-new-location',
  templateUrl: './map-new-location.component.html',
  styleUrls: ['./map-new-location.component.scss']
})
export class MapNewLocationComponent implements OnInit {

  @Input() parentLocation: ILocation;
  @Input() geolocation: IGeolocation;

  @Output() notify: EventEmitter<IGeolocation> = new EventEmitter<IGeolocation>();

  currentMap: Map;
  options: any;
  layers: any[];
  markers: Layer[] = [];
  imageBounds: LatLngBounds;
  backgroundLayer: Layer;
  provider: OpenStreetMapProvider;
  showNotifIfNoAddress = false;
  floorplan: string;

  constructor(
    public snackBar: MatSnackBar,
    private translateService: TranslateService,
    private locationService: LocationService
  ) {}

  public async ngOnInit() {
    this.floorplan = null;
    if (this.parentLocation && !isNullOrUndefined(this.parentLocation.id)) {
      this.floorplan = await this.locationService.getFloorplanOfLocationById(this.parentLocation.id).toPromise();
      if (this.floorplan) {
        const image: HTMLImageElement = new Image();
        image.src = this.floorplan;
        image.onload = () => {
          const { width, height } = image;
          const ratioW = height / width;
          const ratioH = width / height;
          this.imageBounds = latLngBounds([0, 0], [(image.width / 100) * ratioW, (image.height / 100) * ratioH]);
          const imageMap = imageOverlay(this.floorplan, this.imageBounds);
          this.backgroundLayer = imageMap;
          this.options = {
            crs: CRS.Simple,
            layers: this.backgroundLayer,
            zoom: 20,
          };
        }
      } else {
        // By default, center with Proximus location
        const { lat, lng } = this.parentLocation.geolocation || DEFAULT_LOCATION;
        this.backgroundLayer = tileLayer(MAP_TILES_URL_ACTIVE),
        this.options = {
          layers: this.backgroundLayer,
          zoom: 13,
          center: latLng(lat, lng),
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        };
      }
    } else {
      this.createOptionsMapWithUserGeolocation();
    }

    if (this.geolocation) {
      this.addMarker(this.geolocation);
    }
  }


  onMapReady(map: Map) {
    this.currentMap = map;

    if (this.imageBounds) {
      this.currentMap.fitBounds(this.imageBounds);
      this.currentMap.setMaxBounds(this.imageBounds);
    } else {
      if (this.geolocation) {
        map.panTo(this.geolocation);
      }
      this.provider = new OpenStreetMapProvider();
      const a = new GeoSearchControl({
        provider: this.provider,
        style: 'bar',
        showMarker: false,
        autoClose: true,
        autoComplete: true,
        autoCompleteDelay: 250,
        searchLabel: 'Enter address or geolocation (lattitude, longitude)',
      }).addTo(this.currentMap);

      map.on('geosearch/showlocation', (event: any) => {
        this.addMarker({
          lat: event.location.y,
          lng: event.location.x
        });
      });
    }
  }

  onMapClick(event) {
    const containerPoint: Point = event.containerPoint;
    let shouldAddMarker = false;
    if (containerPoint.y < 50) {
      if (containerPoint.x < 180 || containerPoint.x > 590) {
        shouldAddMarker = true;
      }
    } else {
      shouldAddMarker = true;
    }
    if (shouldAddMarker) {
      const { lat, lng } = event.latlng;
      this.addMarker({lat, lng});
    }
  }

  eventHandler(event) {
    event.preventDefault();
    if (event.path && event.path.length) {
      if (event.path[0].className === 'glass ') {
        if (event.path[0].value) {
          this.markers = [];
          this.snackBar.open(this.translateService.instant('NOTIFS.NO_ADDRESS_FOUND'), null, {
            duration: 2000,
            panelClass: ['orange-snackbar']
          });
        }
      }
    }
  }

  createOptionsMapWithUserGeolocation() {
    this.backgroundLayer = tileLayer(MAP_TILES_URL_ACTIVE);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.options = {
            layers: this.backgroundLayer,
            zoom: 13,
            center: latLng(latitude, longitude),
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          };
        },
        (error) => {
          this.defaultMap();
        }
      );
    } else {
      this.defaultMap();
    }
  }

  private defaultMap() {
    const defaultValue = {lat: 50.85045, lng: 4.34878};
    this.options = {
      layers: this.backgroundLayer,
      zoom: 12,
      center: latLng(defaultValue.lat, defaultValue.lng),
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    };
  }

  addMarker(geolocation: IGeolocation) {
    const {lat, lng} = geolocation;
    const newMarker = marker(
      [ lat, lng ],
      {
        icon: icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png'
        }),
        draggable: true,
      }
    ).on('dragend', (event) => {
      this.sendNotifyEvent({
        lat: +event.target._latlng.lat,
        lng: +event.target._latlng.lng
      });
    });

    this.markers = [];
    this.markers.push(newMarker);

    this.sendNotifyEvent({
      lat,
      lng
    });
  }

  sendNotifyEvent(geolocation: IGeolocation): void {
    this.notify.emit(geolocation);
  }

  addMarkerWithUserPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.currentMap.flyTo({lat: latitude, lng: longitude}, 18);
        this.addMarker({
          lat: latitude,
          lng: longitude
        });
      });
    }
  }

  removeMarker() {
    this.markers = [];
    this.sendNotifyEvent(null);
  }
}
