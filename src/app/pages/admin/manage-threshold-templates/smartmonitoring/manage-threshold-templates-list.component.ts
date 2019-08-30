import {Component, OnInit, ViewChild} from '@angular/core';
import {ThresholdTemplate} from '../../../../models/threshold.model';
import {ThresholdTemplateService} from '../../../../services/threshold-template.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'pvf-manage-threshold-templates-list',
  templateUrl: './manage-threshold-templates-list.component.html',
  styleUrls: ['./manage-threshold-templates-list.component.scss']
})
export class ManageThresholdTemplatesListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public itemsLoading = false;
  public items: ThresholdTemplate[];
  public filter: { name: string } = {name: ''};
  public page = 0;
  public totalItems = 0;
  public pagesize = 10;
  public pageSizeOptions = [5, 10, 25, 100, 500, 1000];

  public isLoading = false;
  public dataSource: MatTableDataSource<ThresholdTemplate>;
  public displayedColumns: string[] = ['name', 'thresholds', 'actions'];

  constructor(public thresholdTemplateService: ThresholdTemplateService) {
  }

  async ngOnInit() {
    await this.getThresholdTemplateByFilter();

    this.sort.sortChange.subscribe(() => {
      this.getThresholdTemplateByFilter();
    });
  }

  public filterNameChange(evt) {
    this.getThresholdTemplateByFilter();
  }

  private async getThresholdTemplateByFilter() {
    this.isLoading = true;
    this.items = [];
    const pagedThresholdTemplate = await this.thresholdTemplateService.getPagedThresholdTemplates(this.filter, this.page, this.pagesize);
    this.items = pagedThresholdTemplate.data;
    this.totalItems = pagedThresholdTemplate.totalElements;
    this.isLoading = false;

    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (thresholdTemplate, property) => {
        if (property.includes('.')) {
          return property.split('.')
            .reduce((object, key) => object[key], thresholdTemplate);
        }
        return thresholdTemplate[property].toLocaleLowerCase();
    };
    this.dataSource.sort = this.sort;
  }

  public async pageChanged(evt) {
    this.page = evt.pageIndex;
    this.pagesize = evt.pageSize;
    await this.getThresholdTemplateByFilter();
  }


  public async deleteItem(item: ThresholdTemplate) {
    this.itemsLoading = true;
    await this.thresholdTemplateService.deleteThresholdTemplate(item.id);
  }

}
