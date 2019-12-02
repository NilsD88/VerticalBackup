import { DatePipe } from '@angular/common';
import { DashboardComponent } from './../../../../tank-monitoring/dashboard/dashboard.component';
import { Component, OnInit, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import *  as moment from 'moment';
import { timestamp } from 'rxjs/operators';
import { WeatherService, IWeatherGivenHour } from 'src/app/services/weather.service';

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
  selector: 'pvf-stacked-chart',
  templateUrl: './stacked-chart.component.html',
  styleUrls: ['./stacked-chart.component.scss']
})
export class StackedChartComponent implements OnChanges ,OnInit {

  

  @HostListener('window:resize', ['$event'])
    onResize(event) {
  //console.log("changes")

 /* this.chart = Highcharts.chart('stacked-chart', this.chartOptions, function(chart){
    console.log(this.series[0].points[3].shapeArgs.height);
    chart.renderer.image('https://www.highcharts.com/samples/graphics/sun.png',((chart.series[0].data[3].plotX)+(chart.plotLeft)), 370 , 30, 30)
.add();
    
});*/
}

    @Input() leafs: IPeopleCountingLocation;


  public chart: any;
  public chartOptions: any;
  public categoriesX:any[];
  public series:any[];
  public test: IPeopleCountingLocation ={

    id:"1",

    assets: [{
      id: '0',
      name: 'Asset 1',
      locationId: '2',
      things: [],
      thresholdTemplate: null,
      series:[{ timestamp:1574937203000, value:10}, //day
              { timestamp:1574933603000, value:20}, //day
              { timestamp:1574418901000, value:30}, //week //day
              { timestamp:1574332501000, value:40}, //week //day
              { timestamp:1572431701000, value:50}, //month /week /week //day //day
              { timestamp:1572777301000, value:60}, //month /week /week //day //day
      
    ]
    },
    {
      id: '1',
      name: 'Asset 2',
      locationId: '2',
      things: [],
      thresholdTemplate: null,
      series:[
              { timestamp:1574937203000, value:10}, 
              { timestamp:1574933603000, value:20},
              { timestamp:1574418901000, value:30},
              { timestamp:1574332501000, value:40},
              { timestamp:1572431701000, value:50},
              { timestamp:1572777301000, value:60},
      ]
    },
    {
      id: '2',
      name: 'Asset 3',
      locationId: '2',
      things: [],
      thresholdTemplate: null,
      series:[
              { timestamp:1574937203000, value:10}, 
              { timestamp:1574933603000, value: 20},
              { timestamp:1574418901000, value:30},
              { timestamp:1574332501000, value:40},
              { timestamp:1572431701000, value:50},
              { timestamp:1572777301000, value:60},
      ]
    },
    {
      id: '3',
      name: 'Asset 4',
      locationId: '2',
      things: [],
      thresholdTemplate: null,
      series:[
        { timestamp:1574937203000, value:10}, 
        { timestamp:1574933603000, value: 20},
        { timestamp:1574418901000, value:30},
        { timestamp:1574332501000, value:40},
        { timestamp:1572431701000, value:50},
        { timestamp:1572777301000, value:60},]
    }]
 
  };
  

  constructor() {
    this.leafs = this.test;
     }

  ngOnInit() {
    this.getMonthData();
    this.initChartOptions();
    this.initChart();

    
  }

  ngOnChanges(changes: SimpleChanges){

   this.initChartOptions();
   this.initChart()
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
          marginBottom:70,
          marginTop:100
   
      },
      title: {
          text: 'Stacked column chart'
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
          backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false
      },

     
      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Poor Me water:'+ this.test.assets
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
      
      this.chart = Highcharts.chart('stacked-chart', this.chartOptions,(chart)=>{
       

        
        chart.renderer.button('Day',50, 20)
        .attr({
            zIndex: 3
        })
        .on('click', ()=>{
          this.getDayData();
          this.initChartOptions();
          this.initChart();

          
         /*chart.series[0].data.forEach(element => {
           var point = element,
             text = chart.renderer.text(
              '🌧️Max °C',
              point.plotX + chart.plotLeft ,
              point.plotY + chart.plotTop+20
          ).attr({
              zIndex: 5,
              borderRadius:0
          }).add(),
          box = text.getBBox();
  
      chart.renderer.rect(box.x - 5, box.y - 5, box.width + 10, box.height + 10, 5)
          .attr({
              fill: '#AFAFFF',
              stroke: 'gray',
              'stroke-width': 1,
              zIndex: 4,
              borderRadius: 0,
          })
          .add();
           
         });*/
       
         
           
        })
        .add();
     

      chart.renderer.button('Week',85, 20)
      .attr({
          zIndex: 3
      })
      .on('click',  ()=>{
        this.getWeekData();
        this.initChartOptions();
        this.initChart();
        
         
      })
      .add();

      chart.renderer.button('Month',130, 20)
      .attr({
          zIndex: 3
      })
      .on('click',  ()=>{
        this.getMonthData();
        this.initChartOptions();
        this.initChart();
         
      })
      .add();

      chart.renderer.button('Year',180, 20)
      .attr({
          zIndex: 3
      })
      .on('click',  ()=>{
        this.getYearData();
        this.initChartOptions();
        this.initChart();
        
         
      })
      .add();

     
   
      
    })
    
    } catch (error) {
      console.log(error);
    }

    
 
  }





  
  private getDayData(){
    this.series = [];
    this.categoriesX = [];
    var dataArr = []; 
    this.filterData();
    this.leafs.assets.forEach(asset => {
       dataArr = [];
     var currentDate = new Date().toDateString();
     asset.series.forEach(serie=>{
        var timestamp = new Date(serie.timestamp).toDateString();
        if(timestamp === currentDate){
          if(this.categoriesX.includes(new Date(serie.timestamp).getHours())&& dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).getHours())] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).getHours())]+=serie.value;
            else 
              dataArr.push(serie.value);
          

         
          this.categoriesX.push(new Date(serie.timestamp).getHours());
          
        }
      
     })
     this.series.push({name: asset.name, data: dataArr});
     this.categoriesX.length = dataArr.length;
    });


  }

  private getWeekData(){
 
    var dateWeekAgo = new Date();
    var currentDate = new Date();
    this.series = [];
    this.categoriesX = [];
    var dataArr = []; 
    dateWeekAgo.setDate(currentDate.getDate()-7);

    this.filterData();
    this.leafs.assets.forEach(asset => { 

      dataArr =[];
      asset.series.forEach(serie=>{
        var timestamp = new Date(serie.timestamp);
        if(timestamp <= currentDate && timestamp >= dateWeekAgo){
       var k =   dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())];
          if(this.categoriesX.includes(new Date(serie.timestamp).toDateString()) && dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())] != undefined)
            dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())]+=serie.value;
            else 
              dataArr.push(serie.value);
       
        this.categoriesX.push(new Date(serie.timestamp).toDateString());
        }
      
     })
     this.series.push({name: asset.name, data: dataArr});
     this.categoriesX.length = dataArr.length;
      
    });
   

  }

  private getMonthData(){

    this.series = [];
    this.categoriesX = [];
    var dataArr = []; 
    
    var dateMonthAgo = new Date();
    var currentDate = new Date();
    dateMonthAgo.setDate(currentDate.getDate()-30);

    this.filterData();
    this.leafs.assets.forEach(asset => {  
      dataArr =[];

     asset.series.forEach(serie=>{
        var timestamp = new Date(serie.timestamp);
        if(timestamp <= currentDate && timestamp >= dateMonthAgo){ 
          if(this.categoriesX.includes(new Date(serie.timestamp).toDateString())&& dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())] != undefined)
              dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).toDateString())]+=serie.value;
            else 
            dataArr.push(serie.value);
          this.categoriesX.push(new Date(serie.timestamp).toDateString());
        }
      
     })
     this.series.push({name: asset.name, data: dataArr});
     this.categoriesX.length = dataArr.length;
      
    });


    
   

  }


  private getYearData(){

    this.series = [];
    this.categoriesX = [];
    var dataArr = []; 
    
    var dateYearAgo = new Date();
    var currentDate = new Date();
    dateYearAgo.setDate(currentDate.getDate()-365);

    this.filterData();
    this.leafs.assets.forEach(asset => {  
      dataArr =[];

     asset.series.forEach(serie=>{
        var timestamp = new Date(serie.timestamp);
        if(timestamp <= currentDate && timestamp >= dateYearAgo){ 
          if(this.categoriesX.includes(new Date(serie.timestamp).getMonth()+1)&& dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).getMonth()+1)] != undefined)
              dataArr[this.categoriesX.indexOf(new Date(serie.timestamp).getMonth()+1)]+=serie.value;
            else 
            dataArr.push(serie.value);
          this.categoriesX.push(new Date(serie.timestamp).getMonth()+1);
        }
      
     })
     this.series.push({name: asset.name, data: dataArr});
     this.categoriesX.length = dataArr.length;
      
    });


    
    
   

  }

  


  private filterData(){

   this.leafs.assets.forEach(asset => {
      asset.series.sort((x, y)=>{
        return x.timestamp - y.timestamp;
     })
   });
  }

}
