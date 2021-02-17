import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentNotMadePageRoutingModule } from './payment-not-made-routing.module';

import { PaymentNotMadePage } from './payment-not-made.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentNotMadePageRoutingModule
  ],
  declarations: [PaymentNotMadePage]
})
export class PaymentNotMadePageModule {}
