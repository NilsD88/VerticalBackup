import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManageThresholdTemplatesComponent} from './manage-threshold-templates.component';
import {LoaderModule} from '../../../../../../projects/ngx-proximus/src/lib/loader/loader.module';
import {MatButtonModule, MatInputModule, MatSelectModule, MatTooltipModule} from '@angular/material';
import {RangeSliderModule} from '../../../../../../projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import {RouterModule} from '@angular/router';
import {ManageThresholdTemplatesRoutes} from './manage-threshold-templates.routing';
import {ImgFallbackModule} from 'ngx-img-fallback';
import {IconModule} from '../../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {ManageThresholdTemplatesListComponent} from './manage-threshold-templates-list.component';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [ManageThresholdTemplatesComponent, ManageThresholdTemplatesListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageThresholdTemplatesRoutes),
    LoaderModule,
    MatInputModule,
    RangeSliderModule,
    FormsModule,
    MatTooltipModule,
    ImgFallbackModule,
    MatSelectModule,
    TranslateModule,
    IconModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class ManageThresholdTemplatesModule {
}
