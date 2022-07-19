import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentListRoutingModule } from './payment-list-routing.module';
import { PaymentListComponent } from './payment-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const lib = [NgxDatatableModule, NgSelectModule,ModalModule.forRoot(),];

@NgModule({
  declarations: [
    PaymentListComponent
  ],
  imports: [
    CommonModule,
    PaymentListRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ...lib
  ]
})
export class PaymentListModule { }
