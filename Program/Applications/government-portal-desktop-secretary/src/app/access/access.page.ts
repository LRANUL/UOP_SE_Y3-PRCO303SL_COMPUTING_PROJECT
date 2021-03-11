import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { AccessService } from '../service/access.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.page.html',
  styleUrls: ['./access.page.scss'],
})
export class AccessPage implements OnInit {
  private validations_form: FormGroup;
  private errorMessage: string;
  private userEmail: string;
  constructor(public toastController: ToastController, public alertController: AlertController, public formBuilder: FormBuilder, private navCtrl: NavController, private accessService: AccessService) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])),
      password: new FormControl("", Validators.compose([Validators.minLength(5), Validators.maxLength(30), Validators.required]))
    });
  }
  private validation_messages = {
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
        message: "Password must be at meet mininum characters."
      }, {
        type: "maxlength",
        message: "Password cannot be longer than 30 characters long."
      }
    ]
  };

  private loginOfficer(value) {
    this.accessService.loginOfficer(value)
      .then(res => {
        // console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward("secretary/home-affairs");
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
