import {Component, Input, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocationPopupComponent } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';
import { MOCK_LOCATIONS } from 'src/app/mocks/newlocations';
import { IAsset } from 'src/app/models/g-asset.model';
import { SharedService } from 'src/app/services/shared.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'pvf-tankmonitoring-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss']
})
export class DetailHeaderComponent implements OnInit {

  @Input() asset: IAsset;
  public orgName: string;

  public isNullOrUndefined = isNullOrUndefined;

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.orgName = this.sharedService.user.orgName;
  }

  openDialog(): void {
    this.dialog.open(LocationPopupComponent, {
      minWidth: '320px',
      maxWidth: '600px',
      width: '100vw',
      data: {
        displayAssets: true,
        selectedLocation: this.asset.location
      }
    });
  }

  parseLastValue(value: number) {
    return parseFloat(value.toFixed(2));
  }

}
