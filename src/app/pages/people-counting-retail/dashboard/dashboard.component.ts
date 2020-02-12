import { Router } from '@angular/router';
import { SharedService } from './../../../services/shared.service';
import { Subject, of, Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { PeopleCountingRetailLocationService } from './../../../services/peoplecounting-retail/location.service';
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
  findLeafLocations
} from '../../walking-trail/utils';
import {
  generateLeafColors,
  increaseLeafs,
  decreaseLeafs
} from 'src/app/shared/utils';
import {
  ILeafColors
} from 'src/app/shared/people-counting/dashboard/leaf.model';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {
  IPeopleCountingLocation,
} from 'src/app/models/peoplecounting/location.model';
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
  public leafs: IPeopleCountingLocation[];
  public leafColors: ILeafColors[];
  public listStyleValue = 'map';
  public leafUrl = '/private/peoplecounting/store';

  public lastYearLeafs$: Subject<null> = new Subject();
  public lastYearLeafs: IPeopleCountingLocation[];
  public lastYearLeafsLoading = false;
  public lastYearLeafsLoadingError = false;

  public lastWeekLeafs$: Subject<null> = new Subject();
  public lastWeekLeafs: IPeopleCountingLocation[];
  public lastWeekLeafsLoading = false;
  public lastWeekLeafsLoadingError = false;


  private subs = new SubSink();

  constructor(
    private locationService: PeopleCountingRetailLocationService,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router,
  ) {}

  async ngOnInit() {
    if (this.sharedService.user.hasRole('pxs:iot:location_admin')) {
      this.rootLocation = (await this.locationService.getLocationsTree().toPromise())[0];
      const { module, id } = this.rootLocation;
      if (module === 'PEOPLE_COUNTING_RETAIL') {
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
      this.getLastWeekData(this.lastWeekLeafs$).subscribe(
        (result) => {
          if (!this.lastWeekLeafsLoadingError) {
            const leafs = cloneDeep(this.leafs);
            leafs.forEach(leaf => {
              const leafIndex = result.findIndex((x => x.id === leaf.id));
              if (leafIndex > -1) {
                leaf.series = result[leafIndex].series;
              } else {
                leaf.series = [];
              }
            });
            this.lastWeekLeafs = leafs;
            this.lastWeekLeafsLoading = false;
            this.changeDetectorRef.detectChanges();
          }
        }
      ),
      this.getLastYearData(this.lastYearLeafs$).subscribe(
        (result) => {
          if (!this.lastYearLeafsLoadingError) {
            const leafs = cloneDeep(this.leafs);
            leafs.forEach(leaf => {
              const leafIndex = result.findIndex((x => x.id === leaf.id));
              if (leafIndex > -1) {
                leaf.series = result[leafIndex].series;
              } else {
                leaf.series = [];
              }
            });
            this.lastYearLeafs = leafs;
            this.lastYearLeafsLoading = false;
            this.changeDetectorRef.detectChanges();
          }
        }
      ),
    );
    this.changeLocation(this.rootLocation);
  }

  public decrease() {
    this.lastWeekLeafs = decreaseLeafs(this.lastWeekLeafs);
  }

  public increase() {
    this.lastWeekLeafs = increaseLeafs(this.lastWeekLeafs);
  }

  public listStyleOnChange(event) {
    const {
      value
    } = event;
    this.listStyleValue = value;
  }

  public changeLocation(location: IPeopleCountingLocation) {
    const leafs: IPeopleCountingLocation[] = [];
    findLeafLocations(location, leafs);
    this.leafColors = generateLeafColors(leafs);
    this.leafs = leafs;
    this.lastWeekLeafs$.next();
    this.lastYearLeafs$.next();
  }


  private getLastWeekData(request: Observable <null>): Observable < IPeopleCountingLocation[] > {
    return request.pipe(
      switchMap(() => {
        this.lastWeekLeafsLoading = true;
        this.lastWeekLeafsLoadingError = false;
        this.changeDetectorRef.detectChanges();
        return this.locationService.getLocationsDataByIds(
          this.leafs.map(leaf => leaf.id),
          'DAILY',
          moment().startOf('isoWeek').subtract(1, 'week').valueOf(),
          moment().startOf('isoWeek').valueOf(),
        ).pipe(catchError((error) => {
          console.error(error);
          this.lastWeekLeafsLoading = false;
          this.lastWeekLeafsLoadingError = true;
          return of([]);
        }));
      })
    );
  }

  private getLastYearData(request: Observable <null>): Observable < IPeopleCountingLocation[] > {
    return request.pipe(
      switchMap(() => {
        this.lastYearLeafsLoading = true;
        this.lastYearLeafsLoadingError = false;
        this.changeDetectorRef.detectChanges();
        return this.locationService.getLocationsDataByIds(
          this.leafs.map(leaf => leaf.id),
          'MONTHLY',
          moment().subtract(1, 'year').set({date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
          moment().subtract(1, 'month').endOf('month').valueOf(),
        ).pipe(catchError((error) => {
          console.error(error);
          this.lastYearLeafsLoading = false;
          this.lastYearLeafsLoadingError = true;
          return of([]);
        }));
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

