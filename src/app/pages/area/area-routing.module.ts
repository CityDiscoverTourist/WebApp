import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from './area.component';

const routes: Routes = [
 
  {
    path: '',
    component: AreaComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./area-list/area-list.module').then(
            (m) => m.AreaListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
        import('./area-list/area-list.module').then(
          (m) => m.AreaListModule
        ),
      },
      {
        path: 'edit',
        loadChildren: () =>
        import('./area-edit/area-edit.module').then(
          (m) => m.AreaEditModule
        ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule { }
