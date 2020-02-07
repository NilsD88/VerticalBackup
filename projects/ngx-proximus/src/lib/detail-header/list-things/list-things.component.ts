import { IThing } from './../../../../../../src/app/models/thing.model';
import { Component, OnInit, Input } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'pxs-detail-header-list-things',
  templateUrl: './list-things.component.html',
  styleUrls: ['./list-things.component.scss']
})
export class ListThingsComponent implements OnInit {

  @Input() things: IThing[];

  public isNullOrUndefined = isNullOrUndefined;

  constructor() { }

  ngOnInit() {}

  public parseLastValue(value: number): number {
    return parseFloat(value.toFixed(2));
  }

}
