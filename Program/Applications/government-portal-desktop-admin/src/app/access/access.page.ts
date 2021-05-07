import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  ToastController,
  AlertController,
  NavController,
  LoadingController,
} from "@ionic/angular";
import { AccessService } from "../service/access.service";
import * as firebase from "firebase/app";
import * as dateFormat from "dateformat";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-access",
  templateUrl: "./access.page.html",
  styleUrls: ["./access.page.scss"],
})
export class AccessPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string;
  userEmail: string;
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    private firestore: AngularFirestore,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    private accessService: AccessService
  ) {}

  ngOnInit() {
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
          Validators.minLength(5),
          Validators.maxLength(30),
          Validators.required,
        ])
      ),
    });
  }
  validation_messages = {
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
        message: "Password must be at meet mininum characters.",
      },
      {
        type: "maxlength",
        message: "Password cannot be longer than 30 characters long.",
      },
    ],
  };
  /** Method for logging in Administrator
   * @param {form} get form crendentials for authenticating
   */
  async loginAdmin(value) {
    const loading = await this.loadingController.create({
      message: "Logging in...",
    });
    await loading.present();
    this.accessService.loginAdmin(value).then(
      async (res) => {
        // console.log(res);
        loading.dismiss();

        var date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        await eAdministration.set(
          {
            Login: firebase.default.firestore.FieldValue.arrayUnion(
              "administrator login attempt from " +
                value.email +
                " at: " +
                new Date()
            ),
          },
          { merge: true }
        ),
          this.navCtrl.navigateForward("admin");
      },
      async (err) => {
        this.errorMessage = err.message;
        const alert = await this.alertController.create({
          header: "⚠ Login Failed",
          subHeader: "Service Access Attempt",
          message: "Email not registered." + " " + err.message,
          buttons: ["Close"],
        });
        await alert.present();
        loading.dismiss();

        var date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        await eAdministration.set({
          Login: firebase.default.firestore.FieldValue.arrayUnion(
            "administrator failed login attempt from " +
              value.email +
              " at: " +
              new Date()
          ),
        },
        { merge: true });
      }
    );
  }
}
