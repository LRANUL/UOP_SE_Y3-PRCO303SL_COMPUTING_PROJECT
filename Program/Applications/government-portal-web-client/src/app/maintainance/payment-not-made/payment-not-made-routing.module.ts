import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentNotMadePage } from './payment-not-made.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentNotMadePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentNotMadePageRoutingModule {}
