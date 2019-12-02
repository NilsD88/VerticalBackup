import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertsComponent} from './alerts.component';
import {RouterModule} from '@angular/router';
import {AlertsRoutes} from './alerts.routing';
import {TranslateModule} from '@ngx-translate/core';
import {IconModule} from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {ButtonModule} from 'projects/ngx-proximus/src/lib/button/button.module';
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
  MatButtonToggleModule,
  MatSnackBarModule,
  MatMenuModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {DateRangeSelectionModule} from 'projects/ngx-proximus/src/lib/date-range-selection/date-range-selection.module';
import {NgSelectModule} from '@ng-select/ng-select';
import { ImgFallbackModule } from 'ngx-img-fallback';

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
    MatSnackBarModule,
    MatButtonModule,
    MatMenuModule,
    DateRangeSelectionModule,
    NgSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonToggleModule,
    ImgFallbackModule,
  ]
})
export class AlertsModule {
}
