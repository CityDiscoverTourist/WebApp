import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerQuestListComponent } from './customer-quest-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerQuestListRoutingModule } from './customer-quest-list-routing.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotToastModule } from '@ngneat/hot-toast';

const lib = [
  NgxDatatableModule,
  NgSelectModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  TooltipModule.forRoot(),
];

@NgModule({
  declarations: [CustomerQuestListComponent],
  imports: [
    CommonModule,
    CustomerQuestListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class CustomerQuestListModule {}
