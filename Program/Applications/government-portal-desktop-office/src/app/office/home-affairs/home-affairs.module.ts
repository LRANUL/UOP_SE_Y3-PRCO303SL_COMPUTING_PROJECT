import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAffairsPageRoutingModule } from './home-affairs-routing.module';

import { HomeAffairsPage } from './home-affairs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAffairsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [HomeAffairsPage]
})
export class HomeAffairsPageModule {}
