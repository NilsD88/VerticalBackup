import {Component, Input, OnInit} from '@angular/core';
import { ITankMonitoringAsset } from 'src/app/models/tankmonitoring/asset.model';
import { TankMonitoringAssetService } from 'src/app/services/tankmonitoring/asset.service';

@Component({
  selector: 'pvf-tankmonitoring-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss']
})
export class TankMonitoringMapPopupComponent implements OnInit {
  @Input() asset: ITankMonitoringAsset;

  constructor(
    private tankMonitoringAssetService: TankMonitoringAssetService
  ) {}

  ngOnInit() {
    this.tankMonitoringAssetService.getAssetPopupDetail(this.asset.id).subscribe((asset: ITankMonitoringAsset) => {
      this.asset = {
        ...this.asset,
        ...asset
      };
    });
  }
}

