import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pxs-threshold-templates-detail',
  templateUrl: './threshold-templates-detail.component.html',
  styleUrls: ['./threshold-templates-detail.component.scss']
})
export class ThresholdTemplatesDetailComponent implements OnInit {

  public thresholdTemplate: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.thresholdTemplate) {
        this.thresholdTemplate = this.data.thresholdTemplate;
      }
    }
  }

}
