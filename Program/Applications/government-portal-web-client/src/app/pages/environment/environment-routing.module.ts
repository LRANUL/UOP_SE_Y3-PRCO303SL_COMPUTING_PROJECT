import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvironmentPage } from './environment.page';

const routes: Routes = [
  {
    path: '',
    component: EnvironmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnvironmentPageRoutingModule {}
