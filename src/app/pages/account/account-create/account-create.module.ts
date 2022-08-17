import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountCreateRoutingModule } from './account-create-routing.module';
import { AccountCreateComponent } from './account-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AccountCreateComponent],
  imports: [CommonModule, AccountCreateRoutingModule,FormsModule, ReactiveFormsModule],
})
export class AccountCreateModule {}
