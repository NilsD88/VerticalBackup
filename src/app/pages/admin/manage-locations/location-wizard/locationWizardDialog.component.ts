import {
  LocationWizardComponent
} from './location-wizard.component';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  Optional,
  OnDestroy
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  FormBuilder
} from '@angular/forms';
import {
  NewLocationService
} from 'src/app/services/new-location.service';
import { ILocation } from 'src/app/models/g-location.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'pvf-location-wizard-dialog',
  templateUrl: './location-wizard.component.html',
  styleUrls: ['./location-wizard.component.scss']
})

export class LocationWizardDialogComponent extends LocationWizardComponent implements OnInit, OnDestroy {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef < LocationWizardComponent > ,
    public formBuilder: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public newLocationService: NewLocationService,
    public dialog: MatDialog,
    public router: Router,
  ) {
    super(
      formBuilder,
      changeDetectorRef,
      activatedRoute,
      newLocationService,
      dialog,
      router
    );
    this.showCancel = false;
  }

  getParentId() {
    if (this.data) {
      if (this.data.parentLocation) {
        return this.data.parentLocation.id;
      }
    }
  }

   createLocation() {
    this.subs.add(
      this.newLocationService.createLocation(this.location).subscribe((location: ILocation | null) => {
        if (location) {
          this.dialogRef.close(location);
        }
      })
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
