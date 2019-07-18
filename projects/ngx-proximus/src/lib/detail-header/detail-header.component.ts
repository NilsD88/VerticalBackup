import {Component, Input, OnInit} from '@angular/core';
import {Asset} from '../../../../../src/app/models/asset.model';

@Component({
  selector: 'pxs-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss']
})
export class DetailHeaderComponent implements OnInit {

  @Input() asset: Asset;

  constructor() {
  }

  ngOnInit() {
  }

}
