import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { GoogleAuthService } from "../service/google-auth.service";
import firebase from "firebase/app";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.page.html",
  styleUrls: ["./sign-in.page.scss"],
})
export class SignInPage implements OnInit {
   validations_form: FormGroup;
   errorMessage: string;
   userEmail: string;
  constructor(
    public firestore: AngularFirestore,
    public toastController: ToastController,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public gAuth: AngularFireAuth,
    public navCtrl: NavController,
    public authService: GoogleAuthService,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.gAuth.authState.subscribe(async (user) => {
      if (user) {
        // User is signed in, auto login intiated.
        // console.log("User is signed in");
        const loading = await this.loadingController.create({
          message: "Logging in...",
          duration: 400,
        });
        await loading.present();

        // console.log("Loading dismissed!");

        this.navCtrl.navigateForward("account");
      } else {
        // No user is signed in.
        // console.log("User is NOT signed in");
      }
    });

    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(15),
          Validators.maxLength(30),
          Validators.required,
        ])
      ),
    });
  }
   validation_form = {
    email: [
      {
        type: "required",
        message: "Your Government Portal registered email is required.",
      },
      {
        type: "pattern",
        message: "Invalid email.",
      },
    ],
    password: [
      {
        type: "required",
        message: "Password is required.",
      },
      {
        type: "minlength",
        message: "Password must be at least 15 characters long.",
      },
      {
        type: "maxlength",
        message: "Password cannot be longer than 30 characters long.",
      },
    ],
  };
  async forgotPassword() {
    const alert = await this.alertController.create({
      header: "Enter your Government Portal Email",
      inputs: [
        {
          name: "email",
          type: "email",
          placeholder: "Email",
        },
      ],
      message: this.userEmail,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            // // console.log('Confirm Cancel');
          },
        },
        {
          text: "Change",
          handler: async (alertData) => {
            var auth = firebase.auth();
            auth
              .sendPasswordResetEmail(alertData.email)
              .then(async (res) => {
                const toast = await this.toastController.create({
                  message: "Your password reset email sent.",
                  duration: 2000,
                });
                toast.present();
              })
              .catch(async error => {
              const toast = this.toastController.create({
                message: "Your request not approved, Email not registered.",
                duration: 2000,
              });
              (await toast).present();
            })
          },
        },
      ],
    });
    await alert.present();
  }

   loginCitizen(value) {
    this.authService.loginCitizen(value).then(
      (res) => {
        // console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward("account");
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }
}
