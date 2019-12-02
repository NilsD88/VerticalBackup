import { PointOfAttentionItemDialogModule } from './point-of-attention-item-dialog/point-of-attention-item-dialog.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPointOfAttentionItemsComponent } from './list-point-of-attention-items.component';
import { MatTableModule, MatSortModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { PointOfAttentionItemDialogComponent } from './point-of-attention-item-dialog/point-of-attention-item-dialog.component';



@NgModule({
  declarations: [ListPointOfAttentionItemsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    IconModule,
    MatButtonModule,
    TranslateModule,
    MatTooltipModule,
    PointOfAttentionItemDialogModule,
  ],
  exports: [ListPointOfAttentionItemsComponent],
  entryComponents: [PointOfAttentionItemDialogComponent]
})
export class ListPointOfAttentionItemsModule { }
