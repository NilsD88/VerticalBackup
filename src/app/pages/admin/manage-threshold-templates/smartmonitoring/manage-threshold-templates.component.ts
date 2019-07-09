import {Component, OnInit} from '@angular/core';
import {ThresholdTemplate} from '../../../../models/threshold.model';
import {ThresholdTemplateService} from '../../../../services/threshold-template.service';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'pvf-manage-threshold-templates',
  templateUrl: './manage-threshold-templates.component.html',
  styleUrls: ['./manage-threshold-templates.component.scss']
})
export class ManageThresholdTemplatesComponent implements OnInit {
  public item: ThresholdTemplate;
  public id: string | number;

  constructor(private thresholdTemplateService: ThresholdTemplateService, private activeRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.id = await this.getRouteId();
    this.loadItem();
  }

  private async loadItem() {
    this.item = await this.thresholdTemplateService.getThresholdTemplate(this.id);
  }

  private getRouteId(): Promise<string | number> {
    return new Promise((resolve, reject) => {
      this.activeRoute.params.subscribe((params) => {
        if (!isNullOrUndefined(params.id)) {
          resolve(params.id);
        } else {
          reject('ManageThresholdTemplatesComponent: No \'id\' parameter in route.');
        }
      }, reject);
    });
  }
}


