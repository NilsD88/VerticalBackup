import { Router } from '@angular/router';
import { MapComponent } from './../../../../../../projects/ngx-proximus/src/lib/map/map.component';
import { Component, OnInit, ChangeDetectorRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NgElement, WithProperties } from '@angular/elements';
import { StairwayToHealthMapPopupComponent } from './popup/popup.component';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { Marker } from 'leaflet';


@Component({
  selector: 'pvf-stairwaytohealth-map',
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/map/map.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/map/map.component.scss']
})
export class StairwayToHealthMapComponent extends MapComponent implements OnInit, OnChanges {

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public newAssetService: NewAssetService,
    public newLocationService: NewLocationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(
      changeDetectorRef,
      newAssetService,
      newLocationService,
      snackBar,
      dialog,
    );
  }

  ngOnInit() {
    super.ngOnInit();
  }


  createAssetPopup(asset: IPeopleCountingAsset, assetUrl: string, marker: Marker): any {
    const popupEl: NgElement & WithProperties<StairwayToHealthMapPopupComponent> =
      document.createElement('stairwaytohealth-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    popupEl.marker = marker;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  createLocationPopup(location: IPeopleCountingLocation, leafUrl: string = null, marker: Marker): any {
    const popupEl: NgElement & WithProperties<StairwayToHealthMapPopupComponent> =
      document.createElement('stairwaytohealth-map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.goToChild = (loc) => { this.goToChild(loc, true); };
    popupEl.location = location;
    popupEl.marker = marker;
    document.body.appendChild(popupEl);
    return popupEl;
  }
}
