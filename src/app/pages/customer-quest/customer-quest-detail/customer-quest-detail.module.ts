import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerQuestDetailRoutingModule } from './customer-quest-detail-routing.module';
import { CustomerQuestDetailComponent } from './customer-quest-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
const lib = [
  NgxDatatableModule,
  NgSelectModule
];

@NgModule({
  declarations: [
    CustomerQuestDetailComponent
  ],
  imports: [
    CommonModule,
    CustomerQuestDetailRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ...lib
  ]
})
export class CustomerQuestDetailModule { }
