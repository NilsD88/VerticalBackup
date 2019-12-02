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
        today: generateTodayDataSeries()[0].valueIn,
        week: generateThisWeekDataSeries()[0].valueIn
      });
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
      valueIn: Math.floor(Math.random() * 101)
    }
  );
  return dataSeries;
}

function generateThisWeekDataSeries(): IPeopleCountingAssetSerie[] {
  const dataSeries: IPeopleCountingAssetSerie[] = [];
  dataSeries.push(
    {
      timestamp: moment().isoWeekday(1).startOf('day').valueOf(),
      valueIn: Math.floor(Math.random() * 101)
    }
  );
  return dataSeries;
}
