import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pxs-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() label: string;
  @Input() badge: { label: string; class: string };
  @Input() id: any;
  @Input() url: string;
  @Input("mat-menu-trigger-for") matMenuTriggerFor:string;

  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor(public router: Router) {
  }

  ngOnInit() {
  }

  menuItemClicked() {
    this.action.emit(this.id);
  }

}
