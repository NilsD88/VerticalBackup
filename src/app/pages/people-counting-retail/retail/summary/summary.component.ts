import { time } from 'highcharts';
import { Component, OnInit, Input } from '@angular/core';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';

@Component({
  selector: 'pvf-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {


  @Input() leafs: IPeopleCountingLocation;
  public test: IPeopleCountingLocation ={

    id:"1",

    assets: [{
      id: '0',
      name: 'Asset 1',
      locationId: '2',
      things: [],
      thresholdTemplate: null,
      series:[
              { timestamp:1575202498000, value:33},
              { timestamp:1574937203000, value:10}, //day
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
              { timestamp:1575202498000, value:23},
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
              { timestamp:1575202498000, value:21},
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
        { timestamp:1575202498000, value:63},
        { timestamp:1574937203000, value:10}, 
        { timestamp:1574933603000, value:20},
        { timestamp:1574418901000, value:30},
        { timestamp:1574332501000, value:40},
        { timestamp:1572431701000, value:50},
        { timestamp:1572777301000, value:60},]
    }]
 
  };
  

  constructor() { 

    this.getTotalCountYesterday();
  }

  ngOnInit() {
  }


 public getTotalCountYesterday(){
   var currentDate = new Date();
   var DateYesterday = new Date();
   DateYesterday.setDate(currentDate.getDate()-1);

   

   console.log(currentDate);
   console.log(DateYesterday);


 }

}
