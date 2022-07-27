import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardListRoutingModule } from './reward-list-routing.module';
import { RewardListComponent } from './reward-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
const lib = [
  NgSelectModule,
  NgxDatatableModule,
  TooltipModule.forRoot(),
  ReactiveFormsModule,
  FormsModule,
];

@NgModule({
  declarations: [RewardListComponent],
  imports: [CommonModule, RewardListRoutingModule,...lib],
})
export class RewardListModule {}
