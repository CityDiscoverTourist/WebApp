import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LocationState, LOCATION_STATE } from './states/location.state';
import { RxState } from '@rx-angular/state';
import { AreaState, AREA_STATE } from '../area/states/area.state';

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
    provide:LOCATION_STATE,
    useFactory:()=>new RxState<LocationState>()
  },
  {
    provide:AREA_STATE,
    useFactory:()=>new RxState<AreaState>()
  }
]
})
export class LocationModule { }
