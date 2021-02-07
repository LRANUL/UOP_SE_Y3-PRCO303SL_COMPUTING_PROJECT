import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeAffairsPage } from './home-affairs.page';

const routes: Routes = [
  {
    path: '',
    component: HomeAffairsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAffairsPageRoutingModule {}
