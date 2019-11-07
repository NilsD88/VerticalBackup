import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// @dynamic
@Component({
  selector: 'pxs-popup-confirmation',
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.scss']
})
export class PopupConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<PopupConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, content: string}
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

}
