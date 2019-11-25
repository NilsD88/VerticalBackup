import {
  cloneDeep
} from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnChanges
} from '@angular/core';
import {
  TranslateService
} from '@ngx-translate/core';

import * as randomColor from 'randomcolor';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAssetSerie } from 'src/app/models/peoplecounting/asset.model';

declare global {
  interface Window {
    moment: any;
  }
}

declare var require: any;
require('highcharts/modules/boost');
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
  selector: 'pvf-peoplecounting-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss']
})
export class MonthViewComponent implements OnInit, OnChanges {

  @Input() lastMonthLeafData: IPeopleCountingLocation;

  public chart: any;
  public chartOptions: any;
  public locale: string;

  constructor(private translateService: TranslateService) {}

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale + '-be');
    window.moment = moment;
    mTZ();

    this.initChartOptions();
    this.initChart();
    this.updateChart();
  }

  private initChartOptions() {
    Highcharts.setOptions({
      lang: {
        weekdays: moment.weekdays(),
        shortWeekdays: moment.weekdaysShort()
      }
    });

    this.chartOptions = {
      chart: {
        type: 'column',
        marginBottom: 30,
        zoomType: 'x'
      },
      title: '',
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'count-past-year',
      },
      credits: {
        enabled: false
      },
      tooltip: {
        crosshairs: true,
        shared: true,
      },
      xAxis: {
        categories: [],
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: '',
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: [],
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        y: 50,
        padding: 3,
        itemMarginTop: 5,
        itemMarginBottom: 5,
        itemStyle: {
          lineHeight: '14px'
        }
      },
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('month-view-chart-container', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }

  private updateChart() {

    if (!this.lastMonthLeafData) {
      return;
    }

    this.chartOptions.series = [];
    this.chartOptions.xAxis.categories = [];

    const categories = [];
    const series = [];

    // Setting the categories
    for (let index = 0; index < 7; index++) {
      categories.push(moment().startOf('isoWeek').add(index, 'days').format('dddd'));
    }

    // Creating a dictionary between date and weekday/weeknumber
    const dateToWeek = [];
    const initialValue = [];
    let weekNumber = 1;
    let oldWeekday = 1;
    const daysInMonth = moment().subtract(1, 'months').date(1).daysInMonth();
    for (let index = 0; index < daysInMonth; index++) {
      initialValue.push(null);
      const weekDay = moment().subtract(1, 'months').date(index + 1).isoWeekday();
      if (weekDay < oldWeekday) {
        weekNumber++;
      }
      dateToWeek.push({
        weekNumber,
        weekDay,
        date: index + 1
      });
      oldWeekday = weekDay;
    }

    if ((((this.lastMonthLeafData || {}).assets) || []).length) {
      // Generating asset colors
      const assetColors = randomColor({
        count: this.lastMonthLeafData.assets.length
      });

      // Creating the data series by asset
      this.lastMonthLeafData.assets.forEach((asset, assetIndex) => {
        const assetName = asset.name;
        const assetValues = cloneDeep(initialValue);

        for (const serie of asset.series) {
          const date = moment(serie.timestamp).date();
          assetValues[date + 1] = serie.value;
        }

        for (let index = 1; index <= weekNumber; index++) {
          const weekValues = [null, null, null, null, null, null, null];
          const dateToAdd = dateToWeek.filter(date => date.weekNumber === index);
          for (const date of dateToAdd) {
            weekValues[date.weekDay - 1] = assetValues[date.date];
          }
          series.push({
            name: `Week ${index} - ${assetName}`,
            color: assetColors[assetIndex],
            id: asset.id,
            data: weekValues,
            stack: 'W' + index,
          });
        }
      });
    }

    this.chartOptions.series = series;
    this.chartOptions.xAxis.categories = categories;

    try {
      this.chart = Highcharts.chart('month-view-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chartOptions.xAxis.categories = [];
      this.chart = Highcharts.chart('month-view-chart-container', this.chartOptions);
      console.log(error);
    }
  }


}