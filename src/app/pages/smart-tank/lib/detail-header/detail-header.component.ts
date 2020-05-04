import { ISmartTankAsset } from 'src/app/models/smart-tank/asset.model';
import {Component, Input, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { SmartTankLocationPopupComponent } from '../location-popup/location-popup.component';

@Component({
  selector: 'pvf-smarttank-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss']
})
export class DetailHeaderComponent implements OnInit {

  @Input() asset: ISmartTankAsset;
  public orgName: string;

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.orgName = this.sharedService.user.orgName;
  }

  openDialog(): void {
    this.dialog.open(SmartTankLocationPopupComponent, {
      minWidth: '320px',
      maxWidth: '600px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        displayAssets: true,
        selectedLocation: this.asset.location
      }
    });
  }
}
