import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgriculturePage } from './agriculture.page';

const routes: Routes = [
  {
    path: '',
    component: AgriculturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgriculturePageRoutingModule {}
