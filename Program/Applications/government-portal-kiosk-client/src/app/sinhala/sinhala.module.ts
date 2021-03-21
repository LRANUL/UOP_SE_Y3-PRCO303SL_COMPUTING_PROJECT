import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinhalaPageRoutingModule } from './sinhala-routing.module';

import { SinhalaPage } from './sinhala.page';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_51IHSuEA5rKg2mqjLa3Gh3JeEVlSE01Ty1uuLmUAwzSSEISREulbOx3FCTLhLtMcxo5QO3Nno4wPoAPUC7vchjnN500co3fV7M0'),

    SinhalaPageRoutingModule
  ],
  declarations: [SinhalaPage]
})
export class SinhalaPageModule {}
