import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output
} from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const exporting = require('highcharts/modules/exporting');
const exportData = require('highcharts/modules/export-data');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

@Component({
  selector: 'pvf-stairwaytohealth-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('chartContainer', {static: false}) chartContainer: ElementRef;

  @Input() public series: any[];
  @Input() public title: string;
  @Input() public key: string;

  @Input() chartLoading = false;
  @Input() loadingError = false;

  @Output() wantTryAgain: EventEmitter<string> = new EventEmitter<string>();

  public chart: any;
  public chartOptions: any;

  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initChart();
  }


  private initChart() {
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: this.title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: []
    };
    this.chart = Highcharts.chart(this.chartContainer.nativeElement, this.chartOptions);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.series) {
      if ((changes.series.currentValue || []).length) {
        this.updateChart();
      }
    }
  }

  private updateChart() {
    this.chartOptions.series = [];
    this.chartOptions.series.push({
      data: [
        ...this.series
      ]
    });
    try {
      this.chart = Highcharts.chart(this.chartContainer.nativeElement, this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chart = Highcharts.chart(this.chartContainer.nativeElement, this.chartOptions);
    }
  }

  public tryAgain() {
    this.wantTryAgain.emit(this.key);
  }

}
