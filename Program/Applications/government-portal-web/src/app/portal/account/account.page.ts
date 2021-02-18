import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute } from "@angular/router";
import {
  AngularFirestore,
  validateEventsArray,
} from "@angular/fire/firestore/";
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
import { loadStripe } from "@stripe/stripe-js";
import { HttpClient } from "@angular/common/http";
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
  private servicesPanel = true;
  private supportPanel = false;
  private settingsPanel = false;
  private NICApplicant = false;
  private foreignCitizen = false;
  private nonFirstTimer = false;

  private NICType: string;
  private NICApplicantStatus: boolean;
  private messageStatus: boolean;
  private userEmail: any;
  private Displayname: string;
  private photoUrl: string;
  private email: string;
  private prefix: any;
  private homeAddress: any;
  private officeAddress: any;
  private mobile: any;
  private landLine: any;
  private fullName: any;
  private QRCode = "https://www.gov.lk";
  private elementType: "img";
  private ESupportMessages: any;
  private messageForm: boolean;
  private EApplications: any;
  constructor(
    private firestore: AngularFirestore,
    public toastController: ToastController,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    private menu: MenuController,
    private navCtrl: NavController,
    private gAuth: AngularFireAuth,
    private authService: GoogleAuthService,
    private loadingController: LoadingController,
    public http: HttpClient,
    private route: ActivatedRoute
  ) {}
  private validations_form: FormGroup;
  private message_form: FormGroup;
  private errorMessage: string;
  ngOnInit() {
    /**
     * At the initiation of page user authenticity is checked and allowed access to account portal
     * all activity is tracked and limited per single users at the current stage
     */
    // AUTHENTICATION MANAGER
    this.gAuth.authState.subscribe(async (user) => {
      if (user) {
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
        var user = firebase.auth().currentUser;

        if (user != null) {
          this.Displayname = user.displayName;
          this.photoUrl = user.photoURL;
          this.email = user.email;
          this.elementType = "img";
        }

        await this.firestore
          .collection("eCitizens/")
          .doc(user.displayName)
          .ref.get()
          .then((doc) => {
            if (doc.exists) {
              this.QRCode = doc.data()["Access_Key"];
              this.prefix = doc.data()["Prefix"];
              this.fullName = doc.data()["Full_Name"];
              this.homeAddress = doc.data()["homeAddress"];
              this.officeAddress = doc.data()["officeAddress"];
              this.mobile = doc.data()["mobile"];
              this.landLine = doc.data()["landLine"];
            }
          });
        console.log("Loading dismissed!");

        this.navCtrl.navigateForward("account");
        this.menu.enable(true, "first");
        this.menu.open("first");
      } else {
        // No user is signed in.
        console.log("NOT SIGNED IN");
        this.navCtrl.navigateBack("");
        // this.logout();
      }
    });

    /** Payment Validator */
    var sessionID;
    var token;
    sessionID = this.route.snapshot.queryParams.id;
    token = this.route.snapshot.queryParams.token;

    if (sessionID) {
      this.validate(sessionID, token);
    }

    //  FORM VALIDATORS
    /**
     * Validation Form receives input data sent by the user to Support service
     */
    this.message_form = this.formBuilder.group({
      fullName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(10),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      subject: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(5),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      message: new FormControl(
        "",
        Validators.compose([Validators.minLength(10)])
      ),
    });

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
      postalcode: new FormControl("", Validators.compose([])),
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
          Validators.pattern("^[0-9]{10}$"),
          Validators.minLength(9),
          Validators.required,
        ])
      ),
      mobilePhone: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^[0-9]{10}$"),
          Validators.minLength(9),
          Validators.required,
        ])
      ),
    });
  }

  //  Validation Messages
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
  };
  /**
   * Method reposible for validating the payment status connected to server and uses token for validation
   * Complete payment process and validation done on secured server
   * @param sessionID contains server send token ID used for validation on pending payments
   */
  private validate(sessionID, token) {
    var user = firebase.auth().currentUser;
    this.http.get("http://localhost:4242/validate?id=" + sessionID).subscribe(
      async (data) => {
        console.log(data);
        if (data == "paid") {
          const alert = await this.alertController.create({
            header: "✅ Application Requested",
            subHeader: "Application Sent",
            message:
              "Your application has been sent, check Services page for process tracking.",
            buttons: ["OK"],
          });
          await alert.present();
          const eApplication = this.firestore
            .collection("eApplications")
            .doc(token);
          const res = await eApplication.set(
            {
              payment_status: "paid",
            },
            { merge: true }
          );
        } else if (data == "unpaid") {
          const alert = await this.alertController.create({
            header: "🚫 Application Rejected",
            subHeader: "Application Payment",
            message:
              "Your application has not been sent, try again and make the payment process.",
            buttons: ["OK"],
          });
          await alert.present();
          const eApplication = this.firestore
            .collection("eApplications")
            .doc(token);
          const res = await eApplication.delete();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

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
  private openService() {
    this.servicesPanel = true;
    this.supportPanel = false;
    this.settingsPanel = false;
  }
  /**
   * Support tab contains functions for contacting support and for application tracking all applications send would be tracable from this
   * tab, currently limit to NIC application tracking
   */
  async openSupport() {
    this.servicesPanel = false;
    this.supportPanel = true;
    this.settingsPanel = false;
    this.authService.getESupportMessages().subscribe((data) => {
      console.log(data);
      this.ESupportMessages = data.map((e) => {
        return {
          id: e.payload.doc.id,
          FullName: e.payload.doc.data()["FullName"],
          Subject: e.payload.doc.data()["Subject"],
          Description: e.payload.doc.data()["Description"],
          Response: e.payload.doc.data()["Response"],
        };
      });
    });
  }
  private Support() {
    this.messageStatus = true;
    this.messageForm = true;
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
  private firstNICApp() {
    this.NICApplicant = true;
    this.nonFirstTimer = false;
    this.validations_form.patchValue({
      NICType: "First NIC | පළමු ජාතික හැඳුනුම්පත | முதல் என்.ஐ.சி.",
    });
  }
  /**
   * Changes forms for NIC renewals
   */
  private renewNICApp() {
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
  private correctionNICApp() {
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
  private lostNICApp() {
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
  private exitApp() {
    this.NICApplicant = false;
  }
  private closeMessages() {
    this.messageStatus = false;
  }
  private closeMessageForm() {
    this.messageForm = false;
  }
  /**
   * Enables certain sections of form for different applicants such as dual citizens
   */
  private ForeignYes() {
    this.foreignCitizen = true;
  }
  /**
   * Disables certain sections of form for different applicants such as dual citizens
   */
  private ForeignNo() {
    this.foreignCitizen = false;
  }
  /**
   * Method reposible for sending validated data to google-auth service page for further verfication and uploading to firebase
   * @param value contains validated data from NIC application form
   * Depending the data sent, verification would inform user of the process whther whether thier data was accepts and sent or rejected.
   */
  async sendApplication(value) {
    var token = `${Math.floor(
      Math.random() * 100000000000000 + 100000000000000
    )}`;
    this.authService.sendNICApplication(value, token).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
    const stripe = await loadStripe(
      "pk_test_51IHSuEA5rKg2mqjLa3Gh3JeEVlSE01Ty1uuLmUAwzSSEISREulbOx3FCTLhLtMcxo5QO3Nno4wPoAPUC7vchjnN500co3fV7M0"
    );
    fetch("http://localhost:4242/pay-nic", {
      method: "POST",
      body: JSON.stringify({
        token: token,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }
  private supportCitizen(value) {
    this.authService
      .sendSupportMessage(value, this.prefix + " " + this.fullName)
      .then(
        (res) => {
          console.log(res);
          this.passAlertMessage();
        },
        (err) => {
          console.log(err);
          this.failAlertMessage();
        }
      );
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
  /**
   * Method for displaying successful validated and verified message requests
   */
  async passAlertMessage() {
    const alert = await this.alertController.create({
      header: "✅ Support Requested",
      subHeader: "Message Sent",
      message: "Your reponse was sent to customer support",
      buttons: ["OK"],
    });
    await alert.present();
  }
  /**
   * This method would excute if the data sent isn't valid such as information mismatch so the automated process had failed.
   */
  async failAlertMessage() {
    const alert = await this.alertController.create({
      header: "⚠ Message Not Send",
      subHeader: "Network Error",
      message:
        "Your message has not been sent, Try again later or contact support.",
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
    this.messageStatus = false;
    this.authService.getEApplications().subscribe((data) => {
      this.EApplications = data.map((e) => {
        console.log(e.payload.doc.data()["requestType"]);
        return {
          requestType: e.payload.doc.data()["requestType"],
          assigneeName: e.payload.doc.data()["division"],
          applicationDescription: e.payload.doc.data()["description"],
          applicationStatus: e.payload.doc.data()["status"],
          receivedTime: e.payload.doc.data()["sentTimeStamp"],
          processedTime: e.payload.doc.data()["processedTimeStamp"],
          approvedTime: e.payload.doc.data()["approvedTimeStamp"],
        };
      });
    });
  }
  /**
   * This method closes the Application status windows
   */
  private exitStatus() {
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
              .catch(async (error) => {
                console.log(console.error);
                const toast = this.toastController.create({
                  message: "Your password has not changed, Try again.",
                  duration: 2000,
                });
                (await toast).present();
              });
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
              .catch(async (error) => {
                const toast = await this.toastController.create({
                  message: "Your Email has not changed, Try again.",
                  duration: 2000,
                });
                toast.present();
              });
          },
        },
      ],
    });

    await alert.present();
  }
  //  SETTINGS PAGE END
}
