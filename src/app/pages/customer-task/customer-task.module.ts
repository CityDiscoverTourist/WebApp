import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTaskRoutingModule } from './customer-task-routing.module';
import { CustomerTaskComponent } from './customer-task.component';


@NgModule({
  declarations: [
    CustomerTaskComponent,
  ],
  imports: [
    CommonModule,
    CustomerTaskRoutingModule
  ]
})
export class CustomerTaskModule { }
