import {Component, OnInit} from '@angular/core';
import {Asset} from '../../../models/asset.model';
import {AssetService} from '../../../services/asset.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public items: Asset[] = [];
  public chartData = [];

  public filter = {
    name: '',
    thresholdTemplates: [],
    locationType: '',
    locations: [],
    status: ''
  };

  constructor(private assetService: AssetService, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.loadItems();
  }

  public async loadItems() {
    this.items = await this.assetService.getAssets(this.filter);
    this.createChartData();
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
