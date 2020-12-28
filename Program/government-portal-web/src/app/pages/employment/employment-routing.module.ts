import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmploymentPage } from './employment.page';

const routes: Routes = [
  {
    path: '',
    component: EmploymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmploymentPageRoutingModule {}
