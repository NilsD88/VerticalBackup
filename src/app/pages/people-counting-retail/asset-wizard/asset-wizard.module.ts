import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetWizardComponent } from './asset-wizard.component';
import { RouterModule } from '@angular/router';
import {AssetWizardRoutes} from './asset-wizard.routing'



@NgModule({
  declarations: [AssetWizardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AssetWizardRoutes)
  ]
})
export class AssetWizardModule { }
