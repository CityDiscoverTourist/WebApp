import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestEditRoutingModule } from './quest-edit-routing.module';
import { QuestEditComponent } from './quest-edit.component';
import { QuillModule } from 'ngx-quill';
import { LetModule } from '@rx-angular/template';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HotToastModule } from '@ngneat/hot-toast';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';

const lib = [
  NgSelectModule,
  LetModule,
  NgxDropzoneModule,
  HotToastModule,
  ModalModule.forRoot(),
];

@NgModule({
  declarations: [QuestEditComponent],
  imports: [
    CommonModule,
    QuestEditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HotToastModule.forRoot(),
    QuillModule.forRoot(),
    ...lib,
  ],
})
export class QuestEditModule {}
