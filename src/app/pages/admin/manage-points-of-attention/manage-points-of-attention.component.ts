import { IAsset } from 'src/app/models/g-asset.model';
import { IPointOfAttention } from './../../../models/point-of-attention.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { PointOfAttentionService } from 'src/app/services/point-of-attention.service';

@Component({
  selector: 'pvf-manage-points-of-attention',
  templateUrl: './manage-points-of-attention.component.html',
  styleUrls: ['./manage-points-of-attention.component.scss']
})
export class ManagePointsOfAttentionComponent implements OnInit {

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public pointsOfAttention: IPointOfAttention[] = [];
  public isLoading = false;

  public dataSource: MatTableDataSource<IPointOfAttention>;
  public displayedColumns: string[] = ['sensorType.name', 'name', 'assets', 'actions'];

  constructor(
    private pointOfAttentionService: PointOfAttentionService
  ) { }

  public async ngOnInit() {
    this.getPointsOfAttention();
  }

  public getAssetNames(assets: IAsset[]) {
    return assets.map(asset => asset.name).join(', ');
  }

  private async getPointsOfAttention() {
    this.isLoading = true;
    this.pointsOfAttention = await this.pointOfAttentionService.getPointsOfAttention().toPromise();
    this.isLoading = false;
    this.updateDataSourceWithAssets(this.pointsOfAttention);
  }

  private updateDataSourceWithAssets(pointOfAttentions: IPointOfAttention[]) {
    this.dataSource = new MatTableDataSource(pointOfAttentions);
    this.dataSource.sortingDataAccessor = (pointOfAttention, property) => {
        if (property.includes('.')) {
          return property.split('.').reduce((object, key) => {
            if (object && object[key]) {
              return object[key];
            } else {
              return null;
            }
          }, pointOfAttention);
        }
        return pointOfAttention[property].toLocaleLowerCase();
    };
    this.dataSource.sort = this.sort;
  }

}
