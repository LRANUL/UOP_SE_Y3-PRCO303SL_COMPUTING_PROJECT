import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JusticePage } from './justice.page';

const routes: Routes = [
  {
    path: '',
    component: JusticePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JusticePageRoutingModule {}
