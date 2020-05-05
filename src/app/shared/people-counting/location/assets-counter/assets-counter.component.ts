import { SubSink } from 'subsink';
import { IPeopleCountingAsset } from './../../../../models/peoplecounting/asset.model';
import { WalkingTrailsAssetService } from 'src/app/services/walking-trails/asset.service';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { MatTableDataSource, MatSort } from '@angular/material';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';

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
export class AssetsCounterComponent implements OnInit, OnDestroy {

  @Input() leaf: IPeopleCountingLocation;
  @Input() assets: IPeopleCountingAsset[];
  @Input() assetUrl: string;
  @Input() assetService: WalkingTrailsAssetService;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public checkpoints: ICheckpoint[] = [];
  public isLoading = true;
  public dataSource: MatTableDataSource<ICheckpoint>;
  public displayedColumns: string[];

  private subs = new SubSink();

  constructor() {}

  async ngOnInit() {

    if (!this.assets) {
      this.assets = await this.assetService.getAssetsByLocationId(this.leaf.id).toPromise();
    }

    let dayValuesReady = false;
    let weekValuesReady = false;
    this.checkpoints = this.assets.map(asset => {
      return {
        id: asset.id,
        name: asset.name
      };
    });

    this.subs.add(
      // Get the today values
      this.assetService.getAssetsDataByIds(
        this.assets.map(asset => asset.id),
        'DAILY',
        moment().startOf('day').valueOf(),
        moment().endOf('day').valueOf()
      ).subscribe((assets) => {
        assets.forEach(asset => {
          const index = this.checkpoints.findIndex(a => a.id === asset.id);
          if (index > -1) {
            this.checkpoints[index].today = asset.series[0].valueIn;
          }
        });
        dayValuesReady = true;
        if (weekValuesReady) {
          this.updateDataSource(this.checkpoints);
          this.isLoading = false;
        }
      }),
      // Get the week values
      this.assetService.getAssetsDataByIds(
        this.assets.map(asset => asset.id),
        'WEEKLY',
        moment().startOf('isoWeek').valueOf(),
        moment().endOf('isoWeek').valueOf(),
      ).subscribe((assets) => {
        assets.forEach(asset => {
          const index = this.checkpoints.findIndex(a => a.id === asset.id);
          if (index > -1) {
            this.checkpoints[index].week = asset.series[0].valueIn;
          }
        });
        weekValuesReady = false;
        if (dayValuesReady) {
          this.updateDataSource(this.checkpoints);
          this.isLoading = false;
        }
      })
    );

    this.displayedColumns = ['name', 'today', 'week'];
    this.updateDataSource(this.checkpoints);
    this.isLoading = false;
  }


  private updateDataSource(checkpoint: ICheckpoint[]) {
    this.dataSource = new MatTableDataSource(checkpoint);
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

