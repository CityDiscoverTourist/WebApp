import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestItemTypeListRoutingModule } from './quest-item-type-list-routing.module';
import { QuestItemTypeListComponent } from './quest-item-type-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotToastModule } from '@ngneat/hot-toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
const lib = [
  NgxDatatableModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  NgSelectModule,
  TooltipModule.forRoot(),
];

@NgModule({
  declarations: [QuestItemTypeListComponent],
  imports: [
    CommonModule,
    QuestItemTypeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class QuestItemTypeListModule {}
