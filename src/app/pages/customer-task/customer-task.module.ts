import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTaskRoutingModule } from './customer-task-routing.module';
import { CustomerTaskComponent } from './customer-task.component';
import { CustomerTaskListComponent } from './customer-task-list/customer-task-list.component';


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
