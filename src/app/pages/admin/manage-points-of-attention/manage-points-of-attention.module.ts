import { ListPointsOfAttentionModule } from './../../../../../projects/ngx-proximus/src/lib/list-points-of-attention/list-points-of-attention.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePointsOfAttentionComponent } from './manage-points-of-attention.component';
import { ManagePointsOfAttentionRoutes } from './manage-points-of-attention.routing';
import { MatButtonModule, MatTooltipModule} from '@angular/material';



@NgModule({
  declarations: [ManagePointsOfAttentionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManagePointsOfAttentionRoutes),
    MatButtonModule,
    IconModule,
    MatTooltipModule,
    TranslateModule,
    ListPointsOfAttentionModule,
  ],
  exports: [ManagePointsOfAttentionComponent],
})
export class ManagePointsOfAttentionModule {}
