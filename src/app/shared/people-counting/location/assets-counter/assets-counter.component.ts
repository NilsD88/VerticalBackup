import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
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
  id: string;
  name: string;
  today?: number;
  week?: number;
}

@Component({
  selector: 'pvf-peoplecounting-assets-counter',
  templateUrl: './assets-counter.component.html',
  styleUrls: ['./assets-counter.component.scss']
})
export class AssetsCounterComponent implements OnInit {

  @Input() leaf: IPeopleCountingLocation;
  @Input() assetService: WalkingTrailAssetService;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public checkpoints: ICheckpoint[] = [];
  public isLoading = true;

  public dataSource: MatTableDataSource<ICheckpoint>;
  public displayedColumns: string[];


  constructor() {}

  async ngOnInit() {

    // TODO: uncomment those lines when backend is ready

    let dayValuesReady = false;
    let weekValuesReady = false;

    /*
    this.checkpoints = this.leaf.assets.map(asset => {
      return {
        id: asset.id,
        name: asset.name
      };
    });

    // Get the today values
    this.assetService.getAssetsDataByIds(
      this.leaf.assets.map(asset => asset.id),
      'DAILY',
      moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      moment().valueOf()
    ).subscribe((assets) => {
      assets.forEach(asset => {
        const index = this.checkpoints.findIndex(a => a.id === asset.id);
        if (index > -1) {
          this.checkpoints[index].today = asset.series[0].valueIn;
        }
      });
      dayValuesReady = true;
      if(weekValuesReady) {
        this.updateDataSource(this.checkpoints);
        this.isLoading = false;
      }
    });

    // Get the week values
    this.assetService.getAssetsDataByIds(
      this.leaf.assets.map(asset => asset.id),
      'WEEKLY',
      moment().subtract(1, 'week').startOf('isoWeek').valueOf(),
      moment().startOf('isoWeek').valueOf(),
    ).subscribe((assets) => {
      assets.forEach(asset => {
        const index = this.checkpoints.findIndex(a => a.id === asset.id);
        if (index > -1) {
          this.checkpoints[index].week = asset.series[0].valueIn;
        }
      });
      weekValuesReady = false;
      if(dayValuesReady) {
        this.updateDataSource(this.checkpoints);
        this.isLoading = false;
      }
    });
    */


    // TODO: remove those lines when backend is ready
    for (const asset of this.leaf.assets) {
      // Sum of a specific range per asset for a specific location
      this.checkpoints.push({
        id: asset.id,
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
