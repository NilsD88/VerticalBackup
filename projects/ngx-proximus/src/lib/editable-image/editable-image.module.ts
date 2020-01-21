import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditableImageComponent} from './editable-image.component';
import {MatButtonModule, MatDialogModule, MatInputModule} from '@angular/material';
import {EditImageDialogComponent} from './edit-image-dialog/edit-image-dialog.component';
import {ImageEditorModule} from '../image-editor/image-editor.module';
import {NgxImgModule} from 'ngx-img';
import { PopupConfirmationModule } from '../popup-confirmation/popup-confirmation.module';
import { PopupConfirmationComponent } from '../popup-confirmation/popup-confirmation.component';

@NgModule({
  declarations: [EditableImageComponent, EditImageDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ImageEditorModule,
    MatInputModule,
    NgxImgModule.forRoot(),
    PopupConfirmationModule
  ],
  exports: [EditableImageComponent],
  entryComponents: [
    EditImageDialogComponent,
    PopupConfirmationComponent
  ]
})
export class EditableImageModule {
}
