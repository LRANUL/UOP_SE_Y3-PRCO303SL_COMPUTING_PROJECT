import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradingPage } from './trading.page';

const routes: Routes = [
  {
    path: '',
    component: TradingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradingPageRoutingModule {}
