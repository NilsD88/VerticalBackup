import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pxs-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() label: string;
  @Input() badge: { label: string; class: string };
  @Input() id: any;
  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  menuItemClicked() {
    this.action.emit(this.id);
  }

}
