import {SharedService} from 'src/app/services/shared.service';
import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LocationPopupComponent} from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';
import {isNullOrUndefined} from 'util';
import {Asset} from '../../../../models/asset.model';

@Component({
  selector: 'pvf-peoplecounting-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss']
})
export class PeopleCountingDetailHeaderComponent implements OnInit {

  @Input() asset: Asset;
  public orgName: string;

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.orgName = this.sharedService.user.orgName;
  }

  openDialog(): void {
    this.dialog.open(LocationPopupComponent, {
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
