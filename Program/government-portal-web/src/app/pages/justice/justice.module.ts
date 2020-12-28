import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JusticePageRoutingModule } from './justice-routing.module';

import { JusticePage } from './justice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JusticePageRoutingModule
  ],
  declarations: [JusticePage]
})
export class JusticePageModule {}
