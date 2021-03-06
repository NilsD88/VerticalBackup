import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { MatTableModule, MatSortModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPointsOfAttentionComponent } from './list-points-of-attention.component';
import { PopupConfirmationComponent } from '../popup-confirmation/popup-confirmation.component';
import { PopupConfirmationModule } from '../popup-confirmation/popup-confirmation.module';



@NgModule({
  declarations: [ListPointsOfAttentionComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    IconModule,
    PopupConfirmationModule,
    TranslateModule
  ],
  exports: [ListPointsOfAttentionComponent],
})
export class ListPointsOfAttentionModule { }
