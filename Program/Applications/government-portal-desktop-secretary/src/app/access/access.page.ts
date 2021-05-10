/**
 * CONTAINS ACCESS CLASS CODE FOR SECRETARY FUNCTIONALITY
 */
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
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
  private validations_form: FormGroup;
  private errorMessage: string;
  private userEmail: string;
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,
    private firestore: AngularFirestore,
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
  private validation_messages = {
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
  /**
   * Method for logging in secretary
   * @param value form credentials
   */
  private async loginOfficer(value) {
    const loading = await this.loadingController.create({
      message: "Logging in...",
    });
    this.accessService.loginOfficer(value).then(
      async (res) => {
        // console.log(res);
        loading.dismiss();

        let date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        await eAdministration.set(
          {
            Login: firebase.default.firestore.FieldValue.arrayUnion(
              "secretary login attempt from " +
                value.email +
                " at: " +
                new Date()
            ),
          },
          { merge: true }
        ),
        this.navCtrl.navigateForward("secretary/home-affairs");
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
        let date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        const res = await eAdministration.set(
          {
            Login: firebase.default.firestore.FieldValue.arrayUnion(
              "secretary failed login attempt " +
                " using " +
                value.email +
                " at: " +
                new Date()
            ),
          },
          { merge: true }
        )
      }
    );
  }
}
