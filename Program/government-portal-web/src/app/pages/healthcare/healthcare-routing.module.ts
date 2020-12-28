import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthcarePage } from './healthcare.page';

const routes: Routes = [
  {
    path: '',
    component: HealthcarePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthcarePageRoutingModule {}
