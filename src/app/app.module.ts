import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { QuestOwnerLayoutComponent } from './layouts/quest-owner-layout/quest-owner-layout.component';
import { QuestTypeComponent } from './pages/quest-type/quest-type.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestTypeComponent,
    AdminLayoutComponent,
    QuestOwnerLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
