import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmploymentPageRoutingModule } from './employment-routing.module';

import { EmploymentPage } from './employment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmploymentPageRoutingModule
  ],
  declarations: [EmploymentPage]
})
export class EmploymentPageModule {}
