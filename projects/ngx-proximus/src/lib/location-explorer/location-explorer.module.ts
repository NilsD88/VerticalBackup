import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationExplorerComponent } from './location-explorer.component';
import { MatTabsModule, MatListModule, MatIconModule, MatTooltipModule, MatButtonModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { IconModule } from '../icon/icon.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LocationExplorerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatListModule,
    IconModule,
    DragDropModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    IconModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatAutocompleteModule
  ],
  providers: [
    NewAssetService,
    NewLocationService,
  ],
  exports: [
    LocationExplorerComponent
  ]
})
export class LocationExplorerModule { }
