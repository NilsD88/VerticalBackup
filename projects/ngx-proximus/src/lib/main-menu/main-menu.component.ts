import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pxs-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  @Output() logoClick: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  logoClicked() {
    this.logoClick.emit();
  }
}
