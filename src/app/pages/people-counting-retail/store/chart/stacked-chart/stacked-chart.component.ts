import {
  element
} from 'protractor';
import {
  MonthViewComponent
} from './../../../../../shared/people-counting/location/charts/month-view/month-view.component';
import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  IPeopleCountingLocation
} from 'src/app/models/peoplecounting/location.model';
import * as moment from 'moment';
import {
  TranslateService
} from '@ngx-translate/core';
import * as mTZ from 'moment-timezone';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const exporting = require('highcharts/modules/exporting');
const exportData = require('highcharts/modules/export-data');
const Highcharts = require('highcharts/highstock');
const randomColor = require('randomcolor');

enum currentView {
  'day',
  'week',
  'month',
  'year'
}


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);


@Component({
  selector: 'pvf-peoplecountingretail-stacked-chart',
  templateUrl: './stacked-chart.component.html',
  styleUrls: ['./stacked-chart.component.scss']
})

export class StackedChartComponent implements OnChanges, OnInit {


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //console.log("changes")

    /* this.chart = Highcharts.chart('stacked-chart', this.chartOptions, function(chart){
       console.log(this.series[0].points[3].shapeArgs.height);
       chart.renderer.image('https://www.highcharts.com/samples/graphics/sun.png',((chart.series[0].data[3].plotX)+(chart.plotLeft)), 370 , 30, 30)
   .add();
       
   });*/
  }



  @Input() leaf: IPeopleCountingLocation;

  public currentView = currentView.month;
  public chart: any;
  public chartOptions: any;
  public categoriesX: any[];
  public series: any[];
  public locale: string;







  constructor(private translateService: TranslateService) {


  }

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale + '-be');
    window.moment = moment;
    mTZ();

    if (this.leaf) {
      this.getMonthData();
      this.initChartOptions();
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.leaf) {
      // This mehtod generates fake data, comment to work with real data
      this.generateDummyData();
      if (this.currentView == currentView.day)
        this.getDayData();
      else if (this.currentView == currentView.week)
        this.getWeekData();
      else if (this.currentView == currentView.month)
        this.getMonthData();
      else this.getYearData();



      this.initChartOptions();
      this.initChart()
    }
  }

  private generateDummyData() {

    this.leaf.assets.forEach(element => {
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
        }




      )
    })




  }

  private initChartOptions() {

    const instance = this;

    Highcharts.setOptions({
      lang: {
        weekdays: moment.weekdays(),
        shortWeekdays: moment.weekdaysShort()
      }
    });

    this.chartOptions = {
      chart: {

        type: 'column',
        height:600,
        marginBottom: 130,
        marginTop: 130,
  
       

      },
      title: {
        text: 'Count by ' + currentView[this.currentView]
      },
      xAxis: {
        categories: this.categoriesX
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Count of people'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( // theme
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'gray'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },


      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/>'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: this.series
    };
  }

  private initChart() {


    try {

      this.chart = Highcharts.chart('stacked-chart', this.chartOptions, (chart) => {



        chart.renderer.button('Day', 50, 80)
          .attr({
            zIndex: 3
          })
          .on('click', () => {
            this.getDayData();
            this.currentView = currentView.day;
            this.initChartOptions();
            this.initChart();
            


          })
          .add();


        chart.renderer.button('Week', 85, 80)
          .attr({
            zIndex: 3
          })
          .on('click', () => {
            this.getWeekData();
            this.currentView = currentView.week;
            this.initChartOptions();
            this.initChart();
            


          })
          .add();

        chart.renderer.button('Month', 130, 80)
          .attr({
            zIndex: 3
          })
          .on('click', () => {
            this.getMonthData();
            this.currentView = currentView.month;
            this.initChartOptions();
            this.initChart();
            

          })
          .add();

        chart.renderer.button('Year', 180, 80)
          .attr({
            zIndex: 3
          })
          .on('click', () => {
            this.getYearData();
            this.currentView = currentView.year;
            this.initChartOptions();
            this.initChart();
            


          })
          .add();




      })

    } catch (error) {
      console.log(error);
    }



  }






  private getDayData() {
    this.series = [];
    this.categoriesX = [];
    var dataArr = [];
    this.filterData();
    var currentTime = moment();
    var _24HoursBeforeCurrentTime = moment().subtract(1,'days').startOf('day')
    this.leaf.assets.forEach(asset => {
      dataArr = [];
      asset.series.forEach(serie => {
        
        if (moment(serie.timestamp).isSameOrAfter(_24HoursBeforeCurrentTime)&& moment(serie.timestamp).isSameOrBefore(currentTime) ) {
          if (this.categoriesX.includes(new Date(serie.timestamp).toLocaleTimeString()) && dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toLocaleTimeString())] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toLocaleTimeString())] += serie.valueIn;
          else
            dataArr.push(serie.valueIn);



          this.categoriesX.push(new Date(serie.timestamp).toLocaleTimeString());
          this.categoriesX = this.categoriesX.filter((item, index) => this.categoriesX.indexOf(item) === index)

        }

      })
      this.series.push({
        name: asset.name,
        data: dataArr
      });

    });


  }

  private getWeekData() {

    var dateWeekAgo = new Date();
    var currentDate = new Date();
    this.series = [];
    this.categoriesX = [];
    var dataArr = [];
    dateWeekAgo.setDate(currentDate.getDate() - 7);

    this.filterData();
    this.leaf.assets.forEach(asset => {

      dataArr = [];
      asset.series.forEach(serie => {
        var timestamp = new Date(serie.timestamp);
        if (timestamp <= currentDate && timestamp >= dateWeekAgo) {
          var k = dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())];
          if (this.categoriesX.includes(new Date(serie.timestamp).toDateString()) && dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())] += serie.valueIn;
          else
            dataArr.push(serie.valueIn);

          this.categoriesX.push(new Date(serie.timestamp).toDateString());
          this.categoriesX = this.categoriesX.filter((item, index) => this.categoriesX.indexOf(item) === index)
        }

      })
      this.series.push({
        name: asset.name,
        data: dataArr
      });


    });


  }

  private getMonthData() {

    this.series = [];
    this.categoriesX = [];
    var dataArr = [];

    var dateMonthAgo = new Date();
    var currentDate = new Date();
    dateMonthAgo.setDate(currentDate.getDate() - 30);

    this.filterData();
    this.leaf.assets.forEach(asset => {
      dataArr = [];

      asset.series.forEach(serie => {
        var timestamp = new Date(serie.timestamp);
        if (timestamp <= currentDate && timestamp >= dateMonthAgo) {
          if (this.categoriesX.includes(new Date(serie.timestamp).toDateString()) && dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())] += serie.valueIn;
          else
            dataArr.push(serie.valueIn);
          this.categoriesX.push(new Date(serie.timestamp).toDateString());
          this.categoriesX = this.categoriesX.filter((item, index) => this.categoriesX.indexOf(item) === index)
        }

      })
      this.series.push({
        name: asset.name,
        data: dataArr
      });


    });





  }


  private getYearData() {

    this.series = [];
    this.categoriesX = [];
    var dataArr = [];

    var dateYearAgo = new Date();
    var currentDate = new Date();
    dateYearAgo.setDate(currentDate.getDate() - 365);

    this.filterData();
    this.leaf.assets.forEach(asset => {
      dataArr = [];

      asset.series.forEach(serie => {
        var timestamp = new Date(serie.timestamp);
        if (timestamp <= currentDate && timestamp >= dateYearAgo) {
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
        name: asset.name,
        data: dataArr
      });


    });






  }




  private filterData() {


    this.leaf.assets.forEach(asset => {
      asset.series.sort((x, y) => {
        return x.timestamp - y.timestamp;
      })
    });
  }

}
