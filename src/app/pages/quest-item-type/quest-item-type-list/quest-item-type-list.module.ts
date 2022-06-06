import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestItemTypeListRoutingModule } from './quest-item-type-list-routing.module';
import { QuestItemTypeListComponent } from './quest-item-type-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotToastModule } from '@ngneat/hot-toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const lib = [
  NgxDatatableModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  FormsModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [QuestItemTypeListComponent],
  imports: [CommonModule, QuestItemTypeListRoutingModule, ...lib],
})
export class QuestItemTypeListModule {}
