import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { QuestTypeListRoutingModule } from './quest-type-list-routing.module';
import { QuestTypeListComponent } from './quest-type-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

const lib = [
  NgxDatatableModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  NgSelectModule,
  TooltipModule.forRoot(),
];

@NgModule({
  declarations: [QuestTypeListComponent],
  imports: [
    CommonModule,
    QuestTypeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class QuestTypeListModule {}
