import { StairwayToHealthLocationService } from 'src/app/services/stairway-to-health/location.service';
import {
  cloneDeep
} from 'lodash';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  generateLeafColors,
} from 'src/app/shared/utils';
import {
  ILeafColors
} from 'src/app/shared/people-counting/dashboard/leaf.model';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {
  IPeopleCountingLocation,
} from 'src/app/models/peoplecounting/location.model';
import { SubSink } from 'subsink';
import { Subject, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';


moment.locale('nl-be');
window.moment = moment;
mTZ();

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public rootLocation: IPeopleCountingLocation;
  public locations: IPeopleCountingLocation[];
  public locationColors: ILeafColors[];
  public currentLocations: IPeopleCountingLocation[];
  public listStyleValue = 'map';
  public leafUrl = '/private/stairwaytohealth/place';

  public lastYearLocations$: Subject<null> = new Subject();
  public lastYearLocations: IPeopleCountingLocation[];
  public lastYearLocationsLoading = false;
  public lastYearLocationsLoadingError = false;

  private subs = new SubSink();

  constructor(
    private locationService: StairwayToHealthLocationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.rootLocation = {
      id: null,
      parentId: null,
      geolocation: null,
      image: null,
      name: 'Locations',
      description: null,
      children: await this.locationService.getLocationsTree().toPromise()
    };
    this.subs.add(
      this.getLastYearData(this.lastYearLocations$).subscribe(
        (result) => {
          if (!this.lastYearLocationsLoadingError) {
            const leafs = cloneDeep(this.currentLocations);
            leafs.forEach(leaf => {
              const leafIndex = result.findIndex((x => x.id === leaf.id));
              if (leafIndex > -1) {
                leaf.series = result[leafIndex].series;
              } else {
                leaf.series = [];
              }
            });
            this.lastYearLocations = leafs;
            this.lastYearLocationsLoading = false;
            this.changeDetectorRef.detectChanges();
          }
        }
      ),
    );
    this.changeLocation(this.rootLocation);
  }


  public listStyleOnChange(event) {
    const {
      value
    } = event;
    this.listStyleValue = value;
  }

  public changeLocation(location: IPeopleCountingLocation) {
    const locations: IPeopleCountingLocation[] = location.children || [];
    this.locationColors = generateLeafColors(locations);
    this.currentLocations = locations;
    this.lastYearLocations$.next();
  }

  private getLastYearData(request: Observable <null>): Observable < IPeopleCountingLocation[] > {
    return request.pipe(
      switchMap(() => {
        this.lastYearLocationsLoading = true;
        this.lastYearLocationsLoadingError = false;
        this.changeDetectorRef.detectChanges();
        return this.locationService.getLocationsDataByIds(
          this.currentLocations.map(leaf => leaf.id),
          'MONTHLY',
          moment().subtract(1, 'year').set({month: 0, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
          moment().set({month: 0, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
        ).pipe(catchError((error) => {
          console.error(error);
          this.lastYearLocationsLoading = false;
          this.lastYearLocationsLoadingError = true;
          return of([]);
        }));
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}