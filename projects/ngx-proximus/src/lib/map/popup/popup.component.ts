import {Component, Input, OnInit} from '@angular/core';
import { ILocation } from 'src/app/models/g-location.model';
import { IAlert } from 'src/app/models/g-alert.model';
import { IAsset } from 'src/app/models/g-asset.model';

@Component({
  selector: 'pxs-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class MapPopupComponent implements OnInit {
  @Input() asset: IAsset;
  @Input() assetUrl: string;
  @Input() location: ILocation;
  @Input() goToChild;

  public lastAlert: IAlert;

  constructor() {}

  ngOnInit() {
    if (this.asset) {
      if (this.asset.lastAlert) {
        this.lastAlert = this.asset.lastAlert;
      } else {
        //this.getLastAlert();
      }
    }
  }

  async getLastAlert() {
    //TODO: get last alerts
    /*
    const lastAlertPromise = this.alertsService.getLastAlertByAssetId(this.asset.id);
    this.lastAlert = await lastAlertPromise;
    */
  }

  openLocation() {
    this.goToChild(this.location);
  }

}

