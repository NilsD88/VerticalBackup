import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListThingsComponent } from './list-things.component';
import { IconModule } from '../../public-api';
import { MatProgressSpinnerModule, MatCardModule, MatTooltipModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, MatCheckboxModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { LoaderModule } from '../loader/loader.module';
import { NewThingsService } from 'src/app/services/new-things.service';

@NgModule({
  declarations: [ListThingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ImgFallbackModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule
  ],
  providers: [
    NewThingsService
  ],
  exports: [
    ListThingsComponent
  ]
})
export class ListThingsModule { }
