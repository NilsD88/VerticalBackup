import { Component, OnInit, ViewChild } from '@angular/core';
import { Thing } from 'src/app/models/thing.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ThingService } from 'src/app/services/thing.service';
import { SharedService } from 'src/app/services/shared.service';
import { NewThingsService } from 'src/app/services/new-things.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'pxs-list-things',
  templateUrl: './list-things.component.html',
  styleUrls: ['./list-things.component.scss']
})
export class ListThingsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public searchTerm$ = new Subject<string>();

  public things: Thing[] = [];
  public activeInput: number = null;
  public filter = {
    devEui: '',
    name: ''
  };

  public dataSource: MatTableDataSource<Thing>;
  public displayedColumns: string[] = ['name', 'devEui', 'sensors', 'actions'];

  public isLoading = false;

  constructor(private thingService: ThingService, private sharedService: SharedService, private newThingsService: NewThingsService) {
  }

  public ngOnInit() {
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
    this.getThings();
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

  public async saveThing(thing: Thing): Promise<void> {
    try {
      await this.thingService.updateName(thing);
      this.getThings();
      this.sharedService.showNotification('Successfully saved thing name', 'success');
      this.activeInput = null;
    } catch (err) {
      this.sharedService.showNotification('Error saving thing name', 'error');
    }
  }

  public searchChanged(event) {
    this.searchTerm$.next(event);
    this.isLoading = true;
  }
}
