import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TamilPageRoutingModule } from './tamil-routing.module';

import { TamilPage } from './tamil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TamilPageRoutingModule
  ],
  declarations: [TamilPage]
})
export class TamilPageModule {}
