import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { EditSensorPopupComponent } from './edit-sensor-popup/edit-sensor-popup.component';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IThing } from 'src/app/models/thing.model';
import { ISensor } from 'src/app/models/sensor.model';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { ThingService } from 'src/app/services/thing.service';
import { isNullOrUndefined } from 'util';
import { findItemsWithTermOnKey } from 'src/app/shared/utils';
import {uniqBy} from 'lodash';



interface IThingEditing extends IThing {
  editing: boolean;
  tempName: string;
}

@Component({
  selector: 'pxs-list-things',
  templateUrl: './list-things.component.html',
  styleUrls: ['./list-things.component.scss']
})
export class ListThingsComponent implements OnInit, OnDestroy {

  @Input() admin = true;
  @Input() selectedThings: IThing[];

  @Output() selectChange: EventEmitter<IThing> = new EventEmitter<IThing>();

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public things: IThing[] = [];
  public activeInput: number = null;
  public filter = {
    devEui: '',
    name: ''
  };

  public dataSource: MatTableDataSource<IThing>;
  public displayedColumns: string[];

  public isLoading = false;

  private subs = new SubSink();

  constructor(
    private thingService: ThingService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private translateService: TranslateService
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
  }

  public async getThings(): Promise<void> {
    this.isLoading = true;
    this.things = await this.thingService.getThings().toPromise();
    this.updateDataSource(this.things);
    this.isLoading = false;
  }

  public checkOneThing(id: string) {
    return this.selectedThings.some((thing) => thing.id === id);
  }

  private updateDataSource(things: IThing[]) {
    this.dataSource = new MatTableDataSource(things);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (thing, property) => {
        if (property.includes('.')) {
          return property.split('.')
            .reduce((object, key) => {
              if (object && object[key]) {
                return object[key];
              } else {
                return null;
              }
            }, thing);
        }
        if (typeof thing[property] === 'string') {
          return thing[property].toLocaleLowerCase();
        } else {
          return thing[property];
        }
    };
    this.dataSource.sort = this.sort;
  }

  public openDialogSensorDefinition(sensor: ISensor, thingName: string) {
    this.dialog.open(EditSensorPopupComponent, {
      minWidth: '320px',
      maxWidth: '400px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        sensor,
        thingName
      }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.getThings();
      }
    });
  }

  public async updateThing(thing: IThingEditing) {
    const orignalName = thing.name;
    thing.name = thing.tempName;

    delete thing.editing;
    delete thing.tempName;

    this.subs.sink = this.thingService.updateThing(thing).subscribe(
      res => {
        console.log('HTTP response', res);
      },
      err => {
        thing.name = orignalName;
        this.snackBar.open(this.translateService.instant('NOTIFS.FAILS.UPDATE_THINGS_NAME'), null, {
          duration: 2000,
          panelClass: ['error-snackbar']
        });
        console.log('HTTP Error', err);
      }
    );
  }

  public filterByName() {
    const filteredThingsByName = findItemsWithTermOnKey(this.filter.name, this.things, 'name');
    const filteredThingsByDevEui = findItemsWithTermOnKey(this.filter.name, this.things, 'devEui');

    const filterThings = [
      ...filteredThingsByName,
      ...filteredThingsByDevEui
    ];

    this.updateDataSource(uniqBy(filterThings, 'id'));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
