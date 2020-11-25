import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { NavController } from '@ionic/angular';
import { GoogleAuthService } from '../service/google-auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string;
  constructor(public formBuilder: FormBuilder, private navCtrl: NavController, private authService: GoogleAuthService,) { }

  ngOnInit() {
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
  registerECitizen(value) {
    this.authService.registerECitizen(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      })
  }
}
