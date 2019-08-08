import {Component, OnInit} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { ILocation } from 'src/app/models/locations.model';
import {LocationsService} from '../../../services/locations.service';

interface LocationNode {
  name: string;
  children?: LocationNode[];
}

interface LocationFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'pvf-manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.scss'],
})
export class ManageLocationsComponent implements OnInit {

  public locations:any[];

  private _transformer = (node: LocationNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<LocationFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(public locationsService:LocationsService) {
    
  }

  hasChild = (_: number, node: LocationFlatNode) => node.expandable;


  ngOnInit() {
    this.getLocations();
  }

  async getLocations(){
    this.locations = await this.locationsService.getLocations();

    this.locations.forEach(location => {
      if(location.sublocations) {
        location.children = location.sublocations;
      }
    });

    console.log(this.locations);

    this.dataSource.data = this.locations;
  }

}