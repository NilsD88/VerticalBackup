import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'pvf-devtest',
  templateUrl: './devtest.component.html',
  styleUrls: ['./devtest.component.scss']
})
export class DevtestComponent implements OnInit {
  public chartData = [];
  public chartOptions = {
    title: 'test demo',
    height: 400
  };

  constructor() {
  }

  ngOnInit() {
    this.setData();
  }

  public setData() {
    const containers = ['battery', 'pulse', 'temperature', 'humidity'];
    for (let i = 0; i < containers.length; i++) {
      this.chartData.push({
        label: containers[i],
        series: [
          {label: '1559685600000', avg: 40.0, min: 20, max: 100},
          {label: '1559689200000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559692800000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559696400000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559700000000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559703600000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559707200000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559710800000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559714400000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559718000000', avg: 95.0, min: 95.0, max: 95.0},
          {label: '1559721600000', avg: 95.0, min: 95.0, max: 95.0}
        ]
      });
    }
  }

}
