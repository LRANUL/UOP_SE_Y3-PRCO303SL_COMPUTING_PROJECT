import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageUnderConstructionPage } from './page-under-construction.page';

const routes: Routes = [
  {
    path: '',
    component: PageUnderConstructionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageUnderConstructionPageRoutingModule {}
