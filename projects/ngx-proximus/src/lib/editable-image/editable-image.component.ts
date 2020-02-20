import { cloneDeep } from 'lodash';
import { PopupConfirmationComponent, IPopupConfirmation } from './../popup-confirmation/popup-confirmation.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import {MatDialog} from '@angular/material';
import {EditImageDialogComponent} from './edit-image-dialog/edit-image-dialog.component';

@Component({
  selector: 'pxs-editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.css']
})
export class EditableImageComponent implements OnInit {

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  @Input() image: string;
  @Input() dialogTitle = 'Edit image';
  @Input() ratio: number = null;
  @Input() maxWidthAndHeight = 1024;
  @Input() confirmationMessage: IPopupConfirmation;
  @Input() removeButton = true;


  @Output() change: EventEmitter<string> = new EventEmitter();

  private orginalImage: string;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {}

  onClick() {
    if (this.confirmationMessage) {
      this.openConfirmationDialog();
    } else {
      this.openEditImageDialog();
    }
  }



  public async fileChangeEvent(event: any) {
    this.orginalImage = this.image;
    try {
      if (event.target.files.length <= 0) {
        return null;
      }
    } catch (error) {
      return null;
    }
    const dialogRef = this.dialog.open(EditImageDialogComponent, {
      data: {
        imageEvent: event,
        title: this.dialogTitle,
        ratio: this.ratio,
        maxWidthAndHeight: this.maxWidthAndHeight,
      },
      maxWidth: '1024px',
      maxHeight: '80vh',
      width: 'auto'
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result) {
      this.image = result;
      this.change.emit(result);
    } else {
      this.change.emit(this.orginalImage);
    }
  }

  private openEditImageDialog() {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
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

  public removeImage() {
    this.change.emit(null);
  }

}
