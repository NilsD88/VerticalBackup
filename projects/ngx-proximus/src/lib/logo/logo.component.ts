import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pxs-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {

  @Input() size: 'small' | 'large' = 'large';
  @Input() color: 'default' | 'negative' = 'default';

  static codeExample = '<pxs-logo [size]="\'small\'" [color]="\'default\'"></pxs-logo>';

  constructor() {
  }

  ngOnInit() {
  }

}
