import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnglishPageRoutingModule } from './english-routing.module';

import { EnglishPage } from './english.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnglishPageRoutingModule
  ],
  declarations: [EnglishPage]
})
export class EnglishPageModule {}
