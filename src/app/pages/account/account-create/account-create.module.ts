import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountCreateRoutingModule } from './account-create-routing.module';
import { AccountCreateComponent } from './account-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



const lib = [
  NgSelectModule,
];
@NgModule({
  declarations: [AccountCreateComponent],
  imports: [CommonModule, AccountCreateRoutingModule,FormsModule, ReactiveFormsModule,...lib],
})
export class AccountCreateModule {}
