import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationListRoutingModule } from './location-list-routing.module';
import { LocationListComponent } from './location-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { LocationState, LOCATION_STATE } from '../states/location.state';
import { RxState } from '@rx-angular/state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const lib = [NgSelectModule, NgxDatatableModule];

@NgModule({
  declarations: [LocationListComponent],
  imports: [
    CommonModule,
    LocationListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class LocationListModule {}
