import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { NewAssetService } from './../../../../../../src/app/services/new-asset.service';
import { Component, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ILocation } from 'src/app/models/g-location.model';
import { IAlert } from 'src/app/models/g-alert.model';
import { IAsset } from 'src/app/models/g-asset.model';
import { Marker } from 'leaflet';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'pxs-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class MapPopupComponent implements OnInit, OnDestroy {
  @Input() asset: IAsset;
  @Input() assetUrl: string;
  @Input() location: ILocation;
  @Input() leafUrl: string;
  @Input() goToChild;

  @Input() marker: Marker;

  private mouseIsOver = false;
  public subs = new SubSink();

  public lastAlert: IAlert;
  public subject$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public assetService: NewAssetService,
    public router: Router,
    public elementRef: ElementRef
  ) {}

  ngOnInit() {
    const div = this.elementRef.nativeElement;

    div.onmouseover = () => {
      this.mouseIsOver = true;
      this.subject$.next();
    };
    div.onmouseout = () => {
      this.mouseIsOver = false;
      this.subject$.next();
    };

    if (this.asset) {
      this.getAssetPopupDetail();
    }

    if (this.marker) {
      this.marker.on('mouseout', () => {
        if (!this.mouseIsOver) {
          this.subject$.next();
        }
      });
      this.subs.add(
        this.closePopupOrNot(this.subject$).subscribe((result: boolean) => {
          if (result) {
            this.marker.closePopup();
          }
        })
      );
    }

  }

  getAssetPopupDetail() {
    this.subs.add(
      this.assetService.getAssetPopupDetail(this.asset.id).subscribe((asset: IAsset) => {
        this.asset = {
          ...this.asset,
          ...asset
        };
      })
    );
  }

  private closePopupOrNot(value: Observable <boolean>) {
    return value.pipe(
      debounceTime(500),
      switchMap(() => {
        if (this.mouseIsOver) {
          return of(false);
        } else {
          return of(true);
        }
      })
    );
  }



  ngOnDestroy() {
    this.subs.unsubscribe();
    const div = this.elementRef.nativeElement;
    div.onmouseover = null;
    div.onmouseout = null;
  }

  openLocation() {
    if (!(this.location.children || []).length && this.leafUrl) {
      this.router.navigateByUrl(`${this.leafUrl}${this.location.id}`);
    } else {
      this.goToChild(this.location);
    }
  }

}

