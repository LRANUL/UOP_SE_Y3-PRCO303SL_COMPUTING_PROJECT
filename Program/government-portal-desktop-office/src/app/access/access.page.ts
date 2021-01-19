import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastController, AlertController, NavController, LoadingController } from '@ionic/angular';
import { AccessService } from '../service/access.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.page.html',
  styleUrls: ['./access.page.scss'],
})
export class AccessPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string;
  userEmail: string;
  constructor(private firestore: AngularFirestore, public toastController: ToastController, public alertController: AlertController, public formBuilder: FormBuilder, private gAuth: AngularFireAuth, private navCtrl: NavController, private accessService: AccessService, private loadingController: LoadingController) { }

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

  loginOfficer(value) {
    this.accessService.loginOfficer(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward("office/home-affairs");
      }, async err => {
        this.errorMessage = err.message;
        const alert = await this.alertController.create({
          header: '⚠ Login Failed',
          subHeader: 'Service Access Attempt',
          message: 'Email not registered.' + ' '+ err.message,
          buttons: ['Close']
        });
        await alert.present();
      })
  }
}
