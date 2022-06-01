import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityDetailRoutingModule } from './city-detail-routing.module';
import { CityDetailComponent } from './city-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/services';
@NgModule({
  declarations: [CityDetailComponent],
  imports: [
    CommonModule,
    CityDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [NotificationService],
})
export class CityDetailModule {}
