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
import { NavbarComponent } from './components/navbar/navbar.component';
import { CityModalComponent } from './pages/share/city-modal/city-modal.component';
import { DeleteModalComponent } from './pages/share/delete-modal/delete-modal.component';
import { CityModalUpdateComponent } from './pages/share/city-modal-update/city-modal-update.component';
import { QuestItemTypeModalComponent } from './pages/share/quest-item-type-modal/quest-item-type-modal.component';
import { AreaModalComponent } from './pages/share/area-modal/area-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LetModule } from '@rx-angular/template';

const lib = [QuillModule.forRoot(), NgSelectModule, NgxDropzoneModule,LetModule];

@NgModule({
  declarations: [
    AppComponent,
    QuestTypeComponent,
    AdminLayoutComponent,
    QuestOwnerLayoutComponent,
    LocationTypeModalComponent,
    QuestTypeModalComponent,
    QuestDeleteModalComponent,
    NavbarComponent,
    CityModalComponent,
    DeleteModalComponent,
    CityModalUpdateComponent,
    QuestItemTypeModalComponent,
    AreaModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ...lib,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [NotificationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
