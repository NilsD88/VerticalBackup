import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './delete-confirmation-popup.component.html',
  styleUrls: ['./delete-confirmation-popup.component.scss']
})
export class DeleteConfirmationPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationPopupComponent>,
  ) { }

  ngOnInit() {}

  cancel() {
    this.dialogRef.close(null);
  }
}
