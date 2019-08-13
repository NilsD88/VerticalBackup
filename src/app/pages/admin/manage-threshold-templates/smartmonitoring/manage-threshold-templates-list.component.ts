import {Component, OnInit} from '@angular/core';
import {ThresholdTemplate} from '../../../../models/threshold.model';
import {ThresholdTemplateService} from '../../../../services/threshold-template.service';

@Component({
  selector: 'pvf-manage-threshold-templates-list',
  templateUrl: './manage-threshold-templates-list.component.html',
  styleUrls: ['./manage-threshold-templates-list.component.scss']
})
export class ManageThresholdTemplatesListComponent implements OnInit {

  public itemsLoading = false;
  public items: ThresholdTemplate[];
  public filter: { name: string } = {name: ''};
  public page = 0;
  public totalItems = 0;
  public pagesize = 10;
  public pageSizeOptions = [5, 10, 25, 100, 500, 1000];

  constructor(public thresholdTemplateService: ThresholdTemplateService) {
  }

  public async loadItems() {
    this.itemsLoading = true;
    this.items = await this.thresholdTemplateService.getThresholdTemplates();
    this.itemsLoading = false;
  }

  ngOnInit() {
    this.loadItems();
  }

  public async deleteItem(item: ThresholdTemplate) {
    this.itemsLoading = true;
    await this.thresholdTemplateService.deleteThresholdTemplate(item.id);
    this.loadItems();
  }

}
