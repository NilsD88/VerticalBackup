import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pxs-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() loadingText: string;

  constructor() {
  }

  ngOnInit() {
  }

}
