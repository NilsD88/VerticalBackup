import { SharedService } from './../../../../../src/app/services/shared.service';
import {Component, Input, OnInit} from '@angular/core';
import {Asset} from '../../../../../src/app/models/asset.model';
import { MatDialog } from '@angular/material/dialog';
import { LocationPopupComponent } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';
import { MOCK_LOCATIONS } from 'src/app/mocks/newlocations';
import { IAsset } from 'src/app/models/g-asset.model';

@Component({
  selector: 'pxs-detail2-header',
  templateUrl: './detail2-header.component.html',
  styleUrls: ['./detail2-header.component.scss']
})
export class Detail2HeaderComponent implements OnInit {

  @Input() asset: IAsset;
  public orgName: string;

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.orgName = this.sharedService.user.orgName;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LocationPopupComponent, {
      minWidth: '320px',
      maxWidth: '600px',
      width: '100vw',
      data: {
        displayAssets: true,
        selectedLocation: this.asset.location
      }
    });
  }

}
