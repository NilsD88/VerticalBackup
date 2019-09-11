import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pxs-threshold-templates-detail-item-boolean',
  templateUrl: './threshold-templates-detail-item-boolean.component.html',
  styleUrls: ['./threshold-templates-detail-item-boolean.component.scss']
})
export class ThresholdTemplatesDetailItemBooleanComponent implements OnInit {

  @Input() sensor: any;

  constructor() { }

  ngOnInit() {
  }

}
