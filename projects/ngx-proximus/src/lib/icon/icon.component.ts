import {Component, Input, OnInit} from '@angular/core';

export type IPxsIcon = 'device-tablet' |
  'device-phone-at' |
  'device-smart-phone' |
  'phone-out' |
  'device-tablet-at' |
  'device-cellphone' |
  'device-desktop-at' |
  'devices-mobile' |
  'device-camera' |
  'device-smart-phone-at' |
  'device-fax' |
  'device-desktop-cloud' |
  'phone-in' |
  'device-vibrate' |
  'device-phone-horns' |
  'tv' |
  'device-desktop' |
  'device-smart-phone-sound' |
  'device-tablet-3g' |
  'device-mobile-4g' |
  'device-phone-sound' |
  'device-smart-phone-signal' |
  'device-cellphone-zoomed' |
  'device-phone-settings' |
  'device-cellphone-bubbles' |
  'device-smart-phone-music' |
  'device-mobile-logo' |
  'remote' |
  'communication' |
  'message-minus' |
  'message-arrows' |
  'message-important' |
  'message-question' |
  'message-sms' |
  'message-mms' |
  'cog' |
  'edit' |
  'wrench' |
  'trash' |
  'refresh' |
  'refresh-price' |
  'phone' |
  'clock' |
  'warning' |
  'view-360' |
  'video' |
  'pie-chart' |
  'arrows-double' |
  'price-euro' |
  'employee' |
  'timer' |
  'line-chart' |
  'eye' |
  'cart-lock' |
  'search' |
  'home-check' |
  'box' |
  'list' |
  'apps' |
  'mail' |
  'star-o' |
  'music' |
  'box-wings' |
  'document' |
  'box-pencil' |
  'cart-empty' |
  'home-unlock' |
  'timer-1600-min' |
  'timer-800-min' |
  'timer-400-min' |
  'timer-240-min' |
  'timer-120-min' |
  'timer-60-min' |
  'timer-30-min' |
  'timer-15-min' |
  'talk' |
  'factory' |
  'zoom-in' |
  'lock-locked' |
  'globe' |
  'building' |
  'text' |
  'home-o' |
  'accessibility' |
  'present' |
  'gaming' |
  'free-shipping' |
  'truck-moon' |
  'hide' |
  'facebook' |
  'umbrella' |
  'truck' |
  'mute' |
  'archive' |
  'trophee' |
  'book' |
  'support' |
  'cloud' |
  'heartbeat' |
  'camera-old' |
  'globe-signal' |
  'calendar-14' |
  'calendar-7' |
  'elder' |
  'euro' |
  'badge-14' |
  'badge' |
  'chevron-up' |
  'chevron-left' |
  'chevron-down' |
  'chevron-right' |
  'calendar-date' |
  'browser' |
  'piggy-euro' |
  'check-o' |
  'user' |
  'map-marker' |
  'sim' |
  'map-hotspot' |
  'arrow-up-o' |
  'double-slash' |
  'credit-card' |
  'shield' |
  'youtube' |
  'twitter' |
  'close-o' |
  'country-check' |
  'lock-unlocked' |
  'wifi' |
  'download' |
  'more-circle' |
  'stop' |
  'warn' |
  'check' |
  'bulb' |
  'birthday' |
  'open' |
  'thumb-up' |
  'close' |
  'infinite' |
  'alarm' |
  'device-phone-horn' |
  'map-arrows' |
  'menu' |
  'logo' |
  'network' |
  'home-signal' |
  'euro-o' |
  'battery' |
  'government' |
  'bluetooth' |
  'book-o' |
  'bar' |
  'windmill' |
  'keynote' |
  'camera' |
  'guitar' |
  'microphone' |
  'calendar-24-7' |
  'plane' |
  'car' |
  'hourglass' |
  'users' |
  'walk' |
  'train' |
  'heart' |
  'organisation' |
  'heart-o' |
  'idea' |
  'gauge' |
  'touch' |
  'building-circle' |
  'document-img' |
  'arrow-up' |
  'plus-o' |
  'document-arrow-left' |
  'remove-o' |
  'clipboard' |
  'operating-system' |
  'chip' |
  'upload' |
  'cable' |
  'satelite-signal' |
  'box-devices' |
  'router-signal' |
  'image' |
  'minus' |
  'plus' |
  'danger' |
  'radio' |
  'power-button' |
  'directory' |
  'archives' |
  'down-speed' |
  'up-speed' |
  'bill' |
  'params' |
  'params-remove' |
  'zoom-out' |
  'email' |
  'pin' |
  'edit-document' |
  'home-price' |
  'cog-play' |
  'users-arrow' |
  'cookie' |
  'drawer' |
  'tractor' |
  'sort-numeric-asc' |
  'sort-numeric-desc' |
  'sort-alpha-asc' |
  'unlink' |
  'link' |
  'quote' |
  'calendar-o' |
  'connections' |
  'more';


@Component({
  selector: 'pxs-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit {
  static pxsIconExample = '<pxs-icon icon="wifi"></pxs-icon>';
  static iconValues: IPxsIcon[] = [
    'device-tablet',
    'device-phone-at',
    'device-smart-phone',
    'phone-out',
    'device-tablet-at',
    'device-cellphone',
    'device-desktop-at',
    'devices-mobile',
    'device-camera',
    'device-smart-phone-at',
    'device-fax',
    'device-desktop-cloud',
    'phone-in',
    'device-vibrate',
    'device-phone-horns',
    'tv',
    'device-desktop',
    'device-smart-phone-sound',
    'device-tablet-3g',
    'device-mobile-4g',
    'device-phone-sound',
    'device-smart-phone-signal',
    'device-cellphone-zoomed',
    'device-phone-settings',
    'device-cellphone-bubbles',
    'device-smart-phone-music',
    'device-mobile-logo',
    'remote',
    'communication',
    'message-minus',
    'message-arrows',
    'message-important',
    'message-question',
    'message-sms',
    'message-mms',
    'cog',
    'edit',
    'wrench',
    'trash',
    'refresh',
    'refresh-price',
    'phone',
    'clock',
    'warning',
    'view-360',
    'video',
    'pie-chart',
    'arrows-double',
    'price-euro',
    'employee',
    'timer',
    'line-chart',
    'eye',
    'cart-lock',
    'search',
    'home-check',
    'box',
    'list',
    'apps',
    'mail',
    'star-o',
    'music',
    'box-wings',
    'document',
    'box-pencil',
    'cart-empty',
    'home-unlock',
    'timer-1600-min',
    'timer-800-min',
    'timer-400-min',
    'timer-240-min',
    'timer-120-min',
    'timer-60-min',
    'timer-30-min',
    'timer-15-min',
    'talk',
    'factory',
    'zoom-in',
    'lock-locked',
    'globe',
    'building',
    'text',
    'home-o',
    'accessibility',
    'present',
    'gaming',
    'free-shipping',
    'truck-moon',
    'hide',
    'facebook',
    'umbrella',
    'truck',
    'mute',
    'archive',
    'trophee',
    'book',
    'support',
    'cloud',
    'heartbeat',
    'camera-old',
    'globe-signal',
    'calendar-14',
    'calendar-7',
    'elder',
    'euro',
    'badge-14',
    'badge',
    'chevron-up',
    'chevron-left',
    'chevron-down',
    'chevron-right',
    'calendar-date',
    'browser',
    'piggy-euro',
    'check-o',
    'user',
    'map-marker',
    'sim',
    'map-hotspot',
    'arrow-up-o',
    'double-slash',
    'credit-card',
    'shield',
    'youtube',
    'twitter',
    'close-o',
    'country-check',
    'lock-unlocked',
    'wifi',
    'download',
    'more-circle',
    'stop',
    'warn',
    'check',
    'bulb',
    'birthday',
    'open',
    'thumb-up',
    'close',
    'infinite',
    'alarm',
    'device-phone-horn',
    'map-arrows',
    'menu',
    'logo',
    'network',
    'home-signal',
    'euro-o',
    'battery',
    'government',
    'bluetooth',
    'book-o',
    'bar',
    'windmill',
    'keynote',
    'camera',
    'guitar',
    'microphone',
    'calendar-24-7',
    'plane',
    'car',
    'hourglass',
    'users',
    'walk',
    'train',
    'heart',
    'organisation',
    'heart-o',
    'idea',
    'gauge',
    'touch',
    'building-circle',
    'document-img',
    'arrow-up',
    'plus-o',
    'document-arrow-left',
    'remove-o',
    'clipboard',
    'operating-system',
    'chip',
    'upload',
    'cable',
    'satelite-signal',
    'box-devices',
    'router-signal',
    'image',
    'minus',
    'plus',
    'danger',
    'radio',
    'power-button',
    'directory',
    'archives',
    'down-speed',
    'up-speed',
    'bill',
    'params',
    'params-remove',
    'zoom-out',
    'email',
    'pin',
    'edit-document',
    'home-price',
    'cog-play',
    'users-arrow',
    'cookie',
    'drawer',
    'tractor',
    'sort-numeric-asc',
    'sort-numeric-desc',
    'sort-alpha-asc',
    'unlink',
    'link',
    'quote',
    'calendar-o',
    'connections',
    'more'
  ];
  @Input() icon: IPxsIcon;


  constructor() {
  }

  ngOnInit() {
  }

}
