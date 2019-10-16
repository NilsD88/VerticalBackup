import { AlertsService } from './../../../services/alerts.service';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertsComponent} from './alerts.component';
import {RouterModule} from '@angular/router';
import {AlertsRoutes} from './alerts.routing';
import {TranslateModule} from '@ngx-translate/core';
import {IconModule} from '../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {ButtonModule} from '../../../../../projects/ngx-proximus/src/lib/button/button.module';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatPaginatorModule,
  MatSelectModule,
  MatTooltipModule,
  MatTableModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatButtonToggleModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {NgxMatDrpModule} from 'ngx-mat-daterange-picker';
import {DateRangeSelectionModule} from '../../../../../projects/ngx-proximus/src/lib/date-range-selection/date-range-selection.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {LoaderModule} from '../../../../../projects/ngx-proximus/src/lib/loader/loader.module';
import { SharedService } from 'src/app/services/shared.service';
import { NewAlertService } from 'src/app/services/new-alert.service';

@NgModule({
  declarations: [AlertsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AlertsRoutes),
    TranslateModule,
    IconModule,
    ButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    NgxMatDrpModule,
    DateRangeSelectionModule,
    NgSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    LoaderModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonToggleModule
  ],
  providers: [
    AlertsService,
    NewAlertService,
    SharedService
  ]
})
export class AlertsModule {
}
