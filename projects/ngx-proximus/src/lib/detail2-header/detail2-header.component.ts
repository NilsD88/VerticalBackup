import {Component, Input, OnInit} from '@angular/core';
import {Asset} from '../../../../../src/app/models/asset.model';
import { MatDialog } from '@angular/material/dialog';
import { LocationPopupComponent } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';
import { MOCK_LOCATIONS } from 'src/app/mocks/newlocations';
import { INewAsset } from 'src/app/models/new-asset.model';

@Component({
  selector: 'pxs-detail2-header',
  templateUrl: './detail2-header.component.html',
  styleUrls: ['./detail2-header.component.scss']
})
export class Detail2HeaderComponent implements OnInit {

  @Input() asset: INewAsset;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
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
