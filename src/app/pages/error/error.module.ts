import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {ErrorRoutes} from './error.routing';
import { ErrorComponent } from './error.component';
import { ButtonModule } from 'projects/ngx-proximus/src/public-api';
import { AuthService } from 'src/app/services/auth.service';

@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ErrorRoutes),
    ButtonModule,
    TranslateModule
  ],
  providers: [
    AuthService
  ]
})
export class ErrorModule { }
