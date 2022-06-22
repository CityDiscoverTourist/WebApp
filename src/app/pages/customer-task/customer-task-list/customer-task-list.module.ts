import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTaskListRoutingModule } from './customer-task-list-routing.module';
import { CustomerTaskListComponent } from './customer-task-list.component';


@NgModule({
  declarations: [
    CustomerTaskListComponent
  ],
  imports: [
    CommonModule,
    CustomerTaskListRoutingModule
  ]
})
export class CustomerTaskListModule { }
