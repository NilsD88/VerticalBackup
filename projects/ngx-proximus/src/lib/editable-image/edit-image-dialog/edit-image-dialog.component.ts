import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'pxs-edit-image-dialog',
  templateUrl: './edit-image-dialog.component.html',
  styleUrls: ['./edit-image-dialog.component.css']
})
export class EditImageDialogComponent implements OnInit {
  imageEditorConfig = {
    fileSize: 4096, // in Bytes (by default 2048 Bytes = 2 MB)
    minWidth: 200, // minimum width of image that can be uploaded (by default 0, signifies any width)
    maxWidth: 0,  // maximum width of image that can be uploaded (by default 0, signifies any width)
    minHeight: 100,  // minimum height of image that can be uploaded (by default 0, signifies any height)
    maxHeight: 0,  // maximum height of image that can be uploaded (by default 0, signifies any height)
    fileType: ['image/gif', 'image/jpeg', 'image/png'], // mime type of files accepted
    height: 400, // height of cropper
    quality: 0.5, // quaity of image after compression
    crop: [  // array of objects for mulitple image crop instances (by default null, signifies no cropping)
      {
        ratio: this.data.ratio, // ratio in which image needed to be cropped (by default null, signifies ratio to be free of any restrictions)
        minWidth: 0, // minimum width of image to be exported (by default 0, signifies any width)
        maxWidth: 0,  // maximum width of image to be exported (by default 0, signifies any width)
        minHeight: 0,  // minimum height of image to be exported (by default 0, signifies any height)
        maxHeight: 0,  // maximum height of image to be exported (by default 0, signifies any height)
        width: 0,  // width of image to be exported (by default 0, signifies any width)
        height: 0  // height of image to be exported (by default 0, signifies any height)
      }
    ]
  };
  @Output() change: EventEmitter<string> = new EventEmitter();
  public result;

  constructor(
    public dialogRef: MatDialogRef<EditImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }

  onImageEditorReset() {
    this.change.emit(this.data.image);
    this.result = undefined;
  }

  onImageEditorSelect(event: string) {
    this.result = event;
    this.change.emit(event);
  }

  save() {
    this.dialogRef.close(this.result);
  }

  close() {
    this.dialogRef.close();
  }


}
