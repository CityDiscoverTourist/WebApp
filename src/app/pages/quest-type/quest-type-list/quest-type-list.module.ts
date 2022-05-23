import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestTypeListRoutingModule } from './quest-type-list-routing.module';
import { QuestTypeListComponent } from './quest-type-list.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const lib = [NgSelectModule, NgxDatatableModule];

@NgModule({
  declarations: [
    QuestTypeListComponent
  ],
  imports: [
    CommonModule,
    QuestTypeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...lib,
  ]
})
export class QuestTypeListModule { }
