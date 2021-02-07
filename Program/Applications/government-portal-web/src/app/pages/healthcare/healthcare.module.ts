import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthcarePageRoutingModule } from './healthcare-routing.module';

import { HealthcarePage } from './healthcare.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthcarePageRoutingModule
  ],
  declarations: [HealthcarePage]
})
export class HealthcarePageModule {}
