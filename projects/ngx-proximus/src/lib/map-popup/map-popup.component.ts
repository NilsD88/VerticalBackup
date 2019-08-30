import { AlertsService } from './../../../../../src/app/services/alerts.service';
import {Component, Input, OnInit, EventEmitter} from '@angular/core';
import { INewLocation } from 'src/app/models/new-location';
import { IAlert } from 'src/app/models/alert.model';
import { INewAsset } from 'src/app/models/new-asset.model';

@Component({
  selector: 'pxs-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent implements OnInit {
  @Input() asset: INewAsset;
  @Input() location: INewLocation;
  @Input() goToSublocation;

  public lastAlert: IAlert;

  constructor(private alertsService: AlertsService) {}

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
    console.log("has no alert");
    const lastAlertPromise = this.alertsService.getLastAlertByAssetId(this.asset.id);
    this.lastAlert = await lastAlertPromise;
  }

  openLocation() {
    this.goToSublocation(this.location);
  }

}

