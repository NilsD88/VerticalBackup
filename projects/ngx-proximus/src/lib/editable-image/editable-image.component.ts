import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {EditImageDialogComponent} from './edit-image-dialog/edit-image-dialog.component';

@Component({
  selector: 'pxs-editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.css']
})
export class EditableImageComponent implements OnInit {
  @Input() image = '';
  @Input() dialogTitle = 'Edit image';
  @Input() ratio: number;
  @Input() change: EventEmitter<string> = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async openEditImageDialog() {
    const dialogRef = this.dialog.open(EditImageDialogComponent, {
      data: {image: this.image, title: this.dialogTitle, ratio: this.ratio},
      width: '100vw',
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result) {
      this.image = result;
      this.change.emit(result);
    }
  }


}
