import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from './guards/authorize.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthorizeGuard],
    children: [
      {
        path: '', //login complete redirect to dashboard
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('src/app/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'quest',
        loadChildren: () =>
          import('src/app/pages/quest/quest.module').then((m) => m.QuestModule),
      },
      {
        path: 'quest-type',
        loadChildren: () =>
          import('src/app/pages/quest-type/quest-type.module').then(
            (m) => m.QuestTypeModule
          ),
      },
      {
        path: 'location-type',
        loadChildren: () =>
          import('src/app/pages/location-type/location-type.module').then(
            (m) => m.LocationTypeModule
          ),
      },
      {
        path: 'customer-quest',
        loadChildren: () =>
          import('src/app/pages/customer-quest/customer-quest.module').then(
            (m) => m.CustomerQuestModule
          ),
      },
      {
        path: 'quest-item-type',
        loadChildren: () =>
          import('src/app/pages/quest-item-type/quest-item-type.module').then(
            (m) => m.QuestItemTypeModule
          ),
      },
      {
        path: 'city',
        loadChildren: () =>
          import('src/app/pages/city/city.module').then((m) => m.CityModule),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('src/app/pages/location/location.module').then(
            (m) => m.LocationModule
          ),
      },
      {
        path: 'area',
        loadChildren: () =>
          import('src/app/pages/area/area.module').then((m) => m.AreaModule),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('src/app/pages/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('src/app/layouts/login/login.module').then((m) => m.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
