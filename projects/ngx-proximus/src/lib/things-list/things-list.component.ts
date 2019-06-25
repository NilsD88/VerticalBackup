import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Thing} from '../../../../../src/app/models/thing.model';

@Component({
  selector: 'pxs-things-list',
  templateUrl: './things-list.component.html',
  styleUrls: ['./things-list.component.css']
})
export class ThingsListComponent implements OnInit, OnChanges {
  @Input() things: Thing[] = [];
  @Input() list: Thing[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.list, this.things);
  }

}
