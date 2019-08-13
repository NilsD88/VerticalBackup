import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pxs-product-link',
  templateUrl: './product-link.component.html',
  styleUrls: ['./product-link.component.css']
})
export class ProductLinkComponent implements OnInit {
  static codeExampleSmall = '<pxs-product-link label="Proximus product link to" href="" target=""></pxs-product-link>';
  static codeExampleLarge = '<pxs-product-link label="Proximus product link to" size="large" href="" target=""></pxs-product-link>';
  static codeExampleIcon = '<pxs-product-link label="Proximus product link to" size="small" icon="cog" href="" target=""></pxs-product-link>';

  @Input() label: string;
  @Input() href: string;
  @Input() size: 'small' | 'large' = 'small';
  @Input() icon:
    'wrench' | 'clock' | 'wifi' | 'globe-signal' | 'globe' | 'cellphone' | 'pc' | 'smart-phone' | 'tablet' |
    'logo' | 'chevron-left' | 'chevron-right' | 'chevron-down' | 'chevron-up' | 'plus' | 'minus' | 'pie-chart' |
    'line-chart' | 'cog' | 'cog-o' = 'chevron-right';
  @Input() target: '_blank' | '_self' | '_parent' | '_top' | string;

  constructor() {
  }

  ngOnInit() {
  }
}

