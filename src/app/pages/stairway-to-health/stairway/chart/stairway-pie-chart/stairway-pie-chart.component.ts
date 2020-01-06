import { Component, OnInit, Input } from '@angular/core';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import * as moment from 'moment';

import * as mTZ from 'moment-timezone';


@Component({
  selector: 'pvf-stairway-pie-chart',
  templateUrl: './stairway-pie-chart.component.html',
  styleUrls: ['./stairway-pie-chart.component.scss']
})
export class StairwayPieChartComponent implements OnInit {

  @Input() leaf: IPeopleCountingLocation;
  public titleDay='Day'
  public seriesDay=[];
  public titleWeek='Month'
  public seriesWeek=[];
  public titleAll='All'
  public seriesAll =[];
  public height = '400';

  //temp for testing
  public tempTestData: IPeopleCountingLocation= {
    assets:[{name: 'test', series:[]},{name: 'test1', series:[]},{name: 'test2', series:[]}]


  }

  constructor() {
    this.leaf = this.tempTestData;
   }

  ngOnInit() {
    if(this.leaf){
    this.generateDummyData();
    this.getDataForToday();
    this.getDataForWeek();
    this.getAllData();
    }
  }


  getDataForToday(){

    let startDay = moment().startOf('day');
    let currentTimeStamp = moment();
 
    this.seriesDay = [];
     


    this.leaf.assets.forEach(asset => {

      let tempCount = 0;
    
      asset.series.forEach(serie => {
        
        if (moment(serie.timestamp).isSameOrAfter(startDay)&& moment(serie.timestamp).isSameOrBefore(currentTimeStamp) ) {

         tempCount+=serie.valueIn;
         
        }

      })
      this.seriesDay.push({name: asset.name, y: tempCount})
      
      });

   

   

  }

  getDataForWeek(){

    let startWeek = moment().startOf('isoWeek');
    let currentTimeStamp = moment();
   
    this.seriesWeek = [];
     


    this.leaf.assets.forEach(asset => {

      let tempCount = 0;
    
      asset.series.forEach(serie => {
        
        if (moment(serie.timestamp).isSameOrAfter(startWeek)&& moment(serie.timestamp).isSameOrBefore(currentTimeStamp) ) {

         tempCount+=serie.valueIn;
         
        }

      })
      this.seriesWeek.push({name: asset.name, y: tempCount})
      
      });

      

  }

  getAllData(){

    
    let currentTimeStamp = moment();

    this.seriesAll = [];
     


    this.leaf.assets.forEach(asset => {

      let tempCount = 0;
    
      asset.series.forEach(serie => {
        
        if (moment(serie.timestamp).isSameOrBefore(currentTimeStamp) ) {

         tempCount+=serie.valueIn;
         
        }

      })
      this.seriesAll.push({name: asset.name, y: tempCount})
      
      });



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

}
