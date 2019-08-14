import {Component, EventEmitter, OnInit, Output, Input, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {NgxDrpOptions, PresetItem} from 'ngx-mat-daterange-picker';

@Component({
  selector: 'pxs-date-range-selection',
  templateUrl: './date-range-selection.component.html',
  styleUrls: ['./date-range-selection.component.scss']
})
export class DateRangeSelectionComponent implements OnInit {
  @ViewChild('dateRangePicker') dateRangePicker;

  @Input() drpOptions: NgxDrpOptions;

  @Output() dateChange: EventEmitter<{fromDate: Date, toDate: Date}> = new EventEmitter();

  public drpPresets: Array<PresetItem> = [];

  constructor() {
  }

  ngOnInit() {
    this.setupPresets();
    this.initDateFilterOptions();
  }


  setupPresets() {
    const backDate = (numOfDays) => {
      const tday = new Date();
      return new Date(tday.setDate(tday.getDate() - numOfDays));
    };

    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7);
    const minus30 = backDate(30);

    this.drpPresets = [
      {presetLabel: 'Last 24 hours', range: {fromDate: moment().subtract(1, 'day').toDate(), toDate: moment().toDate()}},
      {presetLabel: 'Last 7 Days', range: {fromDate: minus7, toDate: today}},
      {presetLabel: 'Last 30 Days', range: {fromDate: minus30, toDate: today}}
    ];
  }

  public initDateFilterOptions() {
    const today = new Date();
    // const fromMin = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const fromMax = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const toMin = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const toMax = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    this.setupPresets();
    this.drpOptions = this.drpOptions || {
      presets: this.drpPresets,
      format: 'mediumDate',
      range: {fromDate: new Date(moment(today).startOf('day').valueOf()), toDate: new Date(moment(today).endOf('day').valueOf())},
      applyLabel: 'Submit',
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: true
      },
      cancelLabel: 'Cancel',
      excludeWeekends: false,
      fromMinMax: {fromDate: null, toDate: fromMax},
      toMinMax: {fromDate: null, toDate: toMax}
    };
  }

  swapPeriod(direction: boolean) {
    const {_fromDate, _toDate } = this.dateRangePicker.rangeStoreService;
    const duration = moment.duration(moment(_toDate).diff(_fromDate));
    if (direction){
      this.dateRangePicker.resetDates({
        fromDate: new Date (moment(_fromDate).add(duration).valueOf()),
        toDate: new Date(moment(_toDate).add(duration).valueOf()),
      });
    } else {
      this.dateRangePicker.resetDates({
        fromDate: new Date (moment(_fromDate).subtract(duration).valueOf()),
        toDate: new Date(moment(_toDate).subtract(duration).valueOf()),
      });
    }
  }

  updateDrp(dateRange: {fromDate: Date, toDate: Date}) {
    this.dateChange.emit(dateRange);
  }
}
