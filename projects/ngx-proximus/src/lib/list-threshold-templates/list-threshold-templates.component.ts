import { NewThresholdTemplateService } from './../../../../../src/app/services/new-threshold-templates';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IThresholdTemplate, IThresholdTemplatePaged } from 'src/app/models/g-threshold-template.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ThresholdTemplateService } from 'src/app/services/threshold-template.service';
import { ThresholdTemplatesDetailComponent } from '../threshold-templates-detail/threshold-templates-detail.component';
import { Subject } from 'rxjs';
import { isUndefined } from 'util';

@Component({
  selector: 'pxs-list-threshold-templates',
  templateUrl: './list-threshold-templates.component.html',
  styleUrls: ['./list-threshold-templates.component.scss']
})
export class ListThresholdTemplatesComponent implements OnInit {

  @Input() admin = false;
  @Input() selectedThresholdTemplate: IThresholdTemplate;

  @Output() selectChange: EventEmitter<IThresholdTemplate> = new EventEmitter<IThresholdTemplate>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public thresholdTemplates: IThresholdTemplate[];
  public filter: { name: string } = {name: ''};
  public page = 0;
  public totalItems = 0;
  public pagesize = 10;
  public pageSizeOptions = [5, 10, 25, 100, 500, 1000];
  public searchFilter$ = new Subject<any>();

  public isLoading = false;
  public dataSource: MatTableDataSource<IThresholdTemplate>;
  public displayedColumns: string[];

  constructor(
    public thresholdTemplateService: ThresholdTemplateService,
    public newThresholdTemplateService: NewThresholdTemplateService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
    ) {}

  async ngOnInit() {
    console.log('ngOnInit list threshold template');
    if (this.admin) {
      //this.displayedColumns = ['name', 'thresholds', 'lastModificationAuthor' , 'lastModificationDate', 'actions'];
      this.displayedColumns = ['name', 'thresholds', 'actions'];
    } else {
      //this.displayedColumns = ['name', 'thresholds', 'lastModificationAuthor' , 'lastModificationDate'];
      this.displayedColumns = ['name', 'thresholds'];
    }

    if (!isUndefined(this.selectedThresholdTemplate)) {
      this.displayedColumns.unshift('select');
    }

    await this.getThresholdTemplateByFilter();

    this.sort.sortChange.subscribe(() => {
      this.getThresholdTemplateByFilter();
    });

    //TODO: replace with the new back-end
    /*
    this.newThresholdTemplateService.searchThresholdTemplatesWithFilter(this.searchFilter$).subscribe(
      (pagedThresholdTemplate: IThresholdTemplatePaged) => {
        this.thresholdTemplates = pagedThresholdTemplate.thresholdTemplates;
        this.totalItems = pagedThresholdTemplate.totalElements;
        this.isLoading = false;
        this.updateDataSource();
      }
    );
    */
  }


  public onFilterChange() {
    this.searchFilter$.next({...this.filter});
  }

  public filterNameChange(evt) {
    this.getThresholdTemplateByFilter();
  }

  private async getThresholdTemplateByFilter() {
    this.isLoading = true;
    this.thresholdTemplates = [];
    this.thresholdTemplates = await this.newThresholdTemplateService.getThresholdTemplates().toPromise();
    this.totalItems = this.thresholdTemplates.length;
    this.isLoading = false;
    this.updateDataSource();
  }

  private updateDataSource() {
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

  public onSelectedThresholdTemplateChange(thresholdTemplate: IThresholdTemplate) {
    if (this.selectedThresholdTemplate && this.selectedThresholdTemplate.id === thresholdTemplate.id) {
      this.selectedThresholdTemplate = null;
    } else {
      this.selectedThresholdTemplate = thresholdTemplate;
    }
    this.selectChange.emit(this.selectedThresholdTemplate);
  }


  public async deleteThresholdTemplate(thresholdTemplateId: string) {
    this.newThresholdTemplateService.deleteThresholdTemplate(thresholdTemplateId).subscribe(
      (result) => {
        this.thresholdTemplates = null;
        this.changeDetectorRef.detectChanges();
        this.getThresholdTemplateByFilter();
      }
    );
  }

  public async openDetailDialog(thresholdTemplateId: string) {
    const thresholdTemplate = await this.newThresholdTemplateService.getThresholdTemplateById(thresholdTemplateId).toPromise();
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
