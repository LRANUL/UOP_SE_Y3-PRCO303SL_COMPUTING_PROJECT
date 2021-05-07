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
} from "@ionic/angular";
import { AccessService } from "../Service/access.service";

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
          Validators.minLength(15),
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
        message: "Government Portal registered Kiosk Name is required.",
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
   * Method for logging in kiosk agent
   * @param value form crendentials
   */
  loginKiosk(value) {
    this.accessService.loginKiosk(value).then(
      (res) => {
        // console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward("home");
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
      }
    );
  }
}
