import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail.component';
import {RouterModule} from '@angular/router';
import {DetailRoutes} from './detail.routing';
import {TranslateModule} from '@ngx-translate/core';
import {MatDividerModule, MatExpansionModule} from '@angular/material';
import {SharedAlertsService} from '../../alerts/shared-alerts.service';
import {HighchartsChartModule} from 'highcharts-angular';
import {LogsService} from '../../../services/logs-service.service';
import {LoaderModule} from '../../../../../projects/ngx-proximus/src/lib/loader/loader.module';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DetailRoutes),
    TranslateModule,
    MatDividerModule,
    MatExpansionModule,
    HighchartsChartModule,
    LoaderModule
  ],
  providers: [SharedAlertsService, LogsService]
})
export class DetailModule { }
