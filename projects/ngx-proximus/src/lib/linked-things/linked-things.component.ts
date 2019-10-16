import { Component, OnInit, Input } from '@angular/core';
import { IThing } from 'src/app/models/g-thing.model';

@Component({
  selector: 'pxs-linked-things',
  templateUrl: './linked-things.component.html',
  styleUrls: ['./linked-things.component.scss']
})
export class LinkedThingsComponent implements OnInit {

  @Input() things: IThing[] = [];

  constructor() { }

  ngOnInit() {
  }

}
