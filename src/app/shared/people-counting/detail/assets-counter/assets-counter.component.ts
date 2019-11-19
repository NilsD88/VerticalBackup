import { WalkingTrailAssetService } from './../../../../services/walkingtrail/asset.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';


import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { MatTableDataSource, MatSort } from '@angular/material';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAssetSerie } from 'src/app/models/peoplecounting/asset.model';

declare global {
  interface Window {
    moment: any;
  }
}

moment.locale('fr-be');
window.moment = moment;
mTZ();

interface ICheckpoint {
  name: string;
  today: number;
  week: number;
}

@Component({
  selector: 'pvf-peoplecounting-assets-counter',
  templateUrl: './assets-counter.component.html',
  styleUrls: ['./assets-counter.component.scss']
})
export class AssetsCounterComponent implements OnInit {

  @Input() leaf: IPeopleCountingLocation;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public checkpoints: ICheckpoint[] = [];
  public isLoading = true;

  public dataSource: MatTableDataSource<ICheckpoint>;
  public displayedColumns: string[];

  constructor(
    private assetService: WalkingTrailAssetService
  ) {}

  async ngOnInit() {
  
    for (const asset of this.leaf.assets) {

      // TODO: get these data from the backend
      // Sum of a specific range per asset for a specific location
      this.checkpoints.push({
        name: asset.name,
        today: generateTodayDataSeries()[0].sum,
        week: generateThisWeekDataSeries()[0].sum
      });

      /*
      const todayThings: IThing[] = await this.assetService.getAssetDataById(
        asset.id,
        'DAILY',
        moment().startOf('day').valueOf(),
        moment().add(1, 'days').startOf('day').valueOf()
      ).toPromise();

      this.assetsSumOfToday.push(
        todayThings[0].sensors[0].series[0].sum
      );

      const weekThings: IThing[] = await this.assetService.getAssetDataById(
        asset.id,
        'WEEKLY',
        moment().isoWeekday(1).startOf('day').valueOf(),
        moment().isoWeekday(8).startOf('day').valueOf()
      ).toPromise();

      this.assetsSumOfThisWeek.push(
        weekThings[0].sensors[0].series[0].sum
      );
      */

    }

    this.displayedColumns = ['name', 'today', 'week'];
    this.updateDataSource(this.checkpoints);
    this.isLoading = false;
  }

  private updateDataSource(checkpoint: ICheckpoint[]) {
    this.dataSource = new MatTableDataSource(checkpoint);
    this.dataSource.sort = this.sort;
  }
}


function generateTodayDataSeries(): IPeopleCountingAssetSerie[] {
  const dataSeries: IPeopleCountingAssetSerie[] = [];
  dataSeries.push(
    {
      timestamp: moment().startOf('day').valueOf(),
      sum: Math.floor(Math.random() * 101)
    }
  );
  return dataSeries;
}

function generateThisWeekDataSeries(): IPeopleCountingAssetSerie[] {
  const dataSeries: IPeopleCountingAssetSerie[] = [];
  dataSeries.push(
    {
      timestamp: moment().isoWeekday(1).startOf('day').valueOf(),
      sum: Math.floor(Math.random() * 101)
    }
  );
  return dataSeries;
}
