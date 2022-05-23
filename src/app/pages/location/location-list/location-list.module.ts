import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationListRoutingModule } from './location-list-routing.module';
import { LocationListComponent } from './location-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { LocationListPageState, LOCATION_PAGE_STATE } from './states/locationListPage.state';
import { RxState } from '@rx-angular/state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const lib = [NgSelectModule, NgxDatatableModule];

@NgModule({
  declarations: [
    LocationListComponent
  ],
  imports: [
    CommonModule,
    LocationListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib
  ],
  // providers:[{
  //   provide:LOCATION_PAGE_STATE,
  //   useFactory:()=>new RxState<LocationListPageState>()
  // }]
})
export class LocationListModule { }
