import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from "ng2-search-filter";

import { GuidePage } from './guide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule
  ],
  entryComponents: [GuidePage],
  declarations: [GuidePage]
})
export class GuidePageModule {}
