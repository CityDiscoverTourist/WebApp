import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerQuestRoutingModule } from './customer-quest-routing.module';
import { CustomerQuestComponent } from './customer-quest.component';


@NgModule({
  declarations: [
    CustomerQuestComponent
  ],
  imports: [
    CommonModule,
    CustomerQuestRoutingModule
  ]
})
export class CustomerQuestModule { }
