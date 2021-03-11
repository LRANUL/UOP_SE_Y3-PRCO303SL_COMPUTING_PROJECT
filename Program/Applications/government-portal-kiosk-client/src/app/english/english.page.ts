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
import { LoadingController } from "@ionic/angular";
import * as dateFormat from "dateformat";

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
      message: "Please wait...",
      duration: 4000,
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
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      subject: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(10),
          Validators.pattern("^([ \u00c0-\u01ffa-zA-Z0-9'-])+$"),
        ])
      ),
      message: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(10),
          Validators.pattern("^([ \u00c0-\u01ffa-zA-Z0-9'-])+$"),
        ])
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
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      name: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      surname: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      engFamilyName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      engName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      engSurname: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      nicFamilyName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      nicName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      nicSurname: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      gender: new FormControl("", Validators.compose([Validators.required])),
      GovernmentID: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(12),
          Validators.pattern("^([ 0-9a-zA-Z])+$"),
        ])
      ),
      civilStatus: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      profession: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(5),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      dateOfBirth: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      placeOfBirth: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(5),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      division: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(7),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      district: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(7),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      birthRegNo: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([0-9])+$"),
          Validators.maxLength(6),
        ])
      ),
      birthCertNo: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([0-9])+$"),
          Validators.maxLength(6),
        ])
      ),
      countryOfBirth: new FormControl(
        "",
        Validators.compose([Validators.pattern("^([ a-zA-Z])+$")])
      ),
      NICType: new FormControl("", Validators.compose([])),
      foreignCertNo: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([0-9])+$"),
          Validators.maxLength(6),
        ])
      ),
      city: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(7),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      houseNo: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^([ \u00c0-\u01ffa-zA-Z0-9'-])+$"),
          Validators.maxLength(6),
        ])
      ),
      houseName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(7),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      streetName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(7),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      postalcode: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^([0-9])+$"),
          Validators.maxLength(6),
        ])
      ),
      postcity: new FormControl(
        "",
        Validators.compose([Validators.pattern("^([ a-zA-Z])+$")])
      ),
      posthouseNo: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^([ \u00c0-\u01ffa-zA-Z0-9'-])+$"),
          Validators.maxLength(6),
        ])
      ),
      posthouseName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(7),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      poststreetName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(7),
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      postpostalcode: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^([0-9])+$"),
          Validators.maxLength(6),
        ])
      ),
      certDate: new FormControl("", Validators.compose([])),
      cardNo: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.pattern("^([0-9])+$"),
          Validators.maxLength(6),
        ])
      ),
      nicDate: new FormControl("", Validators.compose([])),
      policeName: new FormControl(
        "",
        Validators.compose([Validators.pattern("^([ a-zA-Z])+$")])
      ),
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
    ],fullName: [
      {
        type: "pattern",
        message: "Invalid Name.",
      },
    ],subject: [
      {
        type: "pattern",
        message: "Invalid Subject.",
      },
    ],message: [
      {
        type: "pattern",
        message: "Invalid Message Format.",
      },
    ],
  };
  //  Validation Form
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
    registarDivision: [
      {
        type: "pattern",
        message: "Invalid name for division.",
      },
    ],
    fullName: [
      {
        type: "pattern",
        message: "Invalid Name.",
      },
    ],
    familyName: [
      {
        type: "pattern",
        message: "Invalid Name.",
      },
    ],
    name: [
      {
        type: "pattern",
        message: "Invalid Name.",
      },
    ],
    mobilePhone: [
      {
        type: "pattern",
        message: "Invalid mobile number.",
      },
    ],
    homePhone: [
      {
        type: "pattern",
        message: "Invalid landline number.",
      },
    ],
    policeName: [
      {
        type: "pattern",
        message: "Invalid Police Station name.",
      },
    ],
    cardNo: [
      {
        type: "pattern",
        message: "Invalid NIC card number",
      },
    ],
    postpostalcode: [
      {
        type: "pattern",
        message: "Invalid Postal Code.",
      },
    ],
    gender: [
      {
        type: "pattern",
        message: "Invalid Gender.",
      },
    ],
    houseName: [
      {
        type: "pattern",
        message: "Invalid House Name.",
      },
    ],
    certDate: [
      {
        type: "pattern",
        message: "Invalid Certificate Date.",
      },
    ],
    surname: [
      {
        type: "pattern",
        message: "Invalid Surname",
      },
    ],
    engFamilyName: [
      {
        type: "pattern",
        message: "Invalid Family Name",
      },
    ],
    engName: [
      {
        type: "pattern",
        message: "Invalid Name.",
      },
    ],
    engSurname: [
      {
        type: "pattern",
        message: "Invalid Surname.",
      },
    ],
    nicFamilyName: [
      {
        type: "pattern",
        message: "Invalid Family Name.",
      },
    ],
    nicName: [
      {
        type: "pattern",
        message: "Invalid Name for NIC.",
      },
    ],
    nicSurname: [
      {
        type: "pattern",
        message: "Invalid Surname for NIC.",
      },
    ],
    civilStatus: [
      {
        type: "pattern",
        message: "Invalid Civil Status.",
      },
    ],
    profession: [
      {
        type: "pattern",
        message: "Invalid Name for Profession.",
      },
    ],
    dateOfBirth: [
      {
        type: "pattern",
        message: "Invalid Date of Birth.",
      },
    ],
    placeOfBirth: [
      {
        type: "pattern",
        message: "Invalid place of birth.",
      },
    ],
    division: [
      {
        type: "pattern",
        message: "Invalid division name",
      },
    ],
    district: [
      {
        type: "pattern",
        message: "Invalid district name.",
      },
    ],
    birthRegNo: [
      {
        type: "pattern",
        message: "Invalid birth registration number.",
      },
    ],
    birthCertNo: [
      {
        type: "pattern",
        message: "Invalid birth certificate number.",
      },
    ],
    countryOfBirth: [
      {
        type: "pattern",
        message: "Invalid Country of Birth.",
      },
    ],
    NICType: [
      {
        type: "pattern",
        message: "Invalid Type for NIC.",
      },
    ],
    foreignCertNo: [
      {
        type: "pattern",
        message: "Invalid Certificate Number.",
      },
    ],
    city: [
      {
        type: "pattern",
        message: "Invalid name for city.",
      },
    ],
    houseNo: [
      {
        type: "pattern",
        message: "Invalid House Number",
      },
    ],
    streetName: [
      {
        type: "pattern",
        message: "Invalid name for street.",
      },
    ],
    postalcode: [
      {
        type: "pattern",
        message: "Invalid postcode for city.",
      },
    ],
    postcity: [
      {
        type: "pattern",
        message: "Invalid name for city.",
      },
    ],
    posthouseNo: [
      {
        type: "pattern",
        message: "Invalid number for house.",
      },
    ],
    posthouseName: [
      {
        type: "pattern",
        message: "Invalid name for house.",
      },
    ],
    poststreetName: [
      {
        type: "pattern",
        message: "Invalid name for street.",
      },
    ],
    nicDate: [
      {
        type: "pattern",
        message: "Invalid date for NIC.",
      },
    ],
    policeReportDate: [
      {
        type: "pattern",
        message: "Invalid date for police report.",
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
      this.firestore
        .collection("BirthRegistrations")
        .doc("" + value.birthCertNo + "")
        .ref.get()
        .then(async (doc) => {
          // console.log(doc.data());
          if (doc.exists) {
            var dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
            // console.log(value);
            if (
              doc.data()["birthRegNo"] == value.birthCertNo &&
              doc.data()["gender"] == value.gender.toUpperCase() &&
              doc.data()["dateOfBirth"] == dateBirth
            ) {
              const loading = await this.loadingController.create({
                message: "Please wait, payment is being processed...",
              });
              await loading.present();
              this.createPaymentIntent(100)
                .pipe(
                  switchMap((payment) =>
                    this.stripeService.confirmCardPayment(
                      payment.client_secret,
                      {
                        payment_method: {
                          card: this.card.element,
                          billing_details: {
                            name: this.validations_form.get("email").value,
                          },
                        },
                      }
                    )
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
                    await loading.dismiss();
                    // console.log(result.error.message);
                  } else if (result.paymentIntent.status === "succeeded") {
                    /** Applicant Photo taken before submission */
                    // console.log("Paid");
                    this.accessService
                      .getECitizensPhoto(value.GovernmentID)
                      .subscribe((data) => {
                        data.map(async (e) => {
                          var photoURL =
                            "" + e.payload.doc.data()["downloadURL"];
                          console.log(photoURL);
                          this.accessService
                            .sendNICApplication(value, photoURL)
                            .then(
                              async (res) => {
                                // console.log(res);
                                // console.log("Done");
                                this.validations_form.reset();
                                this.card.element.clear();
                                await loading.dismiss();
                                this.NICApplicant = false;
                              },
                              async (err) => {
                                // console.log(err);
                              }
                            );
                        });
                      });
                  }
                });
            } else {
              /**
               * Informs applicant that the details dont't match with records to proceed further
               */
              const alert = await this.alertController.create({
                header: "⚠ Application Not Sent",
                subHeader: "Registration Details !",
                message:
                  "Your application has not been sent, as the entered details does not your match records.",
                buttons: ["Retry"],
              });
              await alert.present();
            }
          } else {
            /**
             * Informs applicant that the Birth Registration number is invalid to proceed further
             * This logic condition is set to prevent malicous use of system for unauthorised businesses
             */
            const alert = await this.alertController.create({
              header: "⚠ Application Not Sent !",
              subHeader: "Birth Registration",
              message:
                "Your application has not been sent, as your details does not match any records.",
              buttons: ["Close"],
            });
            await alert.present();
          }
        });
    }
  }

  private createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `https://government-portal-stripe.herokuapp.com/kiosk-pay-nic`,
      { amount }
    );
  }

  /**
   * Methods reposible for changing form layout for application type, signficant amount of time was spent to digitalise the paper form
   * while adhering to regulations, change data with caution data and variables inter connected within pages and the cloud.
   */
  Application() {
    this.Applications = true;
    this.NICApplicantStatus = false;
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
        // console.log(e.payload.doc.data()["requestType"]);
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
      .sendSupportMessage(
        value,
        this.prefix + " " + this.fullName,
        this.GovernmentID
      )
      .then(
        (res) => {
          // console.log(res);
          this.passAlertMessage();
        },
        (err) => {
          // console.log(err);
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
    this.NICApplicantStatus = false;
    this.messageStatus = true;
    this.messageForm = true;
    this.accessService
      .getESupportMessages(this.GovernmentID)
      .subscribe((data) => {
        // console.log(data);
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
  Refresh() {
    window.location.reload();
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
