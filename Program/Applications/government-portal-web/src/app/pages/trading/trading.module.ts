import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradingPageRoutingModule } from './trading-routing.module';

import { TradingPage } from './trading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradingPageRoutingModule
  ],
  declarations: [TradingPage]
})
export class TradingPageModule {}
