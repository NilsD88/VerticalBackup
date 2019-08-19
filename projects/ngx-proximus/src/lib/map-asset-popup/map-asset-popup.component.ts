import { AlertsService } from './../../../../../src/app/services/alerts.service';
import {Component, Input, OnInit, EventEmitter} from '@angular/core';
import { IAsset } from 'src/app/models/asset.model';
import { INewLocation } from 'src/app/models/new-location';
import { IAlert } from 'src/app/models/alert.model';

@Component({
  selector: 'pxs-map-asset-popup',
  templateUrl: './map-asset-popup.component.html',
  styleUrls: ['./map-asset-popup.component.scss']
})
export class MapAssetPopupComponent implements OnInit {
  @Input() asset: IAsset;
  @Input() location: INewLocation;
  @Input() eventEmitter: EventEmitter<{location: INewLocation, parent: INewLocation}> = new EventEmitter<{location: INewLocation, parent: INewLocation}>();


  public lastAlert: IAlert;

  constructor(private alertsService: AlertsService) {}

  ngOnInit() {
    if (this.asset.lastAlert) {
      this.lastAlert = this.asset.lastAlert;
    } else {
      this.getLastAlert();
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

