import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pxs-data-error',
  templateUrl: './data-error.component.html',
  styleUrls: ['./data-error.component.scss']
})
export class DataErrorComponent implements OnInit {

  @Output() tryAgain: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
