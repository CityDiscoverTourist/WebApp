import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommemtListComponent } from './commemt-list.component';

const routes: Routes = [
  {
    path: '',
    component: CommemtListComponent,
    data: { title: 'Danh sách thành phố', url: 'city' },
  },
  {
    path: 'list',
    component: CommemtListComponent,
    data: { title: 'Danh sách thành phố', url: 'city' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommemtListRoutingModule { }
