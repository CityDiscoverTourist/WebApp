import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityListRoutingModule } from './city-list-routing.module';
import { CityListComponent } from './city-list.component';


import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationMessageModule } from 'src/app/modules/validation-message/validation-message.module';
import { NotificationService } from 'src/app/services';
@NgModule({
  declarations: [
    CityListComponent
  ],
  imports: [
    CommonModule,
    CityListRoutingModule,
    PanelModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    BlockUIModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    // ValidationMessageModule,
  ],
  providers:[
    NotificationService
  ]
})
export class CityListModule { }
