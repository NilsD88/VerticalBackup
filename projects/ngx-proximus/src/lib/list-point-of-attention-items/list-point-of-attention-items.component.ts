import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { PointOfAttentionItemDialogComponent } from './point-of-attention-item-dialog/point-of-attention-item-dialog.component';
import { IAsset } from 'src/app/models/asset.model';
import { IPointOfAttentionItem, IPointOfAttention } from './../../../../../src/app/models/point-of-attention.model';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { PopupConfirmationComponent } from '../popup-confirmation/popup-confirmation.component';

@Component({
  selector: 'pxs-list-point-of-attention-items',
  templateUrl: './list-point-of-attention-items.component.html',
  styleUrls: ['./list-point-of-attention-items.component.scss']
})
export class ListPointOfAttentionItemsComponent implements OnInit {

  @Input() pointOfAttention: IPointOfAttention;
  @Output() pointOfAttentionChange: EventEmitter<IPointOfAttention> = new EventEmitter<IPointOfAttention>();

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public isLoading = false;
  public dataSource: MatTableDataSource<IPointOfAttentionItem>;
  public displayedColumns: string[] = ['sensorType', 'name', 'aggregation', 'assets', 'actions'];

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
  ) { }

  public ngOnInit() {
    this.isLoading = true;
    this.updateDataSourceWithItems(this.pointOfAttention.items);
    this.isLoading = false;
  }

  public getAssetNames(assets: IAsset[]) {
    return assets.map(asset => asset.name).join(', ');
  }

  private updateDataSourceWithItems(pointOfAttentionItems: IPointOfAttentionItem[]) {
    this.dataSource = new MatTableDataSource(pointOfAttentionItems);
    this.dataSource.sortingDataAccessor = (pointOfAttentionItem, property) => {
        if (property.includes('.')) {
          return property.split('.').reduce((object, key) => {
            if (object && object[key]) {
              return object[key];
            } else {
              return null;
            }
          }, pointOfAttentionItem);
        }
        return pointOfAttentionItem[property].toLocaleLowerCase();
    };
    this.dataSource.sort = this.sort;
  }

  public editItem(item: IPointOfAttentionItem) {
    this.dialog.open(PointOfAttentionItemDialogComponent, {
      minWidth: '320px',
      maxWidth: '400px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        item,
        location: this.pointOfAttention.location
      }
    }).afterClosed().subscribe((newItem: IPointOfAttentionItem) => {
      if (!isNullOrUndefined(newItem)) {
        let itemIndex = null;
        if (!isNullOrUndefined(newItem.id)) {
          itemIndex = this.pointOfAttention.items.findIndex(i => i.id === newItem.id);
        } else if (!isNullOrUndefined(newItem.tempId)) {
          itemIndex = this.pointOfAttention.items.findIndex(i => i.tempId === newItem.tempId);
        } else {
          return;
        }
        this.pointOfAttention.items[itemIndex] = newItem;
        this.updateDataSourceWithItems(this.pointOfAttention.items);
      }
    });
  }

  public newItem() {
    this.dialog.open(PointOfAttentionItemDialogComponent, {
      minWidth: '320px',
      maxWidth: '400px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        pointOfAttentionId: this.pointOfAttention.id,
        location: this.pointOfAttention.location
      }
    }).afterClosed().subscribe((newItem: IPointOfAttentionItem) => {
      if (!isNullOrUndefined(newItem)) {
        newItem.tempId = new Date().valueOf();
        this.pointOfAttention.items.push(newItem);
        this.updateDataSourceWithItems(this.pointOfAttention.items);
      }
    });
  }



  public deleteItem(item: IPointOfAttentionItem) {
    this.dialog.open(PopupConfirmationComponent, {
      data: {
        title: this.translateService.instant('GENERAL.WARNING'),
        content: this.translateService.instant('DIALOGS.DELETE.ARE_YOU_SURE_NO_MORE_ACCESSIBLE')
      },
      minWidth: '320px',
      maxWidth: '400px',
      width: '100vw',
      maxHeight: '80vh',
    }).afterClosed().subscribe(
      result => {
        if (result) {
          const itemIndex = this.pointOfAttention.items.findIndex(i => i.id === item.id);
          this.pointOfAttention.items.splice(itemIndex, 1);
          this.updateDataSourceWithItems(this.pointOfAttention.items);
        }
      }
    );
  }
}
