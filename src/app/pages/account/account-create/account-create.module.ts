import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountCreateRoutingModule } from './account-create-routing.module';
import { AccountCreateComponent } from './account-create.component';


@NgModule({
  declarations: [
    AccountCreateComponent
  ],
  imports: [
    CommonModule,
    AccountCreateRoutingModule
  ]
})
export class AccountCreateModule { }
