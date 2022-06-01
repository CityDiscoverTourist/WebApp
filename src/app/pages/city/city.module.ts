import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './city.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/services';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
const lib = [NgxDatatableModule];

@NgModule({
  declarations: [
    CityComponent
  ],
  imports: [
    CommonModule,
    CityRoutingModule,
    ...lib
  ],
  providers:[
    NotificationService,
    BsModalService]
})
export class CityModule { }
