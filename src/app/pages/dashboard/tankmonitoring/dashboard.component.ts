import {Component, OnInit, ViewChild} from '@angular/core';
import {Asset} from '../../../models/asset.model';
import {AssetService} from '../../../services/asset.service';
import {TranslateService} from '@ngx-translate/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  @ViewChild(MatSort) sort: MatSort;

  public items: Asset[] = [];
  public dataSource;
  public chartData = [];

  public filter = {
    name: '',
    thresholdTemplates: [],
    locationType: '',
    locations: [],
    status: ''
  };

  displayedColumns: string[] = ['name', 'status'];


  constructor(private assetService: AssetService, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.loadItems();
  }

  public async loadItems() {
    this.items = await this.assetService.getAssets(this.filter);
    console.log(this.items);
    this.createChartData();
  
    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.sort = this.sort;
    
  }

  public async createChartData() {
    this.chartData = []; // reset chartdata
    const statuses = ['OK', 'LOW', 'HIGH', 'CRITICAL'];

    statuses.forEach(async (status) => {
      this.chartData.push({
        name: await this.translateService.get('DASHBOARD.SMART_TANK.STATUS.' + status).toPromise(),
        y: this.items.filter((item: Asset) => {
          return item.status === status;
        }).length
      });
    });
  }

  public pieClicked(point: string) {
    console.log(point);
    this.filter.status = point;
    this.loadItems();
  }

}
