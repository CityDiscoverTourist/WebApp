import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaEditRoutingModule } from './area-edit-routing.module';
import { AreaEditComponent } from './area-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill'
import { LetModule } from '@rx-angular/template';

const lib=[
  NgSelectModule,LetModule
]

@NgModule({
  declarations: [
    AreaEditComponent
  ],
  imports: [
    CommonModule,
    AreaEditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
    QuillModule.forRoot()
  ]
})
export class AreaEditModule { }
