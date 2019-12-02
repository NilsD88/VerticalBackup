import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'pxs-move-assets-popup',
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
    console.log(this.data);
    console.log(this.data.selectedLocation);
    console.log(this.data.selectedLocation.id);
    this.selectedLocationId = this.data.selectedLocation.id;
  }

  changeLocation(location) {
    console.log('change location to: ', location);
    this.selectedLocationId = location.id;
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
