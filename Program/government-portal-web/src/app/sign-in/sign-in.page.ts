import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { LoadingController, NavController } from '@ionic/angular';
import { GoogleAuthService } from '../service/google-auth.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string;
  constructor(public formBuilder: FormBuilder, private gAuth: AngularFireAuth, private navCtrl: NavController, private authService: GoogleAuthService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.gAuth.authState.subscribe(async user => {
      if (user) {
        // User is signed in, auto login intiated.
        console.log('User is signed in');
        const loading = await this.loadingController.create({
          message: 'Logging in...',
          duration: 400
        });
        await loading.present();

        console.log('Loading dismissed!');

        this.navCtrl.navigateForward('account');

      }
      else {
        // No user is signed in.
        console.log('User is NOT signed in');
      }
    });

    this.validations_form = this.formBuilder.group({
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])),
      password: new FormControl("", Validators.compose([Validators.minLength(15), Validators.maxLength(30), Validators.required]))
    });
  }
  validation_messages = {
    email: [
      {
        type: "required",
        message: "Your Government Portal registered email is required."
      }, {
        type: "pattern",
        message: "Invalid email."
      }
    ],
    password: [
      {
        type: "required",
        message: "Password is required."
      }, {
        type: "minlength",
        message: "Password must be at least 15 characters long."
      }, {
        type: "maxlength",
        message: "Password cannot be longer than 30 characters long."
      }
    ]
  };
  loginCitizen(value) {
    this.authService.loginCitizen(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward('account');
      }, err => {
        this.errorMessage = err.message;
      })
  }
}
