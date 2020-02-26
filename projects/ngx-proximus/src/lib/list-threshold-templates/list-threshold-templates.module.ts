import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListThresholdTemplatesComponent } from './list-threshold-templates.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, MatTableModule, MatSortModule, MatTooltipModule, MatButtonModule, MatCardModule, MatIconModule, MatRadioModule, MatPaginatorModule } from '@angular/material';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { RouterModule } from '@angular/router';
import { ThresholdTemplateService } from 'src/app/services/threshold-templates';
import { ThresholdTemplatesDetailModule } from '../threshold-templates-detail/threshold-templates-detail.module';
import { ThresholdTemplatesDetailComponent } from '../threshold-templates-detail/threshold-templates-detail.component';
import { PopupConfirmationModule } from '../popup-confirmation/popup-confirmation.module';

@NgModule({
  declarations: [ListThresholdTemplatesComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ImgFallbackModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatRadioModule,
    ThresholdTemplatesDetailModule,
    MatPaginatorModule,
    PopupConfirmationModule,
    TranslateModule
  ],
  entryComponents: [
    ThresholdTemplatesDetailComponent
  ],
  providers: [
    ThresholdTemplateService
  ],
  exports: [
    ListThresholdTemplatesComponent
  ]
})
export class ListThresholdTemplatesModule { }
