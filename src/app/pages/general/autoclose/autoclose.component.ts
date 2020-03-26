import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-autoclose',
  templateUrl: './autoclose.component.html',
  styleUrls: ['./autoclose.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AutocloseComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    window.close();
  }

}
