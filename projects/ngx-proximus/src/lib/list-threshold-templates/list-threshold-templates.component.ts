import { PopupConfirmationComponent } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';
import { SubSink } from 'subsink';
import { cloneDeep } from 'lodash';
import { ThresholdTemplateService } from 'src/app/services/threshold-templates';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IThresholdTemplate } from 'src/app/models/threshold-template.model';
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
    public thresholdTemplateService: ThresholdTemplateService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
    ) {}

  async ngOnInit() {
    this.displayedColumns = ['name', 'thresholds', 'actions'];
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
    this.thresholdTemplates = await this.thresholdTemplateService.getThresholdTemplates().toPromise();
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


  public wantToDeleteThresholdTemplate(thresholdTemplate: IThresholdTemplate) {
    if (thresholdTemplate.hasAssetsAttached) {
      this.dialog.open(PopupConfirmationComponent, {
        data: {
          title: `Warning`,
          content: 'Are you sure you want to delete? Assets are using this template'
        },
        minWidth: '320px',
        maxWidth: '400px',
        width: '100vw',
        maxHeight: '80vh',
      }).afterClosed().subscribe(
        result => {
          if (result) {
            this.deleteThresholdTemplate(thresholdTemplate.id);
          }
        }
      );
    } else {
      this.deleteThresholdTemplate(thresholdTemplate.id);
    }
  }

  private deleteThresholdTemplate(thresholdTemplateId: string) {
    this.subs.sink = this.thresholdTemplateService.deleteThresholdTemplate(thresholdTemplateId).subscribe(
      () => {
        this.thresholdTemplates = null;
        this.changeDetectorRef.detectChanges();
        this.getThresholdTemplates();
      }
    );
  }

  public async openDetailDialog(thresholdTemplateId: string) {
    const thresholdTemplate = cloneDeep(await this.thresholdTemplateService.getThresholdTemplateById(thresholdTemplateId).toPromise());
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
