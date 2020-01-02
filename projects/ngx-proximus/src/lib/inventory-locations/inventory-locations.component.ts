import { SubSink } from 'subsink';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NewLocationService } from 'src/app/services/new-location.service';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { IPeopleCountingLocation, IPagedPeopleCountingLocations } from 'src/app/models/peoplecounting/location.model';

export interface IInventoryFilterBE {
  name?: string;
}

@Component({
  selector: 'pxs-inventory-locations',
  templateUrl: './inventory-locations.component.html',
  styleUrls: ['./inventory-locations.component.scss']
})

export class InventoryLocationsComponent implements OnInit, OnDestroy {

  private subs = new SubSink();

  public filterBE$ = new Subject<IInventoryFilterBE>();
  public filterBE: IInventoryFilterBE = {
    name: '',
  };

  public filterOptions = {
    thresholdTemplateOptions: [],
  };

  public listStyleValue = 'icons';

  public thresholdTemplatesLoading = false;
  public locationsLoading = false;

  public locations: IPeopleCountingLocation[] = [];
  public leafUrl: string;

  public pageNumber = 0;
  public pageSize = 10;
  public totalItems = 0;

  public rootLocation: IPeopleCountingLocation;
  public selectedLocation: IPeopleCountingLocation;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public locationService: NewLocationService,
    public activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.getPagedLocations();

    this.subs.add(
      this.locationService.getLocationsTree().subscribe((locations: IPeopleCountingLocation[]) => {
        this.rootLocation = {
          id: null,
          parentId: null,
          geolocation: null,
          image: null,
          name: 'Locations',
          description: null,
          children: locations,
        };
        if (locations.length === 1) {
          this.selectedLocation = this.rootLocation.children[0];
        }
      })
    );

    this.subs.add(
      this.searchLocationsByFilter(this.filterBE$).subscribe((pagedLocations: IPagedPeopleCountingLocations) => {
        this.locations = pagedLocations.locations;
        this.totalItems = pagedLocations.totalElements;
        this.locationsLoading = false;
      })
    );

    this.subs.add(
      this.activatedRoute.params.subscribe(async (params) => {
        if (params.id) {
          this.listStyleValue = 'map';
          this.selectedLocation = {id: params.id};
        }
      })
    );
  }

  public changeFilterBE() {
    this.locationsLoading = true;
    this.locations = [];
    this.filterBE$.next(this.filterBE);
  }

  public changeLocation(location: IPeopleCountingLocation) {
    this.selectedLocation = location;
    this.changeDetectorRef.detectChanges();
  }

  public pageChanged(evt) {
    this.pageNumber = evt.pageIndex;
    this.pageSize = evt.pageSize;
    this.getPagedLocations();
  }

  public async getPagedLocations() {
    try {
      this.locationsLoading = true;
      const locationsResult = await this.locationService.getPagedLeafLocations(this.pageNumber, this.pageSize, this.filterBE).toPromise();
      this.locations = locationsResult.locations;
      this.totalItems = locationsResult.totalElements;
      this.locationsLoading = false;
    } catch (err) {
      this.locationsLoading = false;
    }
  }

  public listStyleOnChange(event) {
    const { value } = event;
    this.listStyleValue = value;
  }

  private searchLocationsByFilter(filters: Observable<IInventoryFilterBE>) {
    return filters.pipe(
      debounceTime(500),
      switchMap(() => {
        return this.locationService.getPagedLeafLocations(this.pageNumber, this.pageSize, this.filterBE);
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
