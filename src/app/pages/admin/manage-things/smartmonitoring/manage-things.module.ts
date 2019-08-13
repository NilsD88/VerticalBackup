import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ManageThingsComponent} from './manage-things.component';
import {ManageThingsRoutes} from './manage-things.routing';
import {FormsModule} from '@angular/forms';
import {ImgFallbackModule} from 'ngx-img-fallback';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule} from '@angular/material';
import {LoaderModule} from '../../../../../../projects/ngx-proximus/src/lib/loader/loader.module';

@NgModule({
  declarations: [ManageThingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageThingsRoutes),
    FormsModule,
    ImgFallbackModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderModule,
    MatButtonModule
  ]
})
export class ManageThingsModule {
}
