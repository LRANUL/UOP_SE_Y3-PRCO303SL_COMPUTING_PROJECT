import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishPage } from './english.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishPageRoutingModule {}
