import { SubSink } from 'subsink';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { PointOfAttentionService } from 'src/app/services/point-of-attention.service';
import { IPointOfAttention } from 'src/app/models/point-of-attention.model';

@Component({
  selector: 'pxs-list-points-of-attention',
  templateUrl: './list-points-of-attention.component.html',
  styleUrls: ['./list-points-of-attention.component.scss']
})
export class ListPointsOfAttentionComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public pointsOfAttention: IPointOfAttention[] = [];
  public isLoading = false;

  public dataSource: MatTableDataSource<IPointOfAttention>;
  public displayedColumns: string[] = ['name', 'location', 'actions'];

  private subs = new SubSink();

  constructor(
    private pointOfAttentionService: PointOfAttentionService
  ) { }

  public async ngOnInit() {
    this.getPointsOfAttention();
  }


  private async getPointsOfAttention() {
    this.isLoading = true;
    this.pointsOfAttention = await this.pointOfAttentionService.getPointsOfAttention().toPromise();
    this.isLoading = false;
    this.updateDataSourceWithAssets(this.pointsOfAttention);
  }

  public deletePointOfAttention(id: string) {
    this.subs.add(
      this.pointOfAttentionService.deletePointOfAttention(id).subscribe(
        (result) => {
          this.getPointsOfAttention();
        }
      )
    );
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
