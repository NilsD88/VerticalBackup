import { cloneDeep } from 'lodash';
import { IPeopleCountingLocation } from './../../../../../models/peoplecounting/location.model';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {
  TranslateService
} from '@ngx-translate/core';
import * as mTZ from 'moment-timezone';
import { IFilterChartData, PeriodicDuration, Intervals } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const exporting = require('highcharts/modules/exporting');
const exportData = require('highcharts/modules/export-data');
const Highcharts = require('highcharts/highstock');
const randomColor = require('randomcolor');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);



@Component({
  selector: 'pvf-stairway-count-chart',
  templateUrl: './stairway-count-chart.component.html',
  styleUrls: ['./stairway-count-chart.component.scss']
})
export class StairwayCountChartComponent implements OnInit, OnChanges {

  @ViewChild('dataRangeSelection', {
    static: false
  }) dataRangeSelection;

  public loading = false;

  public filter: IFilterChartData = {
    interval: 'HOURLY',
    from: moment().subtract(1, 'week').toDate().getTime(),
    to: moment().toDate().getTime(),
  };

  @Input() leafs: IPeopleCountingLocation[];
  @Input() chartData: IPeopleCountingLocation[];
  @Output() download = new EventEmitter();

  public chart: any;
  public chartOptions: any;
  public categoriesX: any[];
  public series: any[];
  public locale: string;
  public tempTestData: IPeopleCountingLocation[]= [
    {assets:[{name: 'test', series:[]},{name: 'test1', series:[]},{name: 'test2', series:[]}]},
    {assets:[{name: 'test3', series:[]},{name: 'test4', series:[]},{name: 'test5', series:[]}]},
    {assets:[{name: 'test6', series:[]},{name: 'test7', series:[]},{name: 'test8', series:[]}]},


  ];

  

  constructor(private translateService: TranslateService) { 

    //remove this to work with real data
  this.leafs = this.tempTestData;

  }

  ngOnInit() {

    this.generateDummyData();

    this.locale = this.translateService.currentLang;
    moment.locale(this.locale + '-be');
    window.moment = moment;
    mTZ();
    this.getDataByMonth();


    console.log(this.categoriesX);
    console.log(this.series)
    this.initChartOptions();
    this.initChart();
  }

  ngOnChanges(){

  }

  private initChartOptions(){
    this.chartOptions=  {
      title: {
          text: 'Count'
      },
      credits: {
        enabled: false
    },
      xAxis: {
          categories:  this.categoriesX
      },
  
      series: this.series
  
      }
  }

  private initChart() {


    try {

      this.chart = Highcharts.chart('stairway-chart', this.chartOptions)

    } catch (error) {
      console.log(error);
    }



  }


  private getDataByMonth(){


    this.series = [];
    this.categoriesX = [];
    var dataArr = [];

    var from = moment(this.filter.from);
    var to = moment(this.filter.to);
    

    this.filterData();

    this.leafs.forEach(leaf=>{

    leaf.assets.forEach(asset => {
      dataArr = [];

      asset.series.forEach(serie => {
        var timestamp = new Date(serie.timestamp);
        if (moment(serie.timestamp).isSameOrBefore(to) && moment(serie.timestamp).isSameOrAfter(from)) {
          if (this.categoriesX.includes(new Date(serie.timestamp).toLocaleString('default', {
              month: 'long'
            })) && dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toLocaleString('default', {
              month: 'long'
            }))] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toLocaleString('default', {
              month: 'long'
            }))] += serie.valueIn;
          else
            dataArr.push(serie.valueIn);
          this.categoriesX.push(new Date(serie.timestamp).toLocaleString('default', {
            month: 'long'
          }));
          this.categoriesX = this.categoriesX.filter((item, index) => this.categoriesX.indexOf(item) === index)
        }

      })
      this.series.push({
        type: 'column',
        name: asset.name,
        data: dataArr
      });


    });

  })


  }

  private getDataByWeek(){


    this.series = [];
    this.categoriesX = [];
    var dataArr = [];

    var from = moment(this.filter.from);
    var to = moment(this.filter.to);
    

    this.filterData();
    this.leafs.forEach(leaf=>{

      leaf.assets.forEach(asset => {
      dataArr = [];

      asset.series.forEach(serie => {
        var timestamp = new Date(serie.timestamp);
        if (moment(serie.timestamp).isSameOrBefore(to) && moment(serie.timestamp).isSameOrAfter(from)) {
   
             
          if (this.categoriesX.includes(new Date(moment(serie.timestamp).startOf('isoWeek').toDate()).toDateString()) && dataArr[this.categoriesX.indexOf(new Date(moment(serie.timestamp).startOf('isoWeek').toDate()).toDateString())] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(moment(serie.timestamp).startOf('isoWeek').toDate()).toDateString())] += serie.valueIn;
          else
            dataArr.push(serie.valueIn);
          this.categoriesX.push(new Date(moment(serie.timestamp).startOf('isoWeek').toDate()).toDateString());
          this.categoriesX = this.categoriesX.filter((item, index) => this.categoriesX.indexOf(item) === index)
        }

      })
      this.series.push({
        type: 'column',
        name: asset.name,
        data: dataArr
      });


    });
  })


  }


  private getDataByDay(){


    this.series = [];
    this.categoriesX = [];
    var dataArr = [];

    var from = moment(this.filter.from);
    var to = moment(this.filter.to);
    

    this.filterData();
    this.leafs.forEach(leaf=>{

      leaf.assets.forEach(asset => {
      dataArr = [];

      asset.series.forEach(serie => {
        var timestamp = new Date(serie.timestamp);
        if (moment(serie.timestamp).isSameOrBefore(to) && moment(serie.timestamp).isSameOrAfter(from)) {
  
             
          if (this.categoriesX.includes(new Date(moment(serie.timestamp).toDate()).toDateString()) && dataArr[this.categoriesX.indexOf(new Date(moment(serie.timestamp).toDate()).toDateString())] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(moment(serie.timestamp).toDate()).toDateString())] += serie.valueIn;
          else
            dataArr.push(serie.valueIn);
          this.categoriesX.push(new Date(moment(serie.timestamp).toDate()).toDateString());
          this.categoriesX = this.categoriesX.filter((item, index) => this.categoriesX.indexOf(item) === index)
        }

      })
      this.series.push({
        type: 'column',
        name: asset.name,
        data: dataArr
      });


    });

  })

  }

  private getDataByHour(){


    this.series = [];
    this.categoriesX = [];
    var dataArr = [];

    var from = moment(this.filter.from);
    var to = moment(this.filter.to);
    

    this.filterData();
    this.leafs.forEach(leaf=>{

      leaf.assets.forEach(asset => {
      dataArr = [];

      asset.series.forEach(serie => {
        var timestamp = new Date(serie.timestamp);
        if (moment(serie.timestamp).isSameOrBefore(to) && moment(serie.timestamp).isSameOrAfter(from)) {
            dataArr.push(serie.valueIn);
          this.categoriesX.push(new Date(moment(serie.timestamp).toDate()).toLocaleTimeString());
        }

      })
      this.series.push({
        type: 'column',
        name: asset.name,
        data: dataArr
      });


    });
  })


  }


  private getDataByYear(){


    this.series = [];
    this.categoriesX = [];
    var dataArr = [];

    var from = moment(this.filter.from);
    var to = moment(this.filter.to);
    

    this.filterData();
    this.leafs.forEach(leaf=>{

      leaf.assets.forEach(asset => {
      dataArr = [];

      asset.series.forEach(serie => {
        var timestamp = new Date(serie.timestamp);
        if (moment(serie.timestamp).isSameOrBefore(to) && moment(serie.timestamp).isSameOrAfter(from)) {
   
             
          if (this.categoriesX.includes(new Date(moment(serie.timestamp).startOf('year').toDate()).getFullYear()) && dataArr[this.categoriesX.indexOf(new Date(moment(serie.timestamp).startOf('year').toDate()).getFullYear())] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(moment(serie.timestamp).startOf('year').toDate()).getFullYear())] += serie.valueIn;
          else
            dataArr.push(serie.valueIn);
          this.categoriesX.push(new Date(moment(serie.timestamp).startOf('year').toDate()).getFullYear());
          this.categoriesX = this.categoriesX.filter((item, index) => this.categoriesX.indexOf(item) === index)
        }

      })
      this.series.push({
        type: 'column',
        name: asset.name,
        data: dataArr
      });


    });

  })


  }


  private generateDummyData() {

    this.leafs.forEach(leaf=>{
      leaf.assets.forEach(element => {
        element.series = [];
        element.series.push({
            valueIn: 10,
            timestamp: moment().subtract(1,'hours').valueOf()
          }, {
            valueIn: 20,
            timestamp: moment().subtract(2,'hours').valueOf()
          }, {
            valueIn: 30,
            timestamp: moment().subtract(1, 'days').valueOf()
          }, {
            valueIn: 40,
            timestamp: moment().subtract(2, 'days').valueOf()
          }, {
            valueIn: 40,
            timestamp: moment().subtract(3, 'days').valueOf()
          }, {
            valueIn: 50,
            timestamp: moment().subtract(4, 'days').valueOf()
          }, {
            valueIn: 25,
            timestamp: moment().subtract(5, 'days').valueOf()
          }, {
            valueIn: 35,
            timestamp: moment().subtract(5, 'days').valueOf()
          }, {
            valueIn: 45,
            timestamp: moment().subtract(5, 'days').valueOf()
          }, {
            valueIn: 55,
            timestamp: moment().subtract(6, 'days').valueOf()
          }, {
            valueIn: 12,
            timestamp: moment().subtract(7, 'days').valueOf()
          }, {
            valueIn: 22,
            timestamp: moment().subtract(14, 'days').valueOf()
          }, {
            valueIn: 33,
            timestamp: moment().subtract(15, 'days').valueOf()
          }, {
            valueIn: 44,
            timestamp: moment().subtract(16, 'days').valueOf()
          }, {
            valueIn: 55,
            timestamp: moment().subtract(17, 'days').valueOf()
          }, {
            valueIn: 6,
            timestamp: moment().subtract(4, 'months').valueOf()
          }, {
            valueIn: 40,
            timestamp: moment().subtract(5, 'months').valueOf()
          }, {
            valueIn: 27,
            timestamp: moment().subtract(6, 'months').valueOf()
          }, {
            valueIn: 16,
            timestamp: moment().subtract(7, 'months').valueOf()
          },
          
  
  
  
  
        )
      })



    })

   }


    private filterData() {

      this.leafs.forEach(leaf=>{


      leaf.assets.forEach(asset => {
        asset.series.sort((x, y) => {
          return x.timestamp - y.timestamp;
        })
      });})


    }


    public intervalChanged(event) {
  
        this.updateChartData({
         interval: event.value
       });

     
      
       switch (this.filter.interval) {
          case 'MONTHLY':
             this.getDataByMonth();
        break;
          case 'WEEKLY':
            this.getDataByWeek();
        break;
          case 'DAILY':
            this.getDataByDay();
        break;
          case 'HOURLY':
            this.getDataByHour()
        break;
          case 'YEARLY':
            this.getDataByYear();
        break;
    
}

      




      this.initChartOptions();
      this.initChart();



    }








  
    public dateRangeChanged(periodicDuration: PeriodicDuration) {
   

    


      this.updateChartData(periodicDuration);

      switch (this.filter.interval) {
        case 'MONTHLY':
           this.getDataByMonth();
      break;
        case 'WEEKLY':
          this.getDataByWeek();
      break;
        case 'DAILY':
          this.getDataByDay();
      break;
        case 'HOURLY':
          this.getDataByHour()
      break;
        case 'YEARLY':
          this.getDataByYear();
      break;
  
}

      this.initChartOptions();
      this.initChart();



     
    }
  
    downloadCSV() {
      this.chart.downloadCSV();
    }


    
  public updateChartData(options: { interval?: string; from?: number; to?: number; }) {
   
    const interval = options.interval ? options.interval as Intervals : this.filter.interval as Intervals;
    const from = options.from ? options.from : this.filter.from;
    const to = options.to ? options.to : this.filter.to;
    const duration = moment.duration(moment(to).diff(from));
    const durationInHours = +duration.asHours().toFixed(0);
    const originalFilter = cloneDeep(this.filter);

    this.filter = {
      interval,
      from,
      to,
      durationInHours
    };

    const differences = compareTwoObjectOnSpecificProperties(
      originalFilter, this.filter, ['interval', 'from', 'to', 'durationInHours']);

    if ((differences && differences.length > 0)) {
      this.chartData = [];
     
    }
  }


  

}
