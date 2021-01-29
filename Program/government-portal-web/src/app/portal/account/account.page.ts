import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore/";
import {
  AlertController,
  LoadingController,
  MenuController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { GoogleAuthService } from "../../service/google-auth.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import * as dateFormat from "dateformat";
import firebase from "firebase/app";
/**
 * Account Page Responsible for handling backend logic of Client Account Management, consits functions to send applications
 * to firebase, monitor status of application and personal account management.
 * Validation for forms are set as per requirements of Government regulations, Form DRP 1,7,8 under Registration of Persons Act No 32 of 1968
 */
@Component({
  selector: "app-account",
  templateUrl: "./account.page.html",
  styleUrls: ["./account.page.scss"],
})
export class AccountPage implements OnInit {
  servicesPanel = true;
  supportPanel = false;
  settingsPanel = false;
  NICApplicant = false;
  foreignCitizen = false;
  nonFirstTimer = false;

  NICType: string;
  NICApplicantStatus: boolean;
  userEmail: any;
  requestType: any;
  assigneeName: any;
  applicationDescription: any;
  applicationStatus: any;
  receivedTime: any;
  Authorised = false;
  Unauthorised = false;
  Displayname: string;
  photoUrl: string;
  email: string;
  prefix: any;
  homeAddress: any;
  officeAddress: any;
  mobile: any;
  landLine: any;
  fullName: any;
  elementType: "url" | "canvas" | "img" = "canvas";
  value: string = "gov.lk";
  constructor(
    private firestore: AngularFirestore,
    public toastController: ToastController,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    private menu: MenuController,
    private navCtrl: NavController,
    private gAuth: AngularFireAuth,
    private authService: GoogleAuthService,
    private loadingController: LoadingController
  ) {}
  validations_form: FormGroup;
  errorMessage: string;
  ngOnInit() {
    /**
     * At the initiation of page user authenticity is checked and allowed access to account portal
     * all activity is tracked and limited per single users at the current stage
     */
    // AUTHENTICATION MANAGER
    this.gAuth.authState.subscribe(async (user) => {
      if (user) {
        this.Authorised = true;
        this.userEmail = user.email;
        // User is signed in, auto login intiated.
        console.log("SIGNED IN");
        /**
         * Loading controller set to hold portal till it load/fetch data from firebase
         * This and other controllers allows to optimise performance by 'lazy loading' components and data
         */
        const loading = await this.loadingController.create({
          message: "Please wait...",
          duration: 200,
          translucent: true,
          backdropDismiss: true,
        });
        await loading.present();

        console.log("Loading dismissed!");

        this.navCtrl.navigateForward("account");
        this.menu.enable(true, "first");
        this.menu.open("first");
      } else {
        // No user is signed in.
        this.Unauthorised = true;
        console.log("NOT SIGNED IN");
        this.navCtrl.navigateBack("");
        // this.logout();
      }
    });
    //  FORM VALIDATORS
    /**
     * Validation Form receives input data sent by the user and validates them before sending for further conditionals checks,
     * at the Firestore function data would be cross checked with existing data on Firebase for verification and uploaded if they
     * meet requirements.
     */
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        ])
      ),
      familyName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      name: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      surname: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      engFamilyName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      engName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      engSurname: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      nicFamilyName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      nicName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      nicSurname: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      gender: new FormControl("", Validators.compose([])),
      civilStatus: new FormControl("", Validators.compose([])),
      profession: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      dateOfBirth: new FormControl("", Validators.compose([])),
      placeOfBirth: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      division: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      district: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      birthRegNo: new FormControl("", Validators.compose([])),
      birthCertNo: new FormControl("", Validators.compose([])),
      countryOfBirth: new FormControl("", Validators.compose([])),
      NICType: new FormControl("", Validators.compose([])),
      foreignCertNo: new FormControl("", Validators.compose([])),
      city: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      houseNo: new FormControl("", Validators.compose([])),
      houseName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      streetName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      postalcode: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      postcity: new FormControl("", Validators.compose([])),
      posthouseNo: new FormControl("", Validators.compose([])),
      posthouseName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      poststreetName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      postpostalcode: new FormControl("", Validators.compose([])),
      certDate: new FormControl("", Validators.compose([])),
      cardNo: new FormControl("", Validators.compose([])),
      nicDate: new FormControl("", Validators.compose([])),
      policeName: new FormControl("", Validators.compose([])),
      policeReportDate: new FormControl("", Validators.compose([])),
      homePhone: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern(
            "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
          ),
        ])
      ),
      mobilePhone: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern(
            "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
          ),
        ])
      ),
    });
  }
  //  Validation Messages
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
  };

  // LOAD CONTROLLERS
  /*
   * This method invokes a function on the google-auth services page to log out user from the portal
   */
  async logout() {
    const loading = await this.loadingController.create({
      message: "Logging out...",
      duration: 200,
      translucent: true,
      backdropDismiss: true,
    });
    await loading.present();
    this.authService
      .logoutCitizen()
      .then(async (res) => {
        const { role, data } = await loading.onDidDismiss();
      })
      .catch((error) => {});
    this.navCtrl.navigateBack("");
  }
  // TAB MENU START
  /**
   * This method makes visible the Services tab menu content while hiding/closing other tab menu data
   * Data loss during navigation is prevent here, so task opened on other pages would hold on till user visits
   * them. (Data may get lost due to low system memory on mobile devices)
   *
   *  Currently service tab contains application forms for NIC applicants, user could apply for an NIC from the same tab.
   */
  openService() {
    this.servicesPanel = true;
    this.supportPanel = false;
    this.settingsPanel = false;
  }
  /**
   * Support tab contains functions for contacting support and for application tracking all applications send would be tracable from this
   * tab, currently limit to NIC application tracking
   */
  openSupport() {
    this.servicesPanel = false;
    this.supportPanel = true;
    this.settingsPanel = false;
  }
  /**
   * Settings tab allows the user to update credentials such as there Email and password, further features could be added later
   * As a protection feature user will not be able to change there email if the login isn't recent or location is suspicious
   * So they will have logout and login again to reauthenticate for a email update, this is cloud enabled feature also previous email
   * would be notified of changes and provides a recovery link.
   */
  async openSettings() {
    this.servicesPanel = false;
    this.supportPanel = false;
    this.settingsPanel = true;
    var user = firebase.auth().currentUser;

    if (user != null) {
      this.Displayname = user.displayName;
      this.photoUrl = user.photoURL;
      this.email = user.email;
    }
    this.elementType = "url";
    this.value = "gov.lk";
    this.Displayname = "A534463634634";
    this.fullName = "Ranul Ladduwahetty";
    await this.firestore
      .collection("eCitizens/")
      .doc(user.displayName)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.prefix = doc.data()["Prefix"];
          this.fullName = doc.data()["fullName"];
          this.homeAddress = doc.data()["homeAddress"];
          this.officeAddress = doc.data()["officeAddress"];
          this.mobile = doc.data()["mobile"];
          this.landLine = doc.data()["landLine"];
        }
      });
  }
  //  TAB MENU END

  // SERVICE PAGE START
  /**
   * Methods reposible for changing form layout for application type, signficant amount of time was spent to digitalise the paper form
   * while adhering to regulations, change data with caution data and variables inter connected within pages and the cloud.
   */
  /**
   * Changes forms for a first time NIC applicant
   */
  firstNICApp() {
    this.NICApplicant = true;
    this.validations_form.patchValue({
      NICType: "First NIC | පළමු ජාතික හැඳුනුම්පත | முதல் என்.ஐ.சி.",
    });
  }
  /**
   * Changes forms for NIC renewals
   */
  renewNICApp() {
    this.NICApplicant = true;
    this.nonFirstTimer = true;
    this.validations_form.patchValue({
      NICType:
        "Renew NIC | ජාතික හැඳුනුම්පත අලුත් කරන්න | NIC ஐ புதுப்பிக்கவும்",
    });
  }
  /**
   * Changes forms for applicants that require correction of NIC
   */
  correctionNICApp() {
    this.NICApplicant = true;
    this.nonFirstTimer = true;
    this.validations_form.patchValue({
      NICType:
        "Corrections NIC| නිවැරදි කිරීම් ජාතික හැඳුනුම්පත | திருத்தங்கள் என்.ஐ.சி.",
    });
  }
  /**
   * Changes forms for a lost NIC applicant
   */
  lostNICApp() {
    this.NICApplicant = true;
    this.nonFirstTimer = true;
    this.validations_form.patchValue({
      NICType: "Lost NIC | නැතිවූ ජාතික හැඳුනුම්පත | இழந்த என்.ஐ.சி.",
    });
  }
  /**
   * Closes form from user, designed to hold data during an accidental closure. This was done as large community of users
   * would be using the platform including non IT experts. Recommends simplicity for all future updates.
   */
  exitApp() {
    this.NICApplicant = false;
  }
  /**
   * Enables certain sections of form for different applicants such as dual citizens
   */
  ForeignYes() {
    this.foreignCitizen = true;
  }
  /**
   * Disables certain sections of form for different applicants such as dual citizens
   */
  ForeignNo() {
    this.foreignCitizen = false;
  }
  /**
   * Method reposible for sending validated data to google-auth service page for further verfication and uploading to firebase
   * @param value contains validated data from NIC application form
   * Depending the data sent, verification would inform user of the process whther whether thier data was accepts and sent or rejected.
   */
  sendApplication(value) {
    this.authService.sendNICApplication(value).then(
      (res) => {
        console.log(res);
        this.passAlertNICApp();
      },
      (err) => {
        console.log(err);
        this.failAlertNICApp();
      }
    );
  }
  /**
   * Method for displaying successful validated and verified form data
   */
  async passAlertNICApp() {
    const alert = await this.alertController.create({
      header: "✅ Application Requested",
      subHeader: "Application Sent",
      message:
        "Your application has been sent, check Services page for tracking the process.",
      buttons: ["OK"],
    });
    await alert.present();
  }
  /**
   * This method would excute if the data sent isn't valid such as information mismatch so the automated process had failed.
   */
  async failAlertNICApp() {
    const alert = await this.alertController.create({
      header: "⚠ Application Requested",
      subHeader: "Application Not Sent !",
      message:
        "Your application has not been sent, Try again later or contact support.",
      buttons: ["OK"],
    });

    await alert.present();
  }
  // SERVICE PAGE END

  //  SUPPORT PAGE START
  /**
   * This method is reponsible for retrieving data from Firebase relevant to the user and displaying it
   * Data coming from Firestore is retricted for only the owner with this method, this data is parsed for useful
   * information and displayed for user. (Used for Application Status Tracking)
   */
  async NICStatus() {
    this.NICApplicantStatus = true;
    await this.firestore
      .collection("/eApplications/")
      .doc("NICApplication")
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.requestType = doc.data()["requestType"];
          this.assigneeName = doc.data()["division"];
          this.applicationDescription = doc.data()["description"];
          this.applicationStatus = doc.data()["status"];
          this.receivedTime = doc.data()["TimeStamp"].toDate();
        }
      });
  }
  /**
   * This method closes the Application status windows
   */
  exitStatus() {
    this.NICApplicantStatus = false;
  }
  //  SUPPORT PAGE END

  //  SETTINGS PAGE START
  /*
   * Method for updating user credentials, user is verfied before updated.
   */
  async changePassword() {
    const alert = await this.alertController.create({
      header: "Change Password",
      inputs: [
        {
          name: "password",
          type: "password",
          placeholder: "New Password",
        },
      ],
      message: this.userEmail,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            // console.log('Confirm Cancel');
          },
        },
        {
          text: "Change",
          handler: async (alertData) => {
            var user = firebase.auth().currentUser;
            user
              .updatePassword(alertData.password)
              .then(async (res) => {
                const toast = await this.toastController.create({
                  message: "Your password has been updated.",
                  duration: 2000,
                });
                toast.present();
              })
              .catch();
            if (!Error) {
              console.log(console.error);
              const toast = this.toastController.create({
                message: "Your password has not changed, Try again.",
                duration: 2000,
              });
              (await toast).present();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Method responsible for changing user email for the current account.
   * To prevent malicious activity old user email if notified of changes and provided
   * with a recovery link to gain back access to account.(Configured on the Cloud)
   * Long time inactive/suspicous location users have reauthenticate by logging in and
   * out before changing email as auto login feature is enabled.
   */
  async changeEmail() {
    const alert = await this.alertController.create({
      header: "Change Email",
      inputs: [
        {
          name: "email",
          type: "email",
          placeholder: "New Email",
        },
      ],
      message: this.userEmail,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            // console.log('Confirm Cancel');
          },
        },
        {
          text: "Change",
          handler: async (alertData) => {
            var user = firebase.auth().currentUser;
            user
              .updateEmail(alertData.email)
              .then(async (res) => {
                const toast = await this.toastController.create({
                  message: "Your Email has been updated.",
                  duration: 2000,
                });
                toast.present();
              })
              .catch(Error);
            if (!Error) {
              const toast = await this.toastController.create({
                message: "Your Email has not changed, Try again.",
                duration: 2000,
              });
              toast.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }
  //  SETTINGS PAGE END
}
