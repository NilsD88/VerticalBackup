import {Component, OnInit} from '@angular/core';
import {ThingService} from '../../../../services/thing.service';
import {Thing} from '../../../../models/thing.model';

@Component({
  selector: 'pvf-manage-things',
  templateUrl: './manage-things.component.html',
  styleUrls: ['./manage-things.component.scss']
})
export class ManageThingsComponent implements OnInit {
  public things: Thing[] = [];

  constructor(private thingService: ThingService) {
  }

  ngOnInit() {
    this.getThings();
  }

  async getThings() {
    this.things = await this.thingService.getAll();
  }

}
