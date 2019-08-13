import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pxs-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.css']
})
export class ExpansionPanelComponent implements OnInit {
  
  static codeExample = `<pxs-expansion-panel (trigger)="onExpansionPanelTrigger()" [visible]="true">
  <pxs-expansion-panel-header [title]="'Example expansion panel'">
    <small>This is a subtitle (or any other content can be placed here)</small>
  </pxs-expansion-panel-header>
  <pxs-expansion-panel-content>
    <p>Content goes here</p>
  </pxs-expansion-panel-content>
</pxs-expansion-panel>`;

  @Input() visible = true;
  @Input() tooltip: {
    header: string;
  } = {header: null};
  @Output() trigger: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  triggerToggle() {
    this.visible = !this.visible;
    this.trigger.emit(this.visible);
  }

}
