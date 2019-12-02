import { ListPointOfAttentionItemsModule } from './../../../../../../projects/ngx-proximus/src/lib/list-point-of-attention-items/list-point-of-attention-items.module';
import { PointOfAttentionWizardRoutes } from './point-of-attention-wizard.routing';
import { MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfAttentionWizardComponent } from './point-of-attention-wizard.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { StepperNextModule } from 'projects/ngx-proximus/src/lib/stepper-next/stepper-next.module';
import { TranslateModule } from '@ngx-translate/core';
import { LocationWizardDialogComponent } from '../../manage-locations/location-wizard/locationWizardDialog.component';
import { LocationWizardDialogModule } from '../../manage-locations/location-wizard/locationWizardDialog.module';



@NgModule({
  declarations: [PointOfAttentionWizardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PointOfAttentionWizardRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    IconModule,
    LocationExplorerModule,
    StepperNextModule,
    TranslateModule,
    ListPointOfAttentionItemsModule,
    LocationWizardDialogModule,
  ],
  exports: [PointOfAttentionWizardComponent],
  entryComponents: [
    LocationWizardDialogComponent,
  ]
})
export class PointOfAttentionWizardModule { }
