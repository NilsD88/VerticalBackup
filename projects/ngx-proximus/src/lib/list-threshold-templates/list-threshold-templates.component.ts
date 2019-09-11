import { NewThresholdTemplateService } from './../../../../../src/app/services/new-threshold-templates';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ThresholdTemplate, INewThresholdTemplate } from 'src/app/models/threshold.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ThresholdTemplateService } from 'src/app/services/threshold-template.service';
import { ThresholdTemplatesDetailComponent } from '../threshold-templates-detail/threshold-templates-detail.component';

@Component({
  selector: 'pxs-list-threshold-templates',
  templateUrl: './list-threshold-templates.component.html',
  styleUrls: ['./list-threshold-templates.component.scss']
})
export class ListThresholdTemplatesComponent implements OnInit {

  @Input() admin = false;
  @Input() selectedThresholdTemplate: INewThresholdTemplate;

  @Output() selectChange: EventEmitter<INewThresholdTemplate> = new EventEmitter<INewThresholdTemplate>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public thresholdTemplates: INewThresholdTemplate[];
  public filter: { name: string } = {name: ''};
  public page = 0;
  public totalItems = 0;
  public pagesize = 10;
  public pageSizeOptions = [5, 10, 25, 100, 500, 1000];

  public isLoading = false;
  public dataSource: MatTableDataSource<INewThresholdTemplate>;
  public displayedColumns: string[];

  constructor(
    public thresholdTemplateService: ThresholdTemplateService,
    public newThresholdTemplateService: NewThresholdTemplateService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
    ) {}

  async ngOnInit() {
    if (this.admin) {
      this.displayedColumns = ['name', 'thresholds', 'lastModificationAuthor' , 'lastModificationDate', 'actions'];
    } else {
      this.displayedColumns = ['select', 'name', 'thresholds', 'lastModificationAuthor' , 'lastModificationDate'];
    }

    if (this.selectedThresholdTemplate || this.selectedThresholdTemplate === null ) {
      this.displayedColumns.unshift('select');
    }

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
    this.thresholdTemplates = [];

    const pagedThresholdTemplate = await this.newThresholdTemplateService.getPagedThresholdTemplates();
    this.thresholdTemplates = pagedThresholdTemplate.data;
    this.totalItems = pagedThresholdTemplate.totalElements;
    this.isLoading = false;

    this.dataSource = new MatTableDataSource(this.thresholdTemplates);
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

  public onSelectedThresholdTemplateChange(thresholdTemplate: INewThresholdTemplate) {
    if (this.selectedThresholdTemplate && this.selectedThresholdTemplate.id === thresholdTemplate.id) {
      this.selectedThresholdTemplate = null;
    } else {
      this.selectedThresholdTemplate = thresholdTemplate;
    }
    this.selectChange.emit(this.selectedThresholdTemplate);
  }


  public async deleteThresholdTemplate(thresholdTemplateId: number) {
    this.newThresholdTemplateService.deleteThresholdTemplate(thresholdTemplateId).subscribe((result) => {
      this.thresholdTemplates = null;
      this.changeDetectorRef.detectChanges();
      this.ngOnInit();
    });
  }

  openDetailDialog(thresholdTemplate: INewThresholdTemplate): void {
    const dialogRef = this.dialog.open(ThresholdTemplatesDetailComponent, {
      minWidth: '320px',
      maxWidth: '600px',
      width: '100vw',
      data: {
        thresholdTemplate
      }
    });
  }

}
