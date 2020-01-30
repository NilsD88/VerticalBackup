import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './move-assets-popup.component.html',
  styleUrls: ['./move-assets-popup.component.scss']
})
export class MoveAssetsPopupComponent implements OnInit {

  public selectedLocationId: string;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MoveAssetsPopupComponent>,
  ) {}

  ngOnInit() {
    this.selectedLocationId = this.data.selectedLocation.id;
  }

  changeLocation(location) {
    this.selectedLocationId = location.id;
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
