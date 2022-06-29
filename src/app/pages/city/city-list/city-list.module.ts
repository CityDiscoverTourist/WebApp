import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityListRoutingModule } from './city-list-routing.module';
import { CityListComponent } from './city-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotToastModule } from '@ngneat/hot-toast';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

const lib = [
  NgSelectModule,
  NgxDatatableModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  TooltipModule.forRoot(),
];

@NgModule({
  declarations: [CityListComponent],
  imports: [
    CommonModule,
    CityListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class CityListModule {}
