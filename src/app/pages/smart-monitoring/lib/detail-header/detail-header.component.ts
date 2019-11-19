import {SharedService} from 'src/app/services/shared.service';
import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LocationPopupComponent} from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';
import {isNullOrUndefined} from 'util';
import {Asset} from '../../../../models/g-asset.model';

@Component({
  selector: 'pvf-smartmonitoring-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss']
})
export class DetailHeaderComponent implements OnInit {

  @Input() asset: Asset;
  public orgName: string;

  public isNullOrUndefined = isNullOrUndefined;

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.orgName = this.sharedService.user.orgName;
    if (!isNullOrUndefined(this.asset.lastMeasurements)) {
      this.asset.lastMeasurements.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    }
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
