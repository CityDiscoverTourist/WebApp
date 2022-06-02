import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { QuestOwnerLayoutComponent } from './layouts/quest-owner-layout/quest-owner-layout.component';
import { QuestTypeComponent } from './pages/quest-type/quest-type.component';

import { QuillModule } from 'ngx-quill';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from './services';
import { LocationTypeModalComponent } from './pages/share/location-type-modal/location-type-modal.component';
import { QuestTypeModalComponent } from './pages/share/quest-type-modal/quest-type-modal.component';
import { QuestDeleteModalComponent } from './pages/share/quest-delete-modal/quest-delete-modal.component';
const lib=[
  QuillModule.forRoot()
]

@NgModule({
  declarations: [
    AppComponent,
    QuestTypeComponent,
    AdminLayoutComponent,
    QuestOwnerLayoutComponent,
    LocationTypeModalComponent,
    QuestTypeModalComponent,
    QuestDeleteModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule,
    ...lib,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers:[
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
