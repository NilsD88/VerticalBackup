import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy.component';
import { RouterModule } from '@angular/router';
import { PrivacyRoutes } from './privacy.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PrivacyRoutes),
    TranslateModule,
  ]
})
export class PrivacyModule { }
