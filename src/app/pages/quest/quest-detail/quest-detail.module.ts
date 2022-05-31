import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestDetailRoutingModule } from './quest-detail-routing.module';
import { QuestDetailComponent } from './quest-detail.component';
import { ModalModule } from 'ngx-bootstrap/modal';

const lib=[
 ModalModule.forRoot()
]
@NgModule({
  declarations: [
    QuestDetailComponent
  ],
  imports: [
    CommonModule,
    QuestDetailRoutingModule,
    ...lib
  ]
})
export class QuestDetailModule { }
