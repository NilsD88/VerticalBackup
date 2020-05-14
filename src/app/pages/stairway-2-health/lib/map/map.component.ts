import { SharedService } from './../../../../services/shared.service';
import { Router } from '@angular/router';
import { MapComponent } from './../../../../../../projects/ngx-proximus/src/lib/map/map.component';
import { Component, OnInit, ChangeDetectorRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { AssetService } from 'src/app/services/asset.service';
import { LocationService } from 'src/app/services/location.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NgElement, WithProperties } from '@angular/elements';
import { Stairway2HealthMapPopupComponent } from './popup/popup.component';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { Marker } from 'leaflet';


@Component({
  selector: 'pvf-stairway2health-map',
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/map/map.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/map/map.component.scss']
})
export class Stairway2HealthMapComponent extends MapComponent implements OnInit, OnChanges {

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

  async ngOnInit() {
    super.ngOnInit();
  }


  createAssetPopup(asset: IPeopleCountingAsset, assetUrl: string, marker: Marker): any {
    const popupEl: NgElement & WithProperties<Stairway2HealthMapPopupComponent> =
      document.createElement('stairway2health-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    popupEl.marker = marker;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  createLocationPopup(location: IPeopleCountingLocation, leafUrl: string = null, marker: Marker): any {
    const popupEl: NgElement & WithProperties<Stairway2HealthMapPopupComponent> =
      document.createElement('stairway2health-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.goToChild = (loc) => { this.goToChild(loc, true); };
    popupEl.location = location;
    popupEl.marker = marker;
    document.body.appendChild(popupEl);
    return popupEl;
  }
}
