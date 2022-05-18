import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LocationListPageState, LOCATION_PAGE_STATE } from './location-list/states/locationListPageState.state';
import { RxState } from '@rx-angular/state';

const lib = [NgxDatatableModule];


@NgModule({
  declarations: [
    LocationComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
    ...lib
  ],
  providers:[{
    provide:LOCATION_PAGE_STATE,
    useFactory:()=>new RxState<LocationListPageState>()
  }]
})
export class LocationModule { }
