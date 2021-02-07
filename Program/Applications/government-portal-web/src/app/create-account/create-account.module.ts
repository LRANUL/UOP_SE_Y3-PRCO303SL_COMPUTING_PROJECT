import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAccountPageRoutingModule } from './create-account-routing.module';

import { CreateAccountPage } from './create-account.page';
/**
 * Contains Modules for Create Account Page, Forms Module is Mandatory for functioning. 
 * DO NOT REMOVE during application optimisation
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateAccountPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateAccountPage]
})
export class CreateAccountPageModule {}
