import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDetailRoutingModule } from './customer-detail-routing.module';
import { CustomerDetailComponent } from './customer-detail.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    CustomerDetailComponent
  ],
  imports: [
    CommonModule,
    CustomerDetailRoutingModule,
    TooltipModule.forRoot(),
  ]
})
export class CustomerDetailModule { }
