import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestCreateRoutingModule } from './quest-create-routing.module';
import { QuestCreateComponent } from './quest-create.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { LetModule } from '@rx-angular/template';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HotToastModule } from '@ngneat/hot-toast';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

const lib = [
  NgSelectModule,
  LetModule,
  NgxDropzoneModule,
  HotToastModule,
  ModalModule.forRoot(),
  TimepickerModule.forRoot()
];
@NgModule({
  declarations: [QuestCreateComponent],
  imports: [
    CommonModule,
    QuestCreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HotToastModule.forRoot(),
    BsDropdownModule.forRoot(),
    QuillModule.forRoot(),
    ...lib,
  ],
})
export class QuestCreateModule {}
