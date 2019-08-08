import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { INewLocation } from 'src/app/models/new-location';

@Component({
  selector: 'pxs-location-explorer',
  templateUrl: './location-explorer.component.html',
  styleUrls: ['./location-explorer.component.scss']
})
export class LocationExplorerComponent implements OnInit {

  @Input() locations:INewLocation[] = [];
  @Output() notify: EventEmitter<INewLocation> = new EventEmitter<INewLocation>();
  
  tabs:{name: String, sublocations: INewLocation[]}[];
  selectedIndex: number = 0;
  selectedLocation: INewLocation;

  constructor() { }

  ngOnInit() {
    console.log(this.locations);
    this.tabs = [{
      name: "Locations",
      sublocations: this.locations
    }];
  }

  selectLocation(location) {
    this.selectedLocation = location;
    this.notify.emit(location);
  }

  goToSublocation(location){
    if(this.selectLocation != location) {
      this.selectLocation(location);
    }
    this.selectedIndex = this.tabs.length;
    this.tabs.push(location);
  }

  selectedIndexChange(index){
    const length = this.tabs.length;
    this.selectedIndex=index;
    if(index<length){
      this.tabs.splice(index+1,length-index+1);
      this.selectLocation(null);
    }
  }

}
