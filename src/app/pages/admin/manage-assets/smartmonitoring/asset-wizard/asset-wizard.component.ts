import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IGeolocation } from 'src/app/models/asset.model';
import { INewLocation } from 'src/app/models/new-location';
import { IThing } from 'src/app/models/thing.model';
import { ThingService } from 'src/app/services/thing.service';


@Component({
  selector: 'pvf-asset-wizard',
  templateUrl: './asset-wizard.component.html',
  styleUrls: ['./asset-wizard.component.scss'],
})
export class AssetWizardComponent implements OnInit {


  things:IThing[];

  thingsFormGroup: FormGroup;
  descriptionFormGroup: FormGroup;
  selectedLocation: INewLocation;
  geolocation: IGeolocation;
  assetImage: string;


  public keyValues: {
    label: string;
    type: string;
  }[] = [
    {
      label: 'Country',
      type: 'string'
    },
    {
      label: 'Address',
      type: 'string'
    }
  ];

  constructor(private _formBuilder: FormBuilder,  private changeDetectorRef: ChangeDetectorRef, private thingService: ThingService ) {}

  ngOnInit() {
    this.getThingsList();
    this.descriptionFormGroup = this._formBuilder.group({
      NameCtrl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      DescriptionCtrl: ['', null],
      TypeCtrl: ['', null],
    });
    this.thingsFormGroup = this._formBuilder.group( {
        thingsCtrl: ['', Validators.required]
    });
    for (const kv of this.keyValues) {
      this.descriptionFormGroup.addControl(kv.label, new FormControl());
    }
  }

  updateLocation(location: INewLocation) {
    const oldSelectedLocation = this.selectedLocation;
    if (location && location !== oldSelectedLocation) {
      this.geolocation = null;
      this.selectedLocation = null;
      this.changeDetectorRef.detectChanges();
      this.selectedLocation = location;
    }
  }

  public getThingsList(): void {
    this.thingService.getAll()
    .then((result) => {
      this.things = result;
    });
  }


  submit() {
    console.log(this.descriptionFormGroup);
    console.log(this.geolocation);
  }
}