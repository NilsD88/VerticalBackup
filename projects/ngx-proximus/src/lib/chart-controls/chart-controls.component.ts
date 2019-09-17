import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgxDrpOptions } from 'ngx-mat-daterange-picker';

interface IFilterChartData {
  interval?: string;
  from?: number;
  to?: number;
  durationInHours?: number;
}

@Component({
  selector: 'pxs-chart-controls',
  templateUrl: './chart-controls.component.html',
  styleUrls: ['./chart-controls.component.scss']
})
export class ChartControlsComponent implements OnInit {

  @Input() filter: IFilterChartData;
  @Input() chartDataIsLoading: boolean;
  @Input() chartDataLength: number;
  @Input() drpOptions: NgxDrpOptions;

  @Output() intervalChanged: EventEmitter<any> = new EventEmitter();
  @Output() dateRangeChanged: EventEmitter<any> = new EventEmitter();
  @Output() downloadPDF: EventEmitter<null> = new EventEmitter();
  @Output() downloadCSV: EventEmitter<null> = new EventEmitter();

  public intervals: string[] = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];


  constructor() { }

  ngOnInit() {
  }

}
