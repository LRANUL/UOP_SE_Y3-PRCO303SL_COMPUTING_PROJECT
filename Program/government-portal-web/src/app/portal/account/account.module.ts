import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';
/**
 * Contains Modules for Accounts Page, Forms Module is Mandatory for functioning. 
 * DO NOT REMOVE during application optimisation
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    ReactiveFormsModule,
    NgxQRCodeModule
  ],
  declarations: [AccountPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  
})
export class AccountPageModule {}
