import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditableImageComponent} from './editable-image.component';
import { MatButtonModule, MatDialogModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import {EditImageDialogComponent} from './edit-image-dialog/edit-image-dialog.component';
import { PopupConfirmationModule } from '../popup-confirmation/popup-confirmation.module';
import { PopupConfirmationComponent } from '../popup-confirmation/popup-confirmation.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    EditableImageComponent,
    EditImageDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    PopupConfirmationModule,
    ImageCropperModule,
    MatProgressSpinnerModule
  ],
  exports: [EditableImageComponent],
  entryComponents: [
    EditImageDialogComponent,
    PopupConfirmationComponent
  ]
})
export class EditableImageModule {
}
