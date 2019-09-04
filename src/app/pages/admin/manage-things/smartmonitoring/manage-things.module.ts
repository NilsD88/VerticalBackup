import { ListThingsModule } from './../../../../../../projects/ngx-proximus/src/lib/list-things/list-things.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ManageThingsComponent} from './manage-things.component';
import {ManageThingsRoutes} from './manage-things.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ManageThingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageThingsRoutes),
    TranslateModule,
    ListThingsModule
  ]
})
export class ManageThingsModule {
}
