import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  // { 
  //   path: '', 
  //   redirectTo: 'admin', 
  //   pathMatch: 'full' 
  // },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [AuthorizeGuard],
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
          import('src/app/pages/quest/quest.module').then(
            (m) => m.QuestModule
          ),
      },
      {
        path: 'quest-type',
        loadChildren: () =>
          import('src/app/pages/quest-type/quest-type.module').then(
            (m) => m.QuestTypeModule
          ),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('src/app/layouts/auth-layout/auth-layout.module').then(
        (m) => m.AuthLayoutModule
      ),
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
