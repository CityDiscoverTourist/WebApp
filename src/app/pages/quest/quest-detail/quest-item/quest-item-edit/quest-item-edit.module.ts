import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestItemEditRoutingModule } from './quest-item-edit-routing.module';
import { QuestItemEditComponent } from './quest-item-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotToastModule } from '@ngneat/hot-toast';
import { QuillModule } from 'ngx-quill';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { LetModule } from '@rx-angular/template';
const lib = [
  QuillModule.forRoot(),
  NgxDropzoneModule,
  NgSelectModule,
  FormsModule,
  ReactiveFormsModule,
  HotToastModule.forRoot(),
  LetModule,
];

@NgModule({
  declarations: [
    QuestItemEditComponent
  ],
  imports: [
    CommonModule,
    QuestItemEditRoutingModule,
    ...lib
  ]
})
export class QuestItemEditModule { }
