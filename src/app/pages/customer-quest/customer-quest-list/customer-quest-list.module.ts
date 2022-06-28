import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerQuestListComponent } from './customer-quest-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerQuestListRoutingModule } from './customer-quest-list-routing.module';

const lib = [NgxDatatableModule, NgSelectModule];

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
