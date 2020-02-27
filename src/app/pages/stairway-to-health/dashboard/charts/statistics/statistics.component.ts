import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable, of } from 'rxjs';
import { SubSink } from 'subsink';
import { StairwayToHealthLocationService } from 'src/app/services/stairway-to-health/location.service';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import {
  IPeopleCountingLocation
} from 'src/app/models/peoplecounting/location.model';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { ILeafColors } from 'src/app/shared/people-counting/dashboard/leaf.model';
import { switchMap, catchError } from 'rxjs/operators';
const randomColor = require('randomcolor');

declare global {
  interface Window {
    moment: any;
  }
}

moment.locale('nl-be');
window.moment = moment;
mTZ();


@Component({
  selector: 'pvf-stairwaytohealth-dashboard-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() locations: IPeopleCountingLocation[];
  @Input() locationColors: ILeafColors[] = [];

  public subjects = {
    day: new Subject<null>(),
    week: new Subject<null>(),
    all: new Subject<null>()
  };

  public titles = {
    day: this.translateService.instant('GENERAL.TODAY'),
    week: this.translateService.instant('GENERAL.THIS_WEEK'),
    all: this.translateService.instant('GENERAL.TOTAL'),
  };

  public series = {
    day: [],
    week: [],
    all: [],
  };

  public filters = {
    day: {
      interval: 'DAILY',
      from: moment().startOf('day').valueOf(),
      to: moment().valueOf(),
    },
    week: {
      interval: 'WEEKLY',
      from: moment().startOf('isoWeek').valueOf(),
      to: moment().valueOf()
    },
    all: {
      interval: 'YEARLY',
      from: 0,
      to: moment().valueOf()
    }
  };

  public chartsLoading = {
    day: false,
    week: false,
    all: false,
  };

  public loadingErrors = {
    day: false,
    week: false,
    all: false,
  };

  private subs = new SubSink();


  constructor(
    private locationService: StairwayToHealthLocationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    for (const key of Object.keys(this.subjects)) {
      this.subs.add(
        this.dataPipe(
          this.subjects[key],
          key
        ).subscribe(
          locations => {
            this.series[key] = null;
            this.series[key] = this.getDataSeries(locations);
            this.chartsLoading[key] = false;
          }
        )
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations) {
      if (changes.locations.currentValue && changes.locations.currentValue !== changes.locations.previousValue) {
        for (const subject of Object.keys(this.subjects)) {
          this.subjects[subject].next();
        }
      }
    }
  }

  getDataSeries(locations: IPeopleCountingLocation[]): any[] {
    const array = [];
    locations.forEach(location => {
      array.push({
        name: location.name,
        color: (this.locationColors.find(element => element.id === location.id) || {})['color'] || randomColor(),
        y: location.series.map(serie => serie.valueIn).reduce((a, b) => a + b, 0)
      });
    });
    return array;
  }

  private dataPipe(obs: Observable<null>, key: string) {
    return obs.pipe(
        switchMap(() => {
          this.chartsLoading[key] = true;
          return this.locationService.getLocationsDataByIds(
            this.locations.map(location => location.id),
            this.filters[key].interval,
            this.filters[key].from,
            this.filters[key].to,
          ).pipe(catchError((error) => {
            console.error(error);
            this.chartsLoading[key] = false;
            this.loadingErrors[key] = true;
            return of([]);
          }));
        })
    );
  }

  public tryAgain(key: string) {
    this.subjects[key].next();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
