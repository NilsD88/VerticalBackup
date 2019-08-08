import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ISublocation, ILocation } from 'src/app/models/locations.model';

@Component({
  selector: 'pxs-location-explorer',
  templateUrl: './location-explorer-old.component.html',
  styleUrls: ['./location-explorer-old.component.scss']
})
export class LocationExplorerOldComponent implements OnInit, OnChanges {

  @Input() locations:ILocation[]|ISublocation[] = [];
  @Output() notify: EventEmitter<ILocation|ISublocation> = new EventEmitter<ILocation|ISublocation>();
  
  tabs:{
    name: String, 
    sublocations: ISublocation[]|ILocation[]
    currentLocation?: ILocation|ISublocation
  }[];

  selectedIndex: number = 0;
  selectedLocation: ILocation;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges) {
    if(changes.locations) {
      if(changes.locations.currentValue !== changes.locations.previousValue) {
        this.tabs = [{
          name: "Locations",
          sublocations: this.locations,
        }];
      }
    }
  }

  selectLocation(location) {
    this.selectedLocation = location;
    this.notify.emit(location);
  }

  goToSublocation(event, location){
    event.stopPropagation();
    if(this.selectedLocation != location) {
      this.selectLocation(location);
    }
    this.selectedIndex = this.tabs.length;
    this.tabs.push(location);
  }

  selectedIndexChange(index){
    const length = this.tabs.length;
    this.selectedIndex=index;
    if(index<length-1){
      this.tabs.splice(index+1,length-index+1);
      this.selectLocation(this.tabs[index]);
    }
  }

}
