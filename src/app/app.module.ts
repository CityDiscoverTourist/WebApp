import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { QuestOwnerLayoutComponent } from './layouts/quest-owner-layout/quest-owner-layout.component';
import { QuestTypeComponent } from './pages/quest-type/quest-type.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { QuillModule } from 'ngx-quill';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { LocationTypeModalComponent } from './pages/share/location-type-modal/location-type-modal.component';
import { QuestTypeModalComponent } from './pages/share/quest-type-modal/quest-type-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DeleteModalComponent } from './pages/share/delete-modal/delete-modal.component';
import { QuestItemTypeModalComponent } from './pages/share/quest-item-type-modal/quest-item-type-modal.component';
import { AreaModalComponent } from './pages/share/area-modal/area-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LetModule } from '@rx-angular/template';
import { CityModalComponent } from './pages/share/city-modal/city-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthorizeInterceptor } from './interceptors';
import { SuggestionModalComponent } from './pages/quest/quest-detail/suggestion-modal/suggestion-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatBoxComponent } from './pages/chat-box/chat-box.component';
import { ForceDeleteCustomerquestModalComponent } from './pages/share/force-delete-customerquest-modal/force-delete-customerquest-modal.component';

const lib = [
  QuillModule.forRoot(),
  NgSelectModule,
  NgxDropzoneModule,
  LetModule,
];

@NgModule({
  declarations: [
    AppComponent,
    QuestTypeComponent,
    AdminLayoutComponent,
    QuestOwnerLayoutComponent,
    LocationTypeModalComponent,
    QuestTypeModalComponent,
    NavbarComponent,
    CityModalComponent,
    DeleteModalComponent,
    QuestItemTypeModalComponent,
    AreaModalComponent,
    SuggestionModalComponent,
    ChatBoxComponent,
    ForceDeleteCustomerquestModalComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgxDropzoneModule,
    CollapseModule.forRoot(),
    NgxChartsModule,
    ...lib,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true,
    },
    HttpClient,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
