import {Component, OnInit} from '@angular/core';
import { NewLocationService } from 'src/app/services/new-location.service';
import { NewLocation } from 'src/app/models/new-location';


@Component({
  selector: 'pvf-manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.scss'],
})
export class ManageLocationsComponent implements OnInit {

  public locations: NewLocation[];

  constructor(private newLocationService: NewLocationService) {}

  ngOnInit() {
    this.getLocations();
  }

  getLocations() {
    this.newLocationService.getLocations().subscribe((data: NewLocation[]) => {
      console.log(data);
      this.locations = data;
    });
  }

}