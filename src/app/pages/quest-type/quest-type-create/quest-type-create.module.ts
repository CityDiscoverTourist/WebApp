import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestTypeCreateRoutingModule } from './quest-type-create-routing.module';
import { QuestTypeCreateComponent } from './quest-type-create.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { LetModule } from '@rx-angular/template';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HotToastModule } from '@ngneat/hot-toast';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

const lib = [NgSelectModule, QuillModule, LetModule, NgxDropzoneModule];
@NgModule({
  declarations: [QuestTypeCreateComponent],
  imports: [
    CommonModule,
    QuestTypeCreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HotToastModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ...lib,
  ],
})
export class QuestTypeCreateModule {}
