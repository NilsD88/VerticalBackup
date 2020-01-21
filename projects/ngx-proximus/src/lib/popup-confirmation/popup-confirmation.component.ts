import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IPopupConfirmation {
  title: string;
  content: string;
  hideContinue?: boolean;
  continueButton?: string;
  cancelButton?: string;
}

// @dynamic
@Component({
  selector: 'pxs-popup-confirmation',
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.scss']
})
export class PopupConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPopupConfirmation,
  ) {}

  ngOnInit() {
    this.data.continueButton = this.data.continueButton || 'Continue';
    this.data.cancelButton = this.data.cancelButton || 'Cancel';
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
