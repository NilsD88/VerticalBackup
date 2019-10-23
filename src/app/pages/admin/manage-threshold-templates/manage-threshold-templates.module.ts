import { DialogModule } from 'projects/ngx-proximus/src/lib/dialog/dialog.module';
import { ListThresholdTemplatesModule } from 'projects/ngx-proximus/src/lib/list-threshold-templates/list-threshold-templates.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManageThresholdTemplatesComponent} from './manage-threshold-templates.component';
import {LoaderModule} from 'projects/ngx-proximus/src/lib/loader/loader.module';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
  MatSlideToggleModule,
} from '@angular/material';
import {RangeSliderModule} from 'projects/ngx-proximus/src/lib/range-slider/range-slider.module';
import {RouterModule} from '@angular/router';
import {ManageThresholdTemplatesRoutes} from './manage-threshold-templates.routing';
import {IconModule} from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {ManageThresholdTemplatesListComponent} from './manage-threshold-templates-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { ButtonModule } from 'projects/ngx-proximus/src/lib/button/button.module';
import { NewThresholdTemplateService } from 'src/app/services/new-threshold-templates';
import { AddThresholdComponent } from './add-threshold/add-threshold.component';

@NgModule({
  declarations: [ManageThresholdTemplatesComponent, ManageThresholdTemplatesListComponent, AddThresholdComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageThresholdTemplatesRoutes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IconModule,
    ButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    ListThresholdTemplatesModule,
    LoaderModule,
    RangeSliderModule,
    DialogModule
  ],
  providers: [
    NewThresholdTemplateService,
  ],
  entryComponents: [AddThresholdComponent],
})
export class ManageThresholdTemplatesModule {
}
