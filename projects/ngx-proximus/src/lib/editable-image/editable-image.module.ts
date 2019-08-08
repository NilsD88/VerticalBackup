import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditableImageComponent} from './editable-image.component';
import {MatButtonModule, MatDialogModule, MatInputModule} from '@angular/material';
import {EditImageDialogComponent} from './edit-image-dialog/edit-image-dialog.component';
import {ImageEditorModule} from '../image-editor/image-editor.module';
import {NgxImgModule} from 'ngx-img';

@NgModule({
  declarations: [EditableImageComponent, EditImageDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ImageEditorModule,
    MatInputModule,
    NgxImgModule.forRoot()
  ],
  exports: [EditableImageComponent],
  entryComponents: [EditImageDialogComponent]
})
export class EditableImageModule {
}
