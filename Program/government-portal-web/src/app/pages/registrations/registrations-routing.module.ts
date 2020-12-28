import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationsPage } from './registrations.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationsPageRoutingModule {}
