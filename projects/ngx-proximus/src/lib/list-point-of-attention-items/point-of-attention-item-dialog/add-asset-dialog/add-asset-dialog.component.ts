import { IAsset } from 'src/app/models/g-asset.model';
import { ILocation } from 'src/app/models/g-location.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PointOfAttentionItemDialogComponent } from '../point-of-attention-item-dialog.component';

interface IDialogData {
  selectedLocation: ILocation;
}

@Component({
  selector: 'pxs-add-asset-dialog',
  templateUrl: './add-asset-dialog.component.html',
  styleUrls: ['./add-asset-dialog.component.scss']
})
export class AddAssetDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PointOfAttentionItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) { }

  ngOnInit() {
  }

  public assetClicked(asset: IAsset) {
    this.dialogRef.close(asset);
  }


}
