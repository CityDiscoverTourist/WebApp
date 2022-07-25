import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestDetailRoutingModule } from './quest-detail-routing.module';
import { QuestDetailComponent } from './quest-detail.component';
import { LetModule } from '@rx-angular/template';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuestItemState, QUEST_ITEM_STATE } from './quest-item/states';
import { RxState } from '@rx-angular/state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { QuillModule } from 'ngx-quill';
import { DescriptionPipe } from './pipes/description.pipe';

const lib = [
  LetModule,
  NgSelectModule,
  NgxDatatableModule,
  HotToastModule.forRoot(),
  QuillModule.forRoot(),
];
@NgModule({
  declarations: [QuestDetailComponent, ImageModalComponent, DescriptionPipe,],
  imports: [
    CommonModule,
    QuestDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    ...lib,
  ],
  providers: [
    {
      provide: QUEST_ITEM_STATE,
      useFactory: () => new RxState<QuestItemState>(),
    },
  ],
})
export class QuestDetailModule {}
