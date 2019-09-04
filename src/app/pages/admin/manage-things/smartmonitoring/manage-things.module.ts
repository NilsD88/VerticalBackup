import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ManageThingsComponent} from './manage-things.component';
import {ManageThingsRoutes} from './manage-things.routing';
import {FormsModule} from '@angular/forms';
import {ImgFallbackModule} from 'ngx-img-fallback';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule, MatTableModule, MatSortModule, MatProgressSpinnerModule, MatCardModule} from '@angular/material';
import {LoaderModule} from '../../../../../../projects/ngx-proximus/src/lib/loader/loader.module';
import { NewThingsService } from 'src/app/services/new-things.service';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'projects/ngx-proximus/src/public-api';

@NgModule({
  declarations: [ManageThingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageThingsRoutes),
    TranslateModule,
    IconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    FormsModule,
    ImgFallbackModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [
    NewThingsService
  ]
})
export class ManageThingsModule {
}
