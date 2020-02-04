import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAsset } from 'src/app/models/g-asset.model';

import { ILocation } from 'src/app/models/g-location.model';


@Component({
  selector: './pxs-asset-explorer',
  templateUrl: './asset-explorer.component.html',
  styleUrls: ['../location-explorer/location-explorer.component.scss']
})
export class AssetExplorerComponent implements OnInit {

  @Input() rootLocation: ILocation;
  @Input() selectedLocation: ILocation;
  @Input() customAssetService;
  @Input() searchBar = true;
  @Input() assetUrl = '/private/smartmonitoring/detail/';
  @Input() assetPicker = false;

  @Output() assetClicked: EventEmitter<IAsset> = new EventEmitter<IAsset>();
  @Output() changeLocation: EventEmitter<ILocation> = new EventEmitter<ILocation>();

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit()');
  }

}
