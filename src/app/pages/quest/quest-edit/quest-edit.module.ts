import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestEditRoutingModule } from './quest-edit-routing.module';
import { QuestEditComponent } from './quest-edit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LetModule } from '@rx-angular/template';
import { QuillModule } from 'ngx-quill';

const lib=[
  NgSelectModule,NgxDropzoneModule,LetModule,QuillModule.forRoot(),
]
@NgModule({
  declarations: [QuestEditComponent],
  imports: [
    CommonModule,
    QuestEditRoutingModule,
    ...lib,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class QuestEditModule {}
