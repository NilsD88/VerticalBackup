import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ManageThingsComponent} from './manage-things.component';
import {ManageThingsRoutes} from './manage-things.routing';
import {FormsModule} from '@angular/forms';
import {ImgFallbackModule} from 'ngx-img-fallback';

@NgModule({
  declarations: [ManageThingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageThingsRoutes),
    FormsModule,
    ImgFallbackModule
  ]
})
export class ManageThingsModule {
}
