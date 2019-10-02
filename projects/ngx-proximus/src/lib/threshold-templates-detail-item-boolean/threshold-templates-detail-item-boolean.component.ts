import { Component, OnInit, Input } from '@angular/core';
import { IThreshold } from 'src/app/models/g-threshold.model';

@Component({
  selector: 'pxs-threshold-templates-detail-item-boolean',
  templateUrl: './threshold-templates-detail-item-boolean.component.html',
  styleUrls: ['./threshold-templates-detail-item-boolean.component.scss']
})
export class ThresholdTemplatesDetailItemBooleanComponent implements OnInit {

  @Input() threshold: IThreshold;

  constructor() { }

  ngOnInit() {
  }

}
