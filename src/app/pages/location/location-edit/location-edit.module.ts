import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationEditRoutingModule } from './location-edit-routing.module';
import { LocationEditComponent } from './location-edit.component';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetModule } from '@rx-angular/template';
const lib = [
  QuillModule.forRoot(),
  NgSelectModule,
  FormsModule,
  ReactiveFormsModule,
  LetModule
];
@NgModule({
  declarations: [
    LocationEditComponent
  ],
  imports: [
    CommonModule,
    LocationEditRoutingModule,
    ...lib
  ]
})
export class LocationEditModule { }
