import { cloneDeep } from 'lodash';
import { PointOfAttentionService } from './../../../../services/point-of-attention.service';
import { IPointOfAttention } from './../../../../models/point-of-attention.model';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IFilterChartData, Intervals } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/services/shared.service';
import { LogsService } from 'src/app/services/logs.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import * as jspdf from 'jspdf';
import { formatDate } from '@angular/common';
const canvg = require('canvg');

@Component({
  selector: 'pvf-point-of-attention',
  templateUrl: './point-of-attention.component.html',
  styleUrls: ['./point-of-attention.component.scss']
})
export class PointOfAttentionComponent implements OnInit {

  @ViewChild('myChart', {static: false}) myChart;

  public pointOfAttention: IPointOfAttention;
  public chartLoading = false;
  public chartData$ = new Subject<any>();
  public chartData = [];

  public currentFilter: IFilterChartData = {
    interval: 'HOURLY',
    from: moment().subtract(1, 'week').toDate().getTime(),
    to: moment().toDate().getTime(),
  };

  constructor(
    public activeRoute: ActivatedRoute,
    private translateService: TranslateService,
    private sharedService: SharedService,
    public pointOfAttentionService: PointOfAttentionService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(async (params) => {
      if (params.id) {
        this.pointOfAttentionService.getPointOfAttentionDetailById(params.id).subscribe(
          (pointOfAttention) => {
            this.pointOfAttention = pointOfAttention;
            this.changeDetectorRef.detectChanges();
            this.init();
          },
          (error) => {
            console.log(error);
            this.router.navigate(['/error/404']);
          }
        );
      }
    });
  }

  private init() {
    this.getChartData(this.chartData$).subscribe(
      async items => {
        const chartData = [];

        // Get the translation of each label
        for (const item of items) {
          let labelTranslation;
          labelTranslation = await this.translateService.get('SENSORTYPES.' + item.sensorType.name).toPromise();
          if (labelTranslation.indexOf('SENSORTYPES') > -1) {
            labelTranslation = this.upperCaseFirst(item.sensorType.name);
          }

          chartData.push({
            label: item.name,
            series: item.series,
          });
        }
        this.chartData = chartData;
        this.chartLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error => {
        this.chartData = [0];
        this.chartLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    );
    this.chartData$.next(this.currentFilter);
  }


  public updateChartData(options: { interval?: string; from?: number; to?: number; }) {
    const interval = options.interval ? options.interval as Intervals : this.currentFilter.interval as Intervals;
    const from = options.from ? options.from : this.currentFilter.from;
    const to = options.to ? options.to : this.currentFilter.to;
    const duration = moment.duration(moment(to).diff(from));
    const durationInHours = +duration.asHours().toFixed(0);
    const originalFilter = cloneDeep(this.currentFilter);

    this.currentFilter = {
      interval,
      from,
      to,
      durationInHours
    };

    const differences = compareTwoObjectOnSpecificProperties(
      originalFilter, this.currentFilter, ['interval', 'from', 'to', 'durationInHours']);

    if ((differences && differences.length > 0)) {
      this.chartData = [];
      this.chartData$.next(this.currentFilter);
    }
  }

  public async downloadPdfDetail() {
    const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF (210 x 297)
    pdf.setFontSize(10);
    console.log(pdf);

    function setStyle(styleName) {
      switch (styleName) {
        case 'title':
          pdf.setFontStyle('bold');
          pdf.setTextColor(92, 45, 145);
          break;
        default:
          pdf.setFontStyle('normal');
          pdf.setTextColor(0, 0, 0);
          break;
      }
    }

    const clientNameTranslation: string = await this.getTranslation('PDF.CLIENT_NAME');
    pdf.text(clientNameTranslation + ' : ' + this.sharedService.user.orgName, 45, 15);
    const pointOfAttentionNameTranslation: string = await this.getTranslation('PDF.POINT_OF_ATTENTION_NAME');
    pdf.text(pointOfAttentionNameTranslation + ' : ' + this.pointOfAttention.name, 45, 20);
    const locationNameTranslation: string = await this.getTranslation('PDF.LOCATION_NAME');
    pdf.text(locationNameTranslation + ' : ' + this.pointOfAttention.location.name, 45, 25);

    const options = this.myChart.options;
    if (options.series.length > 0) {
      setStyle('title');
      const chartTitle = await this.getTranslation('PDF.CHART');
      pdf.text(chartTitle, 10, 50);

      setStyle(null);
      const measurePeriodTranslation = await this.getTranslation('PDF.MEASURE_PERIOD');
      const toTranslation = await this.getTranslation('PDF.TO');

      const dateRange = this.myChart.range || {fromDate: new Date(this.currentFilter.from), toDate: new Date(this.currentFilter.to)};
      const timePeriod: string = measurePeriodTranslation + ' ' + formatDate(dateRange.fromDate, 'dd/MM/yyyy HH:mm', 'en-US')
        + ' ' + toTranslation + ' ' + formatDate(dateRange.toDate, 'dd/MM/yyyy HH:mm', 'en-US');
      pdf.text(timePeriod, 10, 55);

      let chart;
      for (const CHART of this.myChart.Highcharts.charts) {
        if (typeof CHART !== 'undefined') {
          chart = CHART;
        }
      }

      const svgString = chart.getSVG({
        chart: {
          width: 1400,
          height: 600,
        }
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 600;

      canvg(canvas, svgString);

      const canvasB64 = canvas.toDataURL();
      pdf.addImage(canvasB64, 'PNG', 5, 60, (1400 / 7), (600 / 7));
    }

    pdf.save(this.pointOfAttention.name + '.pdf');
  }


  private getChartData(request: Observable<any>) {
    return request.pipe(
      debounceTime(500),
      switchMap(filter => {
        this.chartLoading = true;
        this.changeDetectorRef.detectChanges();
        return this.pointOfAttentionService.getPointOfAttentionDataById(this.pointOfAttention.id, filter.interval, filter.from, filter.to);
      })
    );
  }

  private upperCaseFirst(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  private async getTranslation(label: string) {
    return await (this.translateService.get(label).toPromise());
  }

}
