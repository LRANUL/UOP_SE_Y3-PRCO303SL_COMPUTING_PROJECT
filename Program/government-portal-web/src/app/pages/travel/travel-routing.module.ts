import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravelPage } from './travel.page';

const routes: Routes = [
  {
    path: '',
    component: TravelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelPageRoutingModule {}
