import {Component, Input, OnInit} from '@angular/core';
import {Asset} from '../../../../../src/app/models/asset.model';
import { MatDialog } from '@angular/material/dialog';
import { LocationPopupComponent } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';
import { MOCK_LOCATIONS } from 'src/app/mocks/newlocations';

@Component({
  selector: 'pxs-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss']
})
export class DetailHeaderComponent implements OnInit {

  @Input() asset: Asset;

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
        selectedLocation: MOCK_LOCATIONS[2]
      }
    });
  }

}
