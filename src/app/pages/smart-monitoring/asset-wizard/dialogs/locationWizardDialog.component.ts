import {
  LocationWizardComponent
} from 'src/app/pages/admin/manage-locations/location-wizard/location-wizard.component';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  Optional
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
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


@Component({
  selector: 'pvf-location-wizard-dialog',
  templateUrl: '../../../admin/manage-locations/location-wizard/location-wizard.component.html',
  styleUrls: ['../../../admin/manage-locations/location-wizard/location-wizard.component.scss']
})

export class LocationWizardDialogComponent extends LocationWizardComponent implements OnInit {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef < LocationWizardComponent > ,
    public formBuilder: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public newLocationService: NewLocationService,
    public router: Router,
  ) {
    super(
      formBuilder,
      changeDetectorRef,
      activatedRoute,
      newLocationService,
      router
    );
  }

  getParentId() {
    if (this.data) {
      if (this.data.parentLocation) {
        return this.data.parentLocation.id;
      }
    }
  }

   createLocation() {
    this.newLocationService.createLocation(this.location).subscribe((location: ILocation | null) => {
      if (location) {
        this.dialogRef.close(location);
      }
    });
  }
}
