import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessageComponent } from './validation-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    ValidationMessageComponent
  ],
  imports: [
    CommonModule,
     ReactiveFormsModule
  ],
  exports:[
    ValidationMessageComponent
  ],
})
export class ValidationMessageModule { }
