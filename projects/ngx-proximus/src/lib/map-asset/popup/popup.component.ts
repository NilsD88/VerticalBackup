import {Component, Input, OnInit, EventEmitter} from '@angular/core';
import { IAsset } from 'src/app/models/asset.model';
import { ILocation } from 'src/app/models/location.model';
import { IAlert } from 'src/app/models/alert.model';

@Component({
  selector: 'pxs-map-asset-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class MapAssetPopupComponent implements OnInit {
  @Input() asset: IAsset;
  @Input() location: ILocation;
  @Input() eventEmitter: EventEmitter<{location: ILocation, parent: ILocation}> = new EventEmitter<{location: ILocation, parent: ILocation}>();


  public lastAlert: IAlert;

  constructor() {}

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
    //TODO: get last alerts
    /*
    const lastAlertPromise = this.alertsService.getLastAlertByAssetId(this.asset.id);
    this.lastAlert = await lastAlertPromise;
    */
  }

  openLocation() {
    this.eventEmitter.emit({
        location: this.location,
        parent: this.location.parent
    });
  }

}

