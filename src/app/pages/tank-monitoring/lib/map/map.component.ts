import { ITankMonitoringAsset } from './../../../../models/tankmonitoring/asset.model';
import { MapComponent } from './../../../../../../projects/ngx-proximus/src/lib/map/map.component';
import { Component, OnInit, ChangeDetectorRef, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NgElement, WithProperties } from '@angular/elements';
import { TankMonitoringMapPopupComponent } from '../map-popup/map-popup.component';
import { divIcon } from 'leaflet';
import { of } from 'rxjs';

const assetIconTankMonitoring = divIcon({
  className: 'map-marker-asset tank-monitoring',
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


@Component({
  selector: 'pvf-tankmonitoring-map',
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/map/map.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/map/map.component.scss']
})
export class TankMonitoringMapComponent extends MapComponent implements OnInit, OnChanges {

  @Input() tanks: ITankMonitoringAsset[] = [];

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public newAssetService: NewAssetService,
    public newLocationService: NewLocationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    super(
      changeDetectorRef,
      newAssetService,
      newLocationService,
      snackBar,
      dialog
    );
  }

  ngOnInit() {
    super.ngOnInit();
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
    return of(this.tanks.filter(tank => tank.location.id === locationId));
  }

  createAssetPopup(asset: ITankMonitoringAsset): any {
    const popupEl: NgElement & WithProperties<TankMonitoringMapPopupComponent> =
    document.createElement('tankmonitoring-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  generateAssetMarker(asset: ITankMonitoringAsset) {
    const status = asset.status;
    if (status === 'EMPTY') {
      return assetIconTankMonitoringEmptyFuel;
    } else if (status === 'LOW') {
      return assetIconTankMonitoringLowFuel;
    } else {
      return assetIconTankMonitoring;
    }
  }
}