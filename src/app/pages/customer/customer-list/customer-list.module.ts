import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerListRoutingModule } from './customer-list-routing.module';
import { CustomerListComponent } from './customer-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

const lib = [NgxDatatableModule, NgSelectModule,ModalModule.forRoot(),];

@NgModule({
  declarations: [CustomerListComponent],
  imports: [
    CommonModule,
    CustomerListRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ...lib,
  ],
})
export class CustomerListModule {}
