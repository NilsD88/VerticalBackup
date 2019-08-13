import {Component, Input, OnInit} from '@angular/core';
import { IAsset } from 'src/app/models/asset.model';

@Component({
  selector: 'pxs-map-asset-popup',
  templateUrl: './map-asset-popup.component.html',
  styleUrls: ['./map-asset-popup.component.scss']
})
export class MapAssetPopupComponent implements OnInit {
  
  @Input() asset:IAsset;
  ngOnInit() {}
}

