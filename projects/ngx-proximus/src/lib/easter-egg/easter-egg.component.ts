import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'pxs-easter-egg',
  templateUrl: './easter-egg.component.html',
  styleUrls: ['./easter-egg.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({
        transform: 'scale(1)'
      })),
      transition(':enter', [
        style({
          transform: 'scale(0)',
        }),
        animate('0.5s 1s ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({
          transform: 'scale(0)',
        }))
      ])
    ])
  ]
})
export class EasterEggComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
