import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTaskListRoutingModule } from './customer-task-list-routing.module';
import { CustomerTaskListComponent } from './customer-task-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const lib = [
  NgxDatatableModule,
  HotToastModule.forRoot(),
  NgSelectModule
];

@NgModule({
  declarations: [
    CustomerTaskListComponent
  ],
  imports: [
    CommonModule,
    CustomerTaskListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib
  ]
})
export class CustomerTaskListModule { }
