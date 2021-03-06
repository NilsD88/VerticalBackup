import { Component, OnInit, Optional, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IThresholdTemplate } from 'src/app/models/threshold-template.model';

@Component({
  selector: 'pxs-threshold-templates-detail',
  templateUrl: './threshold-templates-detail.component.html',
  styleUrls: ['./threshold-templates-detail.component.scss']
})
export class ThresholdTemplatesDetailComponent implements OnInit {

  @Input() thresholdTemplate: IThresholdTemplate;
  @Input() lastValues;
  @Input() withLink = false;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.thresholdTemplate) {
        this.thresholdTemplate = this.data.thresholdTemplate;
      }
    }
  }

}
