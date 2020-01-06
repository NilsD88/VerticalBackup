import { SubSink } from 'subsink';
import { cloneDeep } from 'lodash';
import { NewThresholdTemplateService } from 'src/app/services/new-threshold-templates';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IThresholdTemplate } from 'src/app/models/g-threshold-template.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ThresholdTemplatesDetailComponent } from '../threshold-templates-detail/threshold-templates-detail.component';
import { isUndefined } from 'util';
import { findItemsWithTermOnKey } from 'src/app/shared/utils';

@Component({
  selector: 'pxs-list-threshold-templates',
  templateUrl: './list-threshold-templates.component.html',
  styleUrls: ['./list-threshold-templates.component.scss']
})
export class ListThresholdTemplatesComponent implements OnInit, OnDestroy {

  @Input() admin = false;
  @Input() selectedThresholdTemplate: IThresholdTemplate;

  @Output() selectChange: EventEmitter<IThresholdTemplate> = new EventEmitter<IThresholdTemplate>();

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public thresholdTemplates: IThresholdTemplate[];
  public filter: { name: string } = {name: ''};

  public isLoading = false;
  public dataSource: MatTableDataSource<IThresholdTemplate>;
  public displayedColumns: string[];

  private subs = new SubSink();

  constructor(
    public newThresholdTemplateService: NewThresholdTemplateService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
    ) {}

  async ngOnInit() {
    if (this.admin) {
      this.displayedColumns = ['name', 'thresholds', 'actions'];
    } else {
      this.displayedColumns = ['name', 'thresholds'];
    }
    if (!isUndefined(this.selectedThresholdTemplate)) {
      this.displayedColumns.unshift('select');
    }
    await this.getThresholdTemplates();
  }


  public filterByName() {
    const thresholdsFiltered = findItemsWithTermOnKey(this.filter.name, this.thresholdTemplates, 'name');
    this.updateDataSourceWithThresholdTemplates(thresholdsFiltered);
  }

  private async getThresholdTemplates() {
    this.isLoading = true;
    this.thresholdTemplates = await this.newThresholdTemplateService.getThresholdTemplates().toPromise();
    this.isLoading = false;
    this.updateDataSourceWithThresholdTemplates(this.thresholdTemplates);
  }

  private updateDataSourceWithThresholdTemplates(thresholdTemplates: IThresholdTemplate[]) {
    this.dataSource = new MatTableDataSource(thresholdTemplates);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (thresholdTemplate, property) => {
        if (property.includes('.')) {
          return property.split('.')
            .reduce((object, key) => {
              if (object && object[key]) {
                return object[key];
              } else {
                return null;
              }
            }, thresholdTemplate);
        }
        return thresholdTemplate[property].toLocaleLowerCase();
    };
    this.dataSource.sort = this.sort;
  }


  public onSelectedThresholdTemplateChange(thresholdTemplate: IThresholdTemplate) {
    if (this.selectedThresholdTemplate && this.selectedThresholdTemplate.id === thresholdTemplate.id) {
      this.selectedThresholdTemplate = null;
    } else {
      this.selectedThresholdTemplate = thresholdTemplate;
    }
    this.selectChange.emit(this.selectedThresholdTemplate);
  }


  public deleteThresholdTemplate(thresholdTemplateId: string) {
    this.subs.sink = this.newThresholdTemplateService.deleteThresholdTemplate(thresholdTemplateId).subscribe(
      () => {
        this.thresholdTemplates = null;
        this.changeDetectorRef.detectChanges();
        this.getThresholdTemplates();
      }
    );
  }

  public async openDetailDialog(thresholdTemplateId: string) {
    const thresholdTemplate = cloneDeep(await this.newThresholdTemplateService.getThresholdTemplateById(thresholdTemplateId).toPromise());
    this.dialog.open(ThresholdTemplatesDetailComponent, {
      minWidth: '320px',
      maxWidth: '600px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        thresholdTemplate
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
