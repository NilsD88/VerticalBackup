import { PopupConfirmationComponent, IPopupConfirmation } from './../popup-confirmation/popup-confirmation.component';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {EditImageDialogComponent} from './edit-image-dialog/edit-image-dialog.component';

@Component({
  selector: 'pxs-editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.css']
})
export class EditableImageComponent {
  @Input() image = '';
  @Input() dialogTitle = 'Edit image';
  @Input() ratio: number;
  @Input() maxWidthAndHeight = 0;
  @Input() confirmationMessage: IPopupConfirmation;

  @Output() change: EventEmitter<string> = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }

  onClick() {
    if (this.confirmationMessage) {
      this.openConfirmationDialog();
    } else {
      this.openEditImageDialog();
    }
  }

  private async openEditImageDialog() {
    const dialogRef = this.dialog.open(EditImageDialogComponent, {
      data: {
        image: this.image,
        title: this.dialogTitle,
        ratio: this.ratio,
        maxWidthAndHeight: this.maxWidthAndHeight
      },
      width: '100vw',
      maxHeight: '80vh',
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result) {
      this.image = result;
      this.change.emit(result);
    }
  }


  private openConfirmationDialog() {
    const dialogRef = this.dialog.open(PopupConfirmationComponent, {
      minWidth: '320px',
      maxWidth: '400px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        ...this.confirmationMessage
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openEditImageDialog();
      }
    });
  }


}
