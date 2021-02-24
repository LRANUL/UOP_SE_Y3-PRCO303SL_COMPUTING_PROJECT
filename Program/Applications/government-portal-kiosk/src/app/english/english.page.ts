import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { switchMap } from "rxjs/operators";
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
} from "@ionic/angular";
import * as firebase from "firebase";
import { AccessService } from "src/app/Service/access.service";
import { HttpClient } from "@angular/common/http";
import { StripeService, StripeCardNumberComponent } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from "@stripe/stripe-js";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { LoadingController } from '@ionic/angular';
@Component({
  selector: "app-english",
  templateUrl: "./english.page.html",
  styleUrls: ["./english.page.scss"],
})
export class EnglishPage implements OnInit {
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#31325F",
        fontWeight: "300",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "20px",
        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: "auto",
  };

  portalScanner: boolean;
  validations_form: FormGroup;
  NICApplicant: boolean;
  nonFirstTimer: boolean;
  foreignCitizen: boolean;
  message_form: FormGroup;
  messageStatus: boolean;
  messageForm: boolean;
  NICApplicantStatus: boolean;
  EApplications: any;
  ESupportMessages: any;
  prefix: any;
  fullName: any;
  GovernmentID: any;
  email: any;
  Applications: boolean = true;
  isLoaded: boolean = false;

  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    private accessService: AccessService,
    public toastController: ToastController,
    public http: HttpClient,
    private firestore: AngularFirestore,
    public alertController: AlertController,
    private stripeService: StripeService,
    private route: ActivatedRoute,
    public loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 4000
    });
    await loading.present();
    setTimeout(() => {
      this.isLoaded = true;
    }, 4000);
    this.GovernmentID = this.route.snapshot.queryParams.id;
    this.portalScanner = false;
    // 15 Minutes and logout initiated
    this.kioskUserTimer();
    setTimeout(() => {
      this.navCtrl.navigateForward("home");
    }, 900000);
    await this.firestore
      .collection("eCitizens/")
      .doc(this.GovernmentID)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.prefix = doc.data()["Prefix"];
          this.fullName = doc.data()["Full_Name"];
          this.email = doc.data()["Email"];
          this.GovernmentID = doc.data()["GovernmentID"];
        }
      });
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
      GovernmentID: new FormControl("", Validators.compose([])),
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
          Validators.minLength(10),
          Validators.required,
        ])
      ),
      mobilePhone: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^[0-9]{10}$"),
          Validators.minLength(10),
          Validators.required,
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
  /**
   * Method reposible for sending validated data to google-auth service page for further verfication and uploading to firebase
   * @param value contains validated data from NIC application form
   * Depending the data sent and payment verification process finalises then the system would inform user of the process whether
   * their data was accepts and sent or rejected.
   */
  async sendApplication(value) {
    if (this.validations_form.valid) {
      this.createPaymentIntent(100)
        .pipe(
          switchMap((payment) =>
            this.stripeService.confirmCardPayment(payment.client_secret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.validations_form.get("email").value,
                },
              },
            })
          )
        )
        .subscribe(async (result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            const alert = await this.alertController.create({
              header: "🚫 Application Rejected",
              subHeader: "Application Payment",
              message:
                "Your application has not been sent, try again and make the payment process using card that has credit.",
              buttons: ["OK"],
            });
            await alert.present();
            this.validations_form.reset();
            this.card.element.clear();
            console.log(result.error.message);
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === "succeeded") {
              const alert = await this.alertController.create({
                header: "✅ Application Requested",
                subHeader: "Application Sent",
                message:
                  "Your application has been sent, check Services page for process tracking.",
                buttons: ["OK"],
              });
              await alert.present();
              this.accessService.sendNICApplication(value, this.GovernmentID).then(
                async (res) => {
                  console.log(res);
                  this.validations_form.reset();
                  this.card.element.clear();
                },
                async (err) => {
                  console.log(err);
                }
              );
            }
          }
        });
    } else {
      console.log("Server Error");
    }
  }

  private createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `http://localhost:4242/kiosk-pay-nic`,
      { amount }
    );
  }

  /**
   * Methods reposible for changing form layout for application type, signficant amount of time was spent to digitalise the paper form
   * while adhering to regulations, change data with caution data and variables inter connected within pages and the cloud.
   */
  Application(){
    this.Applications = true;
    this.NICApplicantStatus = false
    this.messageStatus = false;
    this.messageForm = false;
  }
  /**
   * Changes forms for a first time NIC applicant
   */
  firstNICApp() {
    this.NICApplicant = true;
    this.nonFirstTimer = false;
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
   * Closes form from user, designed to hold data during an accidental closure. This was done as large community of users
   * would be using the platform including non IT experts. Recommends simplicity for all future updates.
   */
  exitApplicant() {
    this.NICApplicant = false;
  }
  /**
   * This method is reponsible for retrieving data from Firebase relevant to the user and displaying it
   * Data coming from Firestore is retricted for only the owner with this method, this data is parsed for useful
   * information and displayed for user. (Used for Application Status Tracking)
   */
  async NICStatus() {
    this.Applications = false;
    this.NICApplicantStatus = true;
    this.messageStatus = false;
    this.messageForm = false;
    this.accessService.getEApplications().subscribe((data) => {
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
  private closeMessages() {
    this.messageStatus = false;
  }
  private closeMessageForm() {
    this.messageForm = false;
  }
  private supportCitizen(value) {
    this.accessService
      .sendSupportMessage(value, this.prefix + " " + this.fullName, this.GovernmentID)
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
  eSupport() {
    this.Applications = false;
    this.NICApplicantStatus = false
    this.messageStatus = true;
    this.messageForm = true;
    this.accessService.getESupportMessages(this.GovernmentID).subscribe((data) => {
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
  Refresh(){
    window.location.reload()
  }
 
  kioskUserTimer() {
    // Source refered from https://www.w3schools.com/howto/howto_js_countdown.asp
    let minutes = 15;
    let seconds = 0;
    let SetTime = minutes * 60 + seconds;
    let liveTime = SetTime;
    const convert = (value, seconds) => {
      if (value > seconds) {
        let x = value % seconds;
        liveTime = x;
        return (value - x) / seconds;
      } else {
        return 0;
      }
    };
    const setSeconds = (seconds) => {
      document.querySelector("#seconds").textContent = seconds + "s";
    };
    const setMinutes = (minutes) => {
      document.querySelector("#minutes").textContent = minutes + "m";
    };
    var x = setInterval(() => {
      if (SetTime <= 0) {
        clearInterval(x);
      }
      setMinutes(convert(liveTime, 60));
      setSeconds(liveTime == 60 ? 59 : liveTime);
      SetTime--;
      liveTime = SetTime;
    }, 1000);
  }
  Logout() {
    this.navCtrl.navigateForward("home");
  }
}
