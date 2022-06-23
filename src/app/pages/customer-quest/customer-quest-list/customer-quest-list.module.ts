import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerQuestListRoutingModule } from './customer-quest-list-routing.module';
import { CustomerQuestListComponent } from './customer-quest-list.component';


@NgModule({
  declarations: [
    CustomerQuestListComponent
  ],
  imports: [
    CommonModule,
    CustomerQuestListRoutingModule
  ]
})
export class CustomerQuestListModule { }
