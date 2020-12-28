import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HousingPageRoutingModule } from './housing-routing.module';

import { HousingPage } from './housing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HousingPageRoutingModule
  ],
  declarations: [HousingPage]
})
export class HousingPageModule {}
