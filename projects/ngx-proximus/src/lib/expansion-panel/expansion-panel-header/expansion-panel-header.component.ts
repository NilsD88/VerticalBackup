import {Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pxs-expansion-panel-header',
  templateUrl: './expansion-panel-header.component.html',
  styleUrls: ['./expansion-panel-header.component.css']
})
export class ExpansionPanelHeaderComponent implements OnInit {
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
