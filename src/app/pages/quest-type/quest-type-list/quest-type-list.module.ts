import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestTypeListRoutingModule } from './quest-type-list-routing.module';
import { QuestTypeListComponent } from './quest-type-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HotToastModule } from '@ngneat/hot-toast';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';

const lib = [
  NgxDatatableModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  NgSelectModule,
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
