import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageEditorComponent } from './image-editor.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatAutocompleteModule,
  MatButtonModule, MatButtonToggleModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule, MatSliderModule,
  MatTabsModule, MatTooltipModule
} from '@angular/material';

@NgModule({
  declarations: [ImageEditorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatAutocompleteModule
  ],
  exports: [ImageEditorComponent]
})
export class ImageEditorModule { }
