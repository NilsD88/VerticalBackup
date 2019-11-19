import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';


interface IData {
  totalWeek: number;
  totalDay: number;
  avgWeek: number;
  avgDay: number;
}


@Component({
  selector: 'pvf-summary-statistics',
  templateUrl: './summary-statistics.component.html',
  styleUrls: ['./summary-statistics.component.scss']
})
export class SummaryStatisticsComponent implements OnInit {

  @Input() leaf: IPeopleCountingLocation;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public data: IData;
  public isLoading = true;

  public dataSource: MatTableDataSource<IData>;
  public displayedColumns: string[];

  constructor() { }

  ngOnInit() {
    this.displayedColumns = ['totalWeek', 'totalDay', 'avgWeek', 'avgDay'];

    // TODO: get these data from the backend
    this.data = {
      totalWeek: Math.floor(Math.random() * 101 * 7),
      totalDay: Math.floor(Math.random() * 101),
      avgWeek: Math.floor(Math.random() * 101 * 7),
      avgDay: Math.floor(Math.random() * 101)
    };

    this.updateDataSource(this.data);
    this.isLoading = false;
  }

  private updateDataSource(data: IData) {
    this.dataSource = new MatTableDataSource([data]);
    this.dataSource.sort = this.sort;
  }

}
