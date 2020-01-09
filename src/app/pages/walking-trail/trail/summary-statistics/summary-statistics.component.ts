import { WalkingTrailLocationService } from './../../../../services/walkingtrail/location.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import * as moment from 'moment';


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

  constructor(
    private locationService: WalkingTrailLocationService
  ) { }

  async ngOnInit() {
    this.displayedColumns = ['totalWeek', 'totalDay', 'avgWeek', 'avgDay'];

    const leafs = await this.locationService.getLocationsDataByIds(
      (this.leaf.parent.children || []).map(location => location.id),
      'DAILY',
      moment().startOf('isoWeek').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      moment().valueOf()
    ).toPromise();

    if ((leafs || []).length) {
      const leaf = leafs.find(x => x.id === this.leaf.id) || {series: []};
      const series = leaf.series;
      this.data = {
        totalWeek: (series.length) ? series.reduce((a, b) => a + b.valueIn, 0) : null,
        totalDay:  (series.length) ? series[series.length - 1].valueIn : null,
        avgWeek: leafs.reduce(
          (a, b) => {
            return a + b.series.reduce((c, d) => c + d.valueIn, 0);
          }, 0
        ) / leafs.length,
        avgDay: leafs.reduce(
          (a, b) => {
            const valueIn = (b.series.length) ? b.series[b.series.length - 1].valueIn : 0;
            return a + valueIn;
          }, 0
        ) / leafs.length,
      };
    }

    this.updateDataSource(this.data);
    this.isLoading = false;
  }

  private updateDataSource(data: IData) {
    this.dataSource = new MatTableDataSource([data]);
    this.dataSource.sort = this.sort;
  }

}
