import {Component, OnInit} from '@angular/core';
import {ThingService} from '../../../../services/thing.service';
import {Thing} from '../../../../models/thing.model';
import {SharedService} from '../../../../services/shared.service';

@Component({
  selector: 'pvf-manage-things',
  templateUrl: './manage-things.component.html',
  styleUrls: ['./manage-things.component.scss']
})
export class ManageThingsComponent implements OnInit {
  public things: Thing[] = [];
  public activeInput: number = null;
  public filter = {
    devEui: ''
  };

  public thingsLoading = false;

  constructor(private thingService: ThingService, private sharedService: SharedService) {
  }

  public ngOnInit() {
    this.getThings();
  }

  public async getThings(): Promise<void> {
    this.thingsLoading = true;
    this.things = await this.thingService.getByFilter(this.filter);
    this.thingsLoading = false;
  }

  public editThingName(index: number): void {
    this.activeInput = index;
  }

  public async cancelEdit(): Promise<void> {
    await this.getThings();
    this.activeInput = null;
  }

  public async saveThing(thing: Thing): Promise<void> {
    try {
      await this.thingService.updateName(thing);
      this.getThings();
      this.sharedService.showNotification('Successfully saved thing name', 'success');
      this.activeInput = null;
    } catch (err) {
      this.sharedService.showNotification('Error saving thing name', 'error');
    }
  }
}
