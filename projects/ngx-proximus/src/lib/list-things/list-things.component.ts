import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IThing } from 'src/app/models/g-thing.model';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { ThingService } from 'src/app/services/thing.service';
import { SharedService } from 'src/app/services/shared.service';
import { NewThingsService } from 'src/app/services/new-things.service';
import { Subject } from 'rxjs';
import { isNullOrUndefined } from 'util';


interface IThingEditing extends IThing {
  editing: boolean;
  tempName: string;
}

@Component({
  selector: 'pxs-list-things',
  templateUrl: './list-things.component.html',
  styleUrls: ['./list-things.component.scss']
})
export class ListThingsComponent implements OnInit {

  @Input() admin = true;
  @Input() selectedThings: IThing[];

  @Output() selectChange: EventEmitter<IThing> = new EventEmitter<IThing>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public things: IThing[];
  public searchTerm$ = new Subject<string>();

  public activeInput: number = null;
  public filter = {
    devEui: '',
    name: ''
  };

  public dataSource: MatTableDataSource<IThing>;
  public displayedColumns: string[];

  public isLoading = false;

  constructor(
    private thingService: ThingService,
    private sharedService: SharedService,
    private newThingsService: NewThingsService,
    public snackBar: MatSnackBar
  ) {}

  public async ngOnInit() {
    this.displayedColumns = ['name', 'devEui', 'sensors'];

    if (!isNullOrUndefined(this.selectedThings)) {
      this.displayedColumns.unshift('select');
    }
    if (this.admin) {
      this.displayedColumns.push('actions');
    }

    await this.getThings();

    this.newThingsService.searchTerm(this.searchTerm$)
      .subscribe(things => {
        const results = [];
        for (const array of things) {
          if (array.length > 0) {
            for (const item of array) {
              results.push(item);
            }
          }
        }
        this.things = results;
        this.updateDataSource();
        this.isLoading = false;
      });
  }

  public async getThings(): Promise<void> {
    this.isLoading = true;
    // REAL
    //this.things = await this.thingService.getByFilter(this.filter);
    // MOCK
    this.things = await this.newThingsService.getThings();
    this.updateDataSource();
    this.isLoading = false;
  }

  public checkOneThing(id: string) {
    return this.selectedThings.some((thing) => thing.id === id);
  }

  private updateDataSource() {
    this.dataSource = new MatTableDataSource(this.things);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (thing, property) => {
        if (property.includes('.')) {
          return property.split('.')
            .reduce((object, key) => object[key], thing);
        }
        if (typeof thing[property] === 'string') {
          return thing[property].toLocaleLowerCase();
        } else {
          return thing[property];
        }
    };
    this.dataSource.sort = this.sort;
  }

  public editThingName(index: number): void {
    this.activeInput = index;
  }

  public async cancelEdit(): Promise<void> {
    await this.getThings();
    this.activeInput = null;
  }

  public async saveThing(thing: IThing): Promise<void> {
    try {
      await this.thingService.updateName(thing as IThing);
      this.getThings();
      this.sharedService.showNotification('Successfully saved thing name', 'success');
      this.activeInput = null;
    } catch (err) {
      this.sharedService.showNotification('Error saving thing name', 'error');
    }
  }

  public async updateThing(thing: IThingEditing) {
    const orignalName = thing.name;
    thing.name = thing.tempName;

    delete thing.editing;
    delete thing.tempName;

    this.newThingsService.updateThing(thing).subscribe(
      res => {
        console.log('HTTP response', res);
      },
      err => {
        thing.name = orignalName;
        this.snackBar.open(`Failed to update the thing's name!`, null, {
          duration: 2000,
        });
        console.log('HTTP Error', err);
      }
    );
  }

  public searchChanged(event) {
    this.searchTerm$.next(event);
    this.isLoading = true;
  }
}
