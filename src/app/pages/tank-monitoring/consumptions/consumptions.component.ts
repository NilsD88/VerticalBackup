import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IFilterChartData } from '../../../../../projects/ngx-proximus/src/lib/chart-controls/chart-controls.component'
import { LogsService } from 'src/app/services/logs.service';
import { ActivatedRoute } from '@angular/router';
import { IAsset } from 'src/app/models/g-asset.model';
import { ISensorReadingFilter } from 'src/app/models/sensor.model';
import { isNullOrUndefined } from 'util';
import { forkJoin, Observable, Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MOCK_THRESHOLD_TEMPLATES } from 'src/app/mocks/threshold-templates';

@Component({
  selector: 'pvf-consumptions',
  templateUrl: './consumptions.component.html',
  styleUrls: ['./consumptions.component.scss']
})
export class ConsumptionsComponent implements OnInit {

  public TANK_DATA = {"label":"tank fill level","sensorTypeId":null,"series":[{"label":"1560819600000","avg":96.0,"min":96.0,"max":96.0,"sum":96.0},{"label":"1560837600000","avg":96.0,"min":96.0,"max":96.0,"sum":96.0},{"label":"1560859200000","avg":94.0,"min":94.0,"max":94.0,"sum":94.0},{"label":"1560880800000","avg":23.0,"min":23.0,"max":23.0,"sum":23.0},{"label":"1560902400000","avg":23.0,"min":23.0,"max":23.0,"sum":23.0},{"label":"1560924000000","avg":23.0,"min":23.0,"max":23.0,"sum":23.0},{"label":"1560949200000","avg":23.0,"min":23.0,"max":23.0,"sum":23.0},{"label":"1560967200000","avg":23.0,"min":23.0,"max":23.0,"sum":23.0}]};
  public MOCK_THRESHOLD_TEMPLATE = MOCK_THRESHOLD_TEMPLATES[0];

  public asset: IAsset;
  public chartSensorOptions = [];
  public chartData = [];
  public lastAlert = null;

  public currentFilter: IFilterChartData = {
    interval: 'HOURLY',
    from: moment().subtract(1, 'day').toDate().getTime(),
    to: moment().toDate().getTime(),
  };

  public drpOptions: any;

  public chartIsLoading = false;
  public chartData$ = new Subject<any>();

  constructor(
    private activeRoute: ActivatedRoute,
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService,
    private logsService: LogsService
  ) {}

  ngOnInit() {
    this.init();
    this.getChartData(this.chartData$).subscribe((result: any[]) => {
      this.chartIsLoading = false;
      this.chartData = result;
    });
  }

  async init() {
    try {
      const id = await this.getRouteId();
      this.asset = await this.newAssetService.getAssetById(id).toPromise();
      console.log({...this.asset});
      this.asset.location = await this.newLocationService.getLocationById(this.asset.locationId).toPromise();
      console.log({...this.asset});
      /*
      this.chartSensorOptions = this.asset.sensors ? this.asset.sensors.map((val) => {
        return {
          deveui: val.devEui,
          sensorTypeId: val.sensorType.id
        };
      }) : [];
      */
      this.updateChartData(null);

    } catch (err) {
      console.log(err);
      //this.router.navigate(['/error/404']);
    }
  }

  public async updateChartData(options: { interval?: string; from?: number; to?: number; }) {

    if (!options) {
      options = this.currentFilter;
    }

    const interval = options.interval ?  options.interval : this.currentFilter.interval;
    const from = options.from ?  options.from : this.currentFilter.from;
    const to = options.to ?  options.to : this.currentFilter.to;
    const duration = moment.duration(moment(to).diff(from));
    const durationInHours =  +duration.asHours().toFixed(0);

    this.currentFilter = {
      interval,
      from,
      to,
      durationInHours
    };

    const chartDataFilters = [];

    for (const sensorType of this.chartSensorOptions) {
      const filter: ISensorReadingFilter = {
        deveui: sensorType.deveui,
        sensortypeid: sensorType.sensorTypeId,
        from,
        to,
        interval,
      };
      chartDataFilters.push(filter);
    }

    if (chartDataFilters.length) {
      this.chartData$.next({
        filters: chartDataFilters,
        durationInHours
      });
    }
  }

  private getChartData(request: Observable<any>) {
    return request.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(data => {
        this.chartIsLoading = true;
        const observables: Observable<any>[] = [];
        const {filters, durationInHours} = data;
        if (durationInHours <= 24) {
          for (const filter of filters) {
            observables.push(
              this.logsService.getSensorReadingsV2(filter)
            );
          }
        } else {
          for (const filter of filters) {
            observables.push(
              this.logsService.getSensorReadings(filter)
            );
          }
        }
        return forkJoin(observables);
      })
    );
  }

  private getRouteId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.activeRoute.params.subscribe((params) => {
        if (!isNullOrUndefined(params.id)) {
          resolve(params.id);
        } else {
          reject('DetailComponent: No \'id\' parameter in route.');
        }
      }, reject);
    });
  }

}


