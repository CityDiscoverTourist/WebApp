import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerQuestDetailRoutingModule } from './customer-quest-detail-routing.module';
import { CustomerQuestDetailComponent } from './customer-quest-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { QuestionModalComponent } from './question-modal/question-modal.component';
const lib = [
  NgxDatatableModule,
  NgSelectModule,
  TooltipModule.forRoot(),
];

@NgModule({
  declarations: [
    CustomerQuestDetailComponent,
    QuestionModalComponent
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
