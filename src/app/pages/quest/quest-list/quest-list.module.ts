import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestListRoutingModule } from './quest-list-routing.module';
import { QuestListComponent } from './quest-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const lib = [NgSelectModule, NgxDatatableModule];
@NgModule({
  declarations: [
    QuestListComponent
  ],
  imports: [
    CommonModule,
    QuestListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...lib,
  ],
})
export class QuestListModule { }
