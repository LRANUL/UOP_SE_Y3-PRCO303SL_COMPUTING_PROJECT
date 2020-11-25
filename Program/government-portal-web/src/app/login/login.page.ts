import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { NavController } from '@ionic/angular';
import { GoogleAuthService } from '../service/google-auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string;
  constructor(public formBuilder: FormBuilder, private navCtrl: NavController, private authService: GoogleAuthService,) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      userID: new FormControl("", Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12)])),
      password: new FormControl("", Validators.compose([Validators.minLength(15), Validators.maxLength(30), Validators.required]))
    });
  }
  validation_messages = {
    userID: [
      {
        type: "required",
        message: "Your Government Portal ID is required."
      }, {
        type: "minlength",
        message: "Invalid ID."
      }, {
        type: "maxlength",
        message: "Invalid ID."
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
        this.navCtrl.navigateForward('/dashboard');
      }, err => {
        this.errorMessage = err.message;
      })
  }
}
