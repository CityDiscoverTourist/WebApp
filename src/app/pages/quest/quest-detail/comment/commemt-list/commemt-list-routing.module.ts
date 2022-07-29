import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommemtListComponent } from './commemt-list.component';

const routes: Routes = [
  {
    path: '',
    component: CommemtListComponent,
    data: {
      title: 'Quay lại chi tiết quest',
      url: `./quest/${localStorage.getItem(`questId`)}`,
    },
  },
  {
    path: 'list',
    component: CommemtListComponent,
    data: {
      title: 'Quay lại chi tiết quest',
      url: `./quest/${localStorage.getItem(`questId`)}`,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommemtListRoutingModule {}
