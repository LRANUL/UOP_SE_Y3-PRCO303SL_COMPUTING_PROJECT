import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageUnderConstructionPageRoutingModule } from './page-under-construction-routing.module';

import { PageUnderConstructionPage } from './page-under-construction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageUnderConstructionPageRoutingModule
  ],
  declarations: [PageUnderConstructionPage]
})
export class PageUnderConstructionPageModule {}
