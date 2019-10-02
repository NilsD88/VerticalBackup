import { AlertsService } from './../../../../../src/app/services/alerts.service';
import {Component, Input, OnInit, EventEmitter} from '@angular/core';
import { IAsset } from 'src/app/models/asset.model';
import { ILocation } from 'src/app/models/g-location.model';
import { IAlert } from 'src/app/models/alert.model';

@Component({
  selector: 'pxs-map-asset-popup',
  templateUrl: './map-asset-popup.component.html',
  styleUrls: ['./map-asset-popup.component.scss']
})
export class MapAssetPopupComponent implements OnInit {
  @Input() asset: IAsset;
  @Input() location: ILocation;
  @Input() eventEmitter: EventEmitter<{location: ILocation, parent: ILocation}> = new EventEmitter<{location: ILocation, parent: ILocation}>();


  public lastAlert: IAlert;

  constructor(private alertsService: AlertsService) {}

  ngOnInit() {
    if (this.asset) {
      if (this.asset.lastAlert) {
        this.lastAlert = this.asset.lastAlert;
      } else {
        this.getLastAlert();
      }
    }
  }

  async getLastAlert() {
    const lastAlertPromise = this.alertsService.getLastAlertByAssetId(this.asset.id);
    this.lastAlert = await lastAlertPromise;
  }

  openLocation() {
    this.eventEmitter.emit({
        location: this.location,
        parent: this.location.parent
    });
  }

}

