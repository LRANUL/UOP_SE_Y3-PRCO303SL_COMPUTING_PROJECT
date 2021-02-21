import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAffairsPageRoutingModule } from './home-affairs-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HomeAffairsPage } from './home-affairs.page';
import { NgxStripeModule } from 'ngx-stripe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAffairsPageRoutingModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxStripeModule.forRoot('pk_test_51IHSuEA5rKg2mqjLa3Gh3JeEVlSE01Ty1uuLmUAwzSSEISREulbOx3FCTLhLtMcxo5QO3Nno4wPoAPUC7vchjnN500co3fV7M0'),
  ],
  declarations: [HomeAffairsPage]
})
export class HomeAffairsPageModule {}
