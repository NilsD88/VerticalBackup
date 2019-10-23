import { NewAssetService } from 'src/app/services/new-asset.service';
import {Component, Input, OnInit} from '@angular/core';
import { IAssetTM } from 'src/app/models/g-asset.model';

@Component({
  selector: 'pvf-tankmonitoring-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss']
})
export class TankMonitoringMapPopupComponent implements OnInit {
  @Input() asset: IAssetTM;

  constructor(
    private newAssetService: NewAssetService
  ) {}

  ngOnInit() {
    this.newAssetService.getAssetPopupDetail_TankMonitoring(this.asset.id).subscribe((asset: IAssetTM) => {
      this.asset = {
        ...this.asset,
        ...asset
      };
    });
  }
}

