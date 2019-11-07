import { IWalkingTrailLocation } from './../../../../models/walkingtrail/location.model';
import { ITankMonitoringAsset } from './../../../../models/tankmonitoring/asset.model';
import { MapComponent } from './../../../../../../projects/ngx-proximus/src/lib/map/map.component';
import { Component, OnInit, ChangeDetectorRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NgElement, WithProperties } from '@angular/elements';
import { WalkingTrailMapPopupComponent } from './popup/popup.component';
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
  selector: 'pvf-walkingtrail-map',
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/map/map.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/map/map.component.scss']
})
export class WalkingTrailMapComponent extends MapComponent implements OnInit, OnChanges {

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

  createAssetPopup(asset: ITankMonitoringAsset): any {
    const popupEl: NgElement & WithProperties<WalkingTrailMapPopupComponent> =
    document.createElement('walkingtrail-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  createLocationPopup(location: IWalkingTrailLocation): any {
    const popupEl: NgElement & WithProperties<WalkingTrailMapPopupComponent> = document.createElement('walkingtrail-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.goToChild = (location) => { this.goToChild(location, true); };
    popupEl.location = location;
    document.body.appendChild(popupEl);
    return popupEl;
  }
}
