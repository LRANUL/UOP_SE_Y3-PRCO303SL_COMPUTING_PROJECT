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
  NavController,
  ToastController,
  AlertController,
} from "@ionic/angular";

import { AccessService } from "src/app/service/access.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { loadStripe } from "@stripe/stripe-js";

@Component({
  selector: "app-home-affairs",
  templateUrl: "./home-affairs.page.html",
  styleUrls: ["./home-affairs.page.scss"],
})
export class HomeAffairsPage implements OnInit {
  NICApplications: {
    id: string;
    GovernmentID: any;
    fullName: string;
    requestType: any;
    applicationDescription: any;
    applicationStatus: any;
  }[];

  ESupportMessages: {
    id: string;
    GovernmentID: any;
    Subject: any;
    Description: any;
    Status: any;
    Count: any;
  }[];

  newMessage: boolean;
  accountPanel: boolean;
  NICApplication: boolean;
  loadingData: boolean;
  servicesPanel: boolean;
  supportPanel: boolean;
  supportServices: boolean;
  settingsPanel: boolean;
  EWorkLogs: {
    id: string;
    signIn: any;
    signOut: any;
    messagesHandled: any;
    documentsHandled: any;
    date: any;
  }[];
  activityLog: boolean;
  message_form: FormGroup;
  validations_form: FormGroup;
  nic_form: FormGroup;
  NICApplicant: boolean;
  nonFirstTimer: boolean;
  foreignCitizen: boolean;
  constructor(
    private firestore: AngularFirestore,
    private gAuth: AngularFireAuth,
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    private accessService: AccessService,
    public toastController: ToastController,
    public http: HttpClient,
    private route: ActivatedRoute,
    public alertController: AlertController
  ) {}

  async ngOnInit() {
    this.servicesPanel = true;
    this.accessService.getESupportMessages().subscribe((data) => {
      data.map((e) => {
        console.log(e.payload.doc);
        if (e.payload.doc.data()["Status"] == "New") {
          console.log("Unread Messages");
          this.newMessage = true;
        }
      });
    });

    /** Payment Validator */
    var sessionID, GovernmentID;
    sessionID = this.route.snapshot.queryParams.id;
    GovernmentID = this.route.snapshot.queryParams.user;
    if (sessionID) {
      this.validate(sessionID, GovernmentID);
    }

    //  FORM VALIDATORS
    /**
     * Validation Form receives input data sent by the user to Support service
     */
    this.message_form = this.formBuilder.group({
      messageBody: new FormControl("", Validators.compose([])),
      messageID: new FormControl("", Validators.compose([])),
    });

    //  FORM VALIDATORS
    /**
     * Validation Form receives input data sent by the user to Support service
     */
    this.nic_form = this.formBuilder.group({
      fullName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      subject: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
        ])
      ),
      message: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(1),
          Validators.pattern("^^[a-z A-Z\\.\\s]+$"),
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
    ],
  };

  /**
   * Method reposible for validating the payment status connected to server and uses token for validation
   * Complete paymetn process and validation don on secured server
   * @param sessionID contains server send token ID used for validation on pending payments
   */
  validate(sessionID, GovernmentID) {
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
          this.firestore
            .collection("eApplications", (ref) =>
              ref.where("GovernmentID", "==", GovernmentID)
            )
            .doc()
            .set({ payment_status: "paid" }, { merge: true });
        } else if (data == "unpaid") {
          const alert = await this.alertController.create({
            header: "🚫 Application Rejected",
            subHeader: "Application Payment",
            message:
              "Your application has not been sent, try again and make the payment process.",
            buttons: ["OK"],
          });
          await alert.present();
        }
        this.firestore
          .collection("eApplications", (ref) =>
            ref.where("GovernmentID", "==", GovernmentID)
          )
          .doc()
          .delete();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  supportCitizen(value) {
    console.log(value);
    this.accessService.sendMessage(value.messageID, value.messageBody).then(
      async (res) => {
        console.log(res);
        const toast = await this.toastController.create({
          message: "Reponse sent",
          duration: 2000,
        });
        toast.present();
      },
      async (err) => {
        console.log(err);
        const toast = await this.toastController.create({
          message: "Reponse not sent, try again.",
          duration: 2000,
        });
        toast.present();
      }
    );
  }
  openService() {
    this.servicesPanel = true;
    this.supportPanel = false;
    this.settingsPanel = false;
    this.accountPanel = false;
  }
  openSupport() {
    this.servicesPanel = false;
    this.settingsPanel = false;
    this.accountPanel = false;
    this.supportPanel = true;
    this.getSupportMessages();
    this.newMessage = false;
  }
  openAccounts() {
    this.servicesPanel = false;
    this.supportPanel = false;
    this.settingsPanel = false;
    this.accountPanel = true;
  }
  openSettings() {
    this.settingsPanel = true;
    this.servicesPanel = false;
    this.supportPanel = false;
    this.accountPanel = false;
  }
  /**
   * Method responsible for fetching all paid NIC applications to officer
   */
  async getNICApplications() {
    this.loadingData = true;
    this.NICApplication = true;
    setTimeout(() => {
      this.accessService.getEApplications().subscribe((data) => {
        console.log(data);
        this.loadingData = false;

        this.NICApplications = data.map((e) => {
          console.log(e.payload.doc);
          return {
            id: e.payload.doc.id,
            GovernmentID: e.payload.doc.data()["GovernmentID"],
            fullName: e.payload.doc.data()["fullName"],
            requestType: e.payload.doc.data()["requestType"],
            applicationDescription: e.payload.doc.data()["Description"],
            applicationStatus: e.payload.doc.data()["Status"],
            email: e.payload.doc.data()["email"],
            familyName: e.payload.doc.data()["familyName"],
            name: e.payload.doc.data()["name"],
            surname: e.payload.doc.data()["surname"],
            engFamilyName: e.payload.doc.data()["engFamilyName"],
            engName: e.payload.doc.data()["engName"],
            engSurname: e.payload.doc.data()["engSurname"],
            nicFamilyName: e.payload.doc.data()["nicFamilyName"],
            nicName: e.payload.doc.data()["nicName"],
            nicSurname: e.payload.doc.data()["nicSurname"],
            gender: e.payload.doc.data()["gender"],
            civilStatus: e.payload.doc.data()["civilStatus"],
            profession: e.payload.doc.data()["profession"],
            dateOfBirth: e.payload.doc.data()["dateOfBirth"],
            birthCertNo: e.payload.doc.data()["birthCertNo"],
            placeOfBirth: e.payload.doc.data()["placeOfBirth"],
            division: e.payload.doc.data()["division"],
            district: e.payload.doc.data()["district"],
            birthRegNo: e.payload.doc.data()["birthRegNo"],
            countryOfBirth: e.payload.doc.data()["countryOfBirth"],
            foreignCertNo: e.payload.doc.data()["foreignCertNo"],
            city: e.payload.doc.data()["city"],
            houseNo: e.payload.doc.data()["houseNo"],
            houseName: e.payload.doc.data()["houseName"],
            streetName: e.payload.doc.data()["streetName"],
            postalcode: e.payload.doc.data()["postalcode"],
            postcity: e.payload.doc.data()["postcity"],
            posthouseNo: e.payload.doc.data()["posthouseNo"],
            posthouseName: e.payload.doc.data()["posthouseName"],
            poststreetName: e.payload.doc.data()["poststreetName"],
            postpostalcode: e.payload.doc.data()["postpostalcode"],
            certDate: e.payload.doc.data()["certDate"],
            cardNo: e.payload.doc.data()["cardNo"],
            nicDate: e.payload.doc.data()["nicDate"],
            policeName: e.payload.doc.data()["policeName"],
            policeReportDate: e.payload.doc.data()["policeReportDate"],
            homePhone: e.payload.doc.data()["homePhone"],
            mobilePhone: e.payload.doc.data()["mobilePhone"],
          };
        });
      });
    }, 1000);
  }

  /**
   * Methods reposible for changing form layout for application type, signficant amount of time was spent to digitalise the paper form
   * while adhering to regulations, change data with caution data and variables inter connected within pages and the cloud.
   */
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
   * Method reposible for sending validated data to google-auth service page for further verfication and uploading to firebase
   * @param value contains validated data from NIC application form
   * Depending the data sent, verification would inform user of the process whther whether thier data was accepts and sent or rejected.
   */
  async sendApplication(value) {
    // this.accessService.sendNICApplication(value).then(
    //   (res) => {
    //     console.log(res);
    //     this.passAlertNICApp();
    //   },
    //   (err) => {
    //     console.log(err);
    //     this.failAlertNICApp();
    //   }
    // );
    const stripe = await loadStripe(
      "pk_test_51IHSuEA5rKg2mqjLa3Gh3JeEVlSE01Ty1uuLmUAwzSSEISREulbOx3FCTLhLtMcxo5QO3Nno4wPoAPUC7vchjnN500co3fV7M0"
    );

    fetch("http://localhost:4242/officer-pay-nic", {
      method: "POST",
      body: JSON.stringify({
        GovernmentID: value.GovernmentID,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        console.log(session.id);
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
  /**
   * Method for displaying successful validated and verified message requests
   */
  async passAlertMessage() {
    const alert = await this.alertController.create({
      header: "✅ Support Provided",
      subHeader: "Message Sent",
      message: "Your reponse was sent to customer",
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

  /** Methods reposible for loading customer messages to officer screen for reponding */
  async getSupportMessages() {
    this.loadingData = true;
    this.supportServices = true;
    setTimeout(() => {
      this.accessService.getESupportMessages().subscribe((data) => {
        console.log(data);
        this.loadingData = false;
        this.ESupportMessages = data.map((e) => {
          return {
            id: e.payload.doc.id,
            GovernmentID: e.payload.doc.data()["GovernmentID"],
            FullName: e.payload.doc.data()["FullName"],
            Subject: e.payload.doc.data()["Subject"],
            Description: e.payload.doc.data()["Description"],
            Status: e.payload.doc.data()["Status"],
            Count: e.payload.doc.data()["Count"],
          };
        });
      });
    }, 1000);
  }

  /** Method for updating NIC application status  */
  processRequest(GovernmentID) {
    this.accessService.setApplicationToProcessing(GovernmentID);
  }

  /** Method for approving NIC application status  */
  approveRequest(GovernmentID) {
    this.accessService.setApplicationToApproved(GovernmentID);
  }

  /**Method reponsible for working tracking of active hours */
  getWorkLogs() {
    this.activityLog = true;
    setTimeout(() => {
      //  get email from auth
      var Email = "william@homeaffairs.gov.lk";
      this.accessService.getEWorkLogs(Email).subscribe((data) => {
        console.log(data);
        this.EWorkLogs = data.map((e) => {
          return {
            id: e.payload.doc.id,
            signIn: e.payload.doc.data()["signIn"],
            signOut: e.payload.doc.data()["signOut"],
            messagesHandled: e.payload.doc.data()["messagesHandled"],
            documentsHandled: e.payload.doc.data()["documentsHandled"],
            date: e.payload.doc.data()["date"],
          };
        });
      });
    }, 1000);
  }
  /** Close Application View */
  exitApp() {
    console.log(this.NICApplication);
    this.NICApplication = false;
  }
  /**Logs out Officer */
  async logoutOfficer() {
    this.accessService.logoutOfficer();
  }
}
