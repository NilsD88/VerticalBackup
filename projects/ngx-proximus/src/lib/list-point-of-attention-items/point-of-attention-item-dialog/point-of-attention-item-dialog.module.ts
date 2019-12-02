import { AddAssetDialogModule } from './add-asset-dialog/add-asset-dialog.module';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { StepperNextModule } from 'projects/ngx-proximus/src/lib/stepper-next/stepper-next.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PointOfAttentionItemDialogComponent} from './point-of-attention-item-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAssetDialogComponent } from './add-asset-dialog/add-asset-dialog.component';


@NgModule({
  declarations: [PointOfAttentionItemDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule,
    StepperNextModule,
    MatProgressSpinnerModule,
    IconModule,
    AddAssetDialogModule
  ],
  exports: [PointOfAttentionItemDialogComponent],
  entryComponents: [AddAssetDialogComponent]
})
export class PointOfAttentionItemDialogModule { }
