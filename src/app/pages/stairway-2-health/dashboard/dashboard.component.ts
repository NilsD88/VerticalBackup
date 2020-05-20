import { SharedService } from './../../../services/shared.service';
import { Stairway2HealthLocationService } from 'src/app/services/stairway-2-health/location.service';
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
import { Router } from '@angular/router';


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
  public leafUrl = '/private/stairway-2-health/place';

  public lastYearLocations$: Subject<null> = new Subject();
  public lastYearLocations: IPeopleCountingLocation[];
  public lastYearLocationsLoading = false;
  public lastYearLocationsLoadingError = false;

  private subs = new SubSink();

  constructor(
    private locationService: Stairway2HealthLocationService,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router,
  ) {}

  async ngOnInit() {
    if (this.sharedService.user.hasRole('pxs:iot:location_admin')) {
      this.rootLocation = (await this.locationService.getLocationsTree().toPromise())[0];
      const { module, id } = this.rootLocation;
      if (module === 'PEOPLE_COUNTING_STAIRWAY_2_HEALTH') {
        this.router.navigateByUrl(`${this.leafUrl}/${id}`);
      }
    } else {
      this.rootLocation = {
        id: null,
        parentId: null,
        geolocation: null,
        image: null,
        name: 'Locations',
        description: null,
        children: await this.locationService.getLocationsTree().toPromise()
      };
    }
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
          moment().subtract(1, 'year').set({date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
          moment().subtract(1, 'month').endOf('month').valueOf(),
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