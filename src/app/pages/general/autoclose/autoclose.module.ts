import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutocloseComponent} from './autoclose.component';
import {RouterModule} from '@angular/router';
import {AutocloseRoutes} from './autoclose.routing';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(AutocloseRoutes)
  ],
  declarations: [AutocloseComponent]
})
export class AutocloseModule {
}
