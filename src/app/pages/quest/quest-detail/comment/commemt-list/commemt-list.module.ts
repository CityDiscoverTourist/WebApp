import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommemtListRoutingModule } from './commemt-list-routing.module';
import { CommemtListComponent } from './commemt-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const lib = [NgSelectModule, NgxDatatableModule];
@NgModule({
  declarations: [CommemtListComponent],
  imports: [
    CommonModule,
    CommemtListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class CommemtListModule {}
