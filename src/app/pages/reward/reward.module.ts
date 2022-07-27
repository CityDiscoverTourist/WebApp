import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardRoutingModule } from './reward-routing.module';
import { RewardComponent } from './reward.component';


@NgModule({
  declarations: [
    RewardComponent
  ],
  imports: [
    CommonModule,
    RewardRoutingModule
  ]
})
export class RewardModule { }
