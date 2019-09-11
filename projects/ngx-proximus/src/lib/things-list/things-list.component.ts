import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {IThing, Thing} from '../../../../../src/app/models/thing.model';

interface IItem extends IThing {
  selected: boolean;
}

@Component({
  selector: 'pxs-things-list',
  templateUrl: './things-list.component.html',
  styleUrls: ['./things-list.component.css']
})
export class ThingsListComponent implements OnInit, OnChanges {
  @Input() things: Thing[] = [];
  @Input() list: Thing[] = [];
  @Input() editable: boolean;

  @Output() change: EventEmitter<IThing[]> = new EventEmitter();

  public itemList: IItem[];

  constructor() {
  }

  ngOnInit() {
    this.setItemList();
  }

  ngOnChanges() {
  }

  private setItemList() {
    this.itemList = [];
    this.list.forEach((item) => {
      const result: IItem = {...item, selected: false};
      if (this.things.find(i => i.id === item.id)) {
        result.selected = true;
      }
      this.itemList.push(result);
    });
  }

  public itemSelectChanged(item, evt) {

    this.itemList[this.itemList.findIndex(i => i.id === item.id)].selected = evt.checked;
    this.change.emit(this.itemList.filter(i => i.selected).map((i) => {
      delete i.selected;
      return (i as IThing);
    }));
  }

}
