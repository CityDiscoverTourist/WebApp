import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestDetailRoutingModule } from './quest-detail-routing.module';
import { QuestDetailComponent } from './quest-detail.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LetModule } from '@rx-angular/template';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuestItemState, QUEST_ITEM_STATE } from './quest-item/states';
import { RxState } from '@rx-angular/state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const lib=[
 ModalModule.forRoot(),LetModule,NgSelectModule, NgxDatatableModule,FormsModule,
 ReactiveFormsModule,
]
@NgModule({
  declarations: [
    QuestDetailComponent
  ],
  imports: [
    CommonModule,
    QuestDetailRoutingModule,
    ...lib,
    HotToastModule.forRoot(),
  ],
  providers:[{
    provide:QUEST_ITEM_STATE,
    useFactory:()=>new RxState<QuestItemState>()
  }]
})
export class QuestDetailModule { }
