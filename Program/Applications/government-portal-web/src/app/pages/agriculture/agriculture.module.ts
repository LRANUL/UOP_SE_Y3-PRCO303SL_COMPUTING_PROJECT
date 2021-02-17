import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgriculturePageRoutingModule } from './agriculture-routing.module';

import { AgriculturePage } from './agriculture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgriculturePageRoutingModule
  ],
  declarations: [AgriculturePage]
})
export class AgriculturePageModule {}
