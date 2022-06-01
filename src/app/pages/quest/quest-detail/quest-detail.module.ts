import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestDetailRoutingModule } from './quest-detail-routing.module';
import { QuestDetailComponent } from './quest-detail.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LetModule } from '@rx-angular/template';
import { HotToastModule } from '@ngneat/hot-toast';

const lib=[
 ModalModule.forRoot(),LetModule
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
  ]
})
export class QuestDetailModule { }
