import { SharedService } from './../../../../services/shared.service';
import { ITankMonitoringAsset, STATUSES, TTankMonitoringStatus } from './../../../../models/tankmonitoring/asset.model';
import { MapComponent } from './../../../../../../projects/ngx-proximus/src/lib/map/map.component';
import { Component, OnInit, ChangeDetectorRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { AssetService } from 'src/app/services/asset.service';
import { LocationService } from 'src/app/services/location.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NgElement, WithProperties } from '@angular/elements';
import { TankMonitoringMapPopupComponent } from './popup/popup.component';
import { divIcon, Marker, marker, Point } from 'leaflet';
import { of } from 'rxjs';
import { ILocation } from 'src/app/models/location.model';
import { ITankMonitoringLocation } from 'src/app/models/tankmonitoring/location.model';

const assetIconTankMonitoring = divIcon({
  className: 'map-marker-asset tank-monitoring',
  iconSize: null,
  html: '<div><span class="pxi-map-marker"></span></div>'
});

const assetIconTankMonitoringUnknownFuel = divIcon({
  className: 'map-marker-asset tank-monitoring unknown-fuel',
  iconSize: null,
  html: '<div><span class="pxi-map-marker"></span></div>'
});

const assetIconTankMonitoringLowFuel = divIcon({
  className: 'map-marker-asset tank-monitoring low-fuel',
  iconSize: null,
  html: '<div><span class="pxi-map-marker"></span></div>'
});

const assetIconTankMonitoringEmptyFuel = divIcon({
  className: 'map-marker-asset tank-monitoring empty-fuel',
  iconSize: null,
  html: '<div><span class="pxi-map-marker"></span></div>'
});

const locationIconTankMonitoring = divIcon({
  className: 'map-marker-location tank-monitoring',
  iconSize: null,
  html: '<div><span class="pxi-map-hotspot"></span></div>'
});

const locationIconTankMonitoringUnknownFuel = divIcon({
  className: 'map-marker-location tank-monitoring unknown-fuel',
  iconSize: null,
  html: '<div><span class="pxi-map-hotspot"></span></div>'
});

const locationIconTankMonitoringLowFuel = divIcon({
  className: 'map-marker-location tank-monitoring low-fuel',
  iconSize: null,
  html: '<div><span class="pxi-map-hotspot"></span></div>'
});

const locationIconTankMonitoringEmptyFuel = divIcon({
  className: 'map-marker-location tank-monitoring empty-fuel',
  iconSize: null,
  html: '<div><span class="pxi-map-hotspot"></span></div>'
});

@Component({
  selector: 'pvf-tankmonitoring-map',
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/map/map.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/map/map.component.scss']
})
export class TankMonitoringMapComponent extends MapComponent implements OnInit, OnChanges {

  @Input() tanks: ITankMonitoringAsset[] = [];

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public assetService: AssetService,
    public locationService: LocationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    protected sharedService: SharedService,
  ) {
    super(
      changeDetectorRef,
      assetService,
      locationService,
      snackBar,
      dialog,
      sharedService
    );
  }

  ngOnInit() {
    super.ngOnInit();
    // If there is only one root location, open it
    if (!this.rootLocation.id && this.rootLocation.children.length === 1) {
      this.goToChild(this.rootLocation.children[0], true);
    }
    this.markerClusterOptions = {
      iconCreateFunction(cluster) {
        const childCount = cluster.getChildCount();
        const markers = cluster.getAllChildMarkers();

        let status: TTankMonitoringStatus;
        const statuses = markers.map((x: any) => x.asset.status);
        for (const STATUS of STATUSES) {
          if (statuses.some(x => x === STATUS)) {
            status = STATUS;
          }
        }

        let c = ' marker-cluster-';

        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return divIcon({ html: '<div><span>' + childCount + '</span></div>',
         className: 'marker-cluster tank-monitoring ' + status.toLocaleLowerCase() + c, iconSize: new Point(40, 40) });
        }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tanks) {
      if (changes.tanks.currentValue !== changes.tanks.previousValue && (this.selectedLocation || {}).id) {
        this.assetsRequestSource.next();
      }
    }
  }

  getAssetsByLocation() {
    const locationId = this.selectedLocation.id;
    if (this.tanks) {
      return of(this.tanks.filter(tank => (tank.location || {}).id === locationId));
    } else {
      return of([]);
    }
  }

  protected populateLocations() {
    this.locationsLayer = [];
    this.selectedLocation = this.selectedLocation ? this.selectedLocation : this.rootLocation;
    const children = this.selectedLocation.children;

    if (children && children.length) {
      for (const child of children as ITankMonitoringLocation[]) {
        child.parent = this.selectedLocation;
        let locationIcon;
        switch (child.status) {
          case 'EMPTY':
            locationIcon = locationIconTankMonitoringEmptyFuel;
            break;
          case 'LOW':
            locationIcon = locationIconTankMonitoringLowFuel;
            break;
          case 'UNKNOWN':
            locationIcon = locationIconTankMonitoringUnknownFuel;
            break;
          default:
            locationIcon = locationIconTankMonitoring;
        }
        const newMarker = marker(
          [child.geolocation.lat, child.geolocation.lng],
          {
            icon: locationIcon,
          }
        ).bindPopup(() => this.createLocationPopup(child, this.leafUrl, newMarker));
        newMarker.on('mouseover', function() {
          this.openPopup();
        });
        this.locationsLayer.push(newMarker);
      }
    }
  }

  createAssetPopup(asset: ITankMonitoringAsset, assetUrl: string, marker: Marker): any {
    const popupEl: NgElement & WithProperties<TankMonitoringMapPopupComponent> =
    document.createElement('tankmonitoring-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.assetUrl = assetUrl;
    popupEl.asset = asset;
    popupEl.asset.location = this.selectedLocation;
    popupEl.marker = marker;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  createLocationPopup(location: ILocation, leafUrl: string = null, marker: Marker): any {
    const popupEl: NgElement & WithProperties<TankMonitoringMapPopupComponent> = 
      document.createElement('tankmonitoring-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.goToChild = (loc) => { this.goToChild(loc, true); };
    popupEl.location = location;
    popupEl.marker = marker;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  generateAssetIcon(asset: ITankMonitoringAsset) {
    const status = asset.status;
    switch (status) {
      case 'EMPTY':
        return assetIconTankMonitoringEmptyFuel;
      case 'LOW':
        return assetIconTankMonitoringLowFuel;
      case 'UNKNOWN':
        return assetIconTankMonitoringUnknownFuel;
      default:
        return assetIconTankMonitoring;
    }
  }
}
