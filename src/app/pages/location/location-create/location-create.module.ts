import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationCreateRoutingModule } from './location-create-routing.module';
import { LocationCreateComponent } from './location-create.component';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const lib = [
  QuillModule.forRoot(),
  NgSelectModule,
  FormsModule,
  ReactiveFormsModule,
];
@NgModule({
  declarations: [LocationCreateComponent],
  imports: [CommonModule, LocationCreateRoutingModule, ...lib],
})
export class LocationCreateModule {}
