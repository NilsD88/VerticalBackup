import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pxs-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {

  @Input() title = this.translateService.instant('GENERAL.NO_DATA_AVAILABLE');
  @Input() height: number;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {}

}
