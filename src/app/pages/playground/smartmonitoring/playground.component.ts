import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Asset, IGeolocation } from 'src/app/models/asset.model';
import { INewLocation, NewLocation } from 'src/app/models/new-location';


@Component({
  selector: 'pvf-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit {

  assets = [];
  locations = MOCK_LOCATIONS;
  parentLocation: INewLocation;
  
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
  }

  updateAssetsAndLocations(location: INewLocation) {
    console.log("Change location: "+location.name);
    if (location) {
      console.log("there is a location");
      this.assets = [];
      this.locations = [];
      this.changeDetectorRef.detectChanges();
      this.assets = MOCK_ASSETS;
      this.parentLocation = location;
      this.locations = location.sublocations;
      this.changeDetectorRef.detectChanges();
    } else {
      this.assets = [];
      this.changeDetectorRef.detectChanges();
      this.locations = MOCK_LOCATIONS;
      this.parentLocation = null;
      this.changeDetectorRef.detectChanges();
    }
  }
}

const MOCK_ASSETS:Asset[] = [];
const MOCK_LOCATIONS:INewLocation[] = [];

const ASSETS_GEOLOCATION:IGeolocation[] = [
  {
    lng: 4.300289154052734,
    lat: 50.87292803971143
  },
  {
    lng: 4.387836456298828,
    lat: 50.87065314638895
  },
  {
    lng: 4.327583312988281,
    lat: 50.83315558401709
  }
];

const LOCATIONS_GEOLOCATION:IGeolocation[] = [
  {
    lng: 4.357602596282959,
    lat: 50.85181330562521
  }
];

ASSETS_GEOLOCATION.forEach(element => {
  const asset = new Asset(null);
  asset.geolocation = element;
  MOCK_ASSETS.push(asset);
});

LOCATIONS_GEOLOCATION.forEach(element => {
  const location = new NewLocation(null);
  location.geolocation = element;
  location.name = 'Location 1';
  location.sublocations = [];
  const sublocation = new NewLocation(null);
  sublocation.name = 'Sublocation 1';
  sublocation.geolocation = element;
  location.sublocations.push(sublocation);
  MOCK_LOCATIONS.push(location);
});

