import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pxs-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {

  @Input() title = 'No data available';
  @Input() height: number;

  constructor() { }

  ngOnInit() {
  }

}
