import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestItemCreateRoutingModule } from './quest-item-create-routing.module';
import { QuestItemCreateComponent } from './quest-item-create.component';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { LetModule } from '@rx-angular/template';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ModalModule } from 'ngx-bootstrap/modal';

const lib = [
  QuillModule.forRoot(),
  NgxDropzoneModule,
  NgSelectModule,
  LetModule,
  FormsModule,
  ReactiveFormsModule,
  HotToastModule.forRoot(),
  ModalModule.forRoot()
];
@NgModule({
  declarations: [QuestItemCreateComponent],
  imports: [CommonModule, QuestItemCreateRoutingModule, ...lib],
})
export class QuestItemCreateModule {}
