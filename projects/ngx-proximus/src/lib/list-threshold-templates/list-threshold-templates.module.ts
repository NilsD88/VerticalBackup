import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListThresholdTemplatesComponent } from './list-threshold-templates.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, MatTableModule, MatSortModule, MatTooltipModule, MatButtonModule, MatCardModule, MatIconModule, MatPaginatorModule, MatRadioModule } from '@angular/material';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { RouterModule } from '@angular/router';
import { NewThresholdTemplateService } from 'src/app/services/new-threshold-templates';
import { ThresholdTemplatesDetailModule } from '../threshold-templates-detail/threshold-templates-detail.module';
import { ThresholdTemplatesDetailComponent } from '../threshold-templates-detail/threshold-templates-detail.component';

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
    MatPaginatorModule,
    ThresholdTemplatesDetailModule
  ],
  entryComponents: [
    ThresholdTemplatesDetailComponent
  ],
  providers: [
    NewThresholdTemplateService
  ],
  exports: [
    ListThresholdTemplatesComponent
  ]
})
export class ListThresholdTemplatesModule { }
