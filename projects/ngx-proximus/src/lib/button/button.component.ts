import {Component, Input, OnInit} from '@angular/core';

export type IPxsColors = 'primary' | 'inactive' | 'accent' | 'link' | 'promo' | 'error' | 'success' | 'warn' | 'default' | 'white' | 'sub';

@Component({
  selector: 'pxs-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  static codeExample = `<pxs-button color="primary" size="small">
  Icon button
  <pxs-icon [icon]="'chevron-right'"></pxs-icon>
</pxs-button>`;
  static colorOptions = ['primary', 'inactive', 'accent', 'link', 'promo', 'error', 'success', 'warn', 'default', 'white', 'sub'];

  @Input() color: IPxsColors = 'default';
  @Input() disabled = false;
  @Input() type: 'submit' | 'button' | 'reset' = 'button';
  @Input() name: string;
  @Input() form: string;
  @Input() formaction: string;
  @Input() formenctype: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
  @Input() formmethod: 'get' | 'post';
  @Input() formtarget: '_blank' | '_self' | '_parent' | '_top' | string;
  @Input() size: 'small' | 'large' = 'small';

  constructor() {
  }

  ngOnInit() {
  }

}
