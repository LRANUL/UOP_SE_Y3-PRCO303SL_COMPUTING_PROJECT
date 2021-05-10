/**
 * CONTAINS CORE CLASS CODE FOR OFFICER FUNCTIONALITY
 */
import { Component, OnInit, ViewChild } from "@angular/core";
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
  ModalController,
} from "@ionic/angular";
import * as firebase from "firebase";
import { LoadingController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AccessService } from "src/app/service/access.service";
import { HttpClient } from "@angular/common/http";
import { StripeService, StripeCardNumberComponent } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from "@stripe/stripe-js";
import { Observable } from "rxjs";
import { GuidePage } from "../guide/guide.page";
import * as CryptoJS from "crypto-js";
import * as dateFormat from "dateformat";

let qrResultString: string;
@Component({
  selector: "app-home-affairs",
  templateUrl: "./home-affairs.page.html",
  styleUrls: ["./home-affairs.page.scss"],
})
export class HomeAffairsPage implements OnInit {
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

  scannedData: string;
  portalScanner: boolean;
  eCitizenScanData: boolean;
  scanner: boolean;
  eCitizenSearchData: boolean;
  scannedCardData: {
    id: string;
    Prefix: string;
    Full_Name: string;
    homeAddress: string;
    officeAddress: string;
    scanECitizenIMG: string;
    landLine: string;
    mobile: string;
    status: string;
    email: string;
    scanECitizenGovernmentID: string;
  }[];
  searchECitizenData: {
    id: string;
    Prefix: string;
    Full_Name: string;
    homeAddress: string;
    officeAddress: string;
    scanECitizenIMG: string;
    landLine: string;
    mobile: string;
    status: string;
    email: string;
    searchECitizenGovernmentID: string;
  }[];
  NICApplicantStatus: boolean;
  NICApplicationStatus: {
    id: string;
    GovernmentID: string;
    requestType: string;
    name: string;
    familyName: string;
    assigneeName: string;
    applicationDescription: string;
    applicationStatus: string;
    payment_status: string;
    receivedTime: string;
    processedTime: string;
    approvedTime: string;
    PhotoURL: string;
  }[];
  supportTechServices: boolean;
  prefix: string;
  fullName: string;
  officeAddress: string;
  mobile: string;
  Division: string;
  Email: string;
  clearResult(): void {
    qrResultString = null;
  }

  onCodeResult(resultString: string) {
    qrResultString = resultString;
  }
  NICApplications: {
    id: string;
    GovernmentID: string;
    fullName: string;
    requestType: string;
    applicationDescription: string;
    applicationStatus: string;
  }[];
  userFilter: any;
  userRecords: any;
  applicationFilter: any;
  ESupportMessages: {
    id: string;
    GovernmentID: string;
    Subject: string;
    Description: string;
    Status: string;
    Count: number;
  }[];
  ETechSupportMessages: {
    Techid: string;
    TechEmail: string;
    TechSubject: string;
    TechDescription: string;
    TechStatus: string;
    TechResponse: string;
    TechCount: number;
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
    signIn: string;
    signOff: string;
    messagesHandled: number;
    documentsHandled: number;
    date: string;
  }[];
  activityLog: boolean;
  message_form: FormGroup;
  validations_form: FormGroup;
  nic_form: FormGroup;
  NICApplicant: boolean;
  nonFirstTimer: boolean;
  foreignCitizen: boolean;
  handler: any;
  ECitizens: {
    uid: string;
    name: string;
    photo: string;
    governmentID: string;
    dateofBirth: string;
  }[];
  accountManage: boolean;
  verifyPanel: boolean;
  constructor(
    public formBuilder: FormBuilder,
    private accessService: AccessService,
    public toastController: ToastController,
    public http: HttpClient,
    private firestore: AngularFirestore,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private stripeService: StripeService,
    private modelCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.portalScanner = true;
    this.servicesPanel = true;
    this.accessService.getETechSupportMessages().subscribe((data) => {
      data.map((e) => {
        // console.log(e.payload.doc);
        if (e.payload.doc.data()["Status"] == "New") {
          // console.log("Unread Messages");
          this.newMessage = true;
        }
      });
    });
    this.accessService.getESupportMessages().subscribe((data) => {
      data.map((e) => {
        // console.log(e.payload.doc);
        if (e.payload.doc.data()["Status"] == "New") {
          // console.log("Unread Messages");
          this.newMessage = true;
        }
      });
    });
    let user = firebase.default.auth().currentUser;

    await this.firestore
      .collection("eAdministration")
      .doc(user.email)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.prefix = doc.data()["Prefix"];
          this.fullName = doc.data()["Full_Name"];
          this.officeAddress = doc.data()["officeAddress"];
          this.mobile = doc.data()["mobile"];
          this.Division = doc.data()["Division"];
          this.Email = user.email;
        }
      });
    //  FORM VALIDATORS
    /**
     * Validation Form receives input data sent by the user to Support service
     */
    this.message_form = this.formBuilder.group({
      messageBody: new FormControl("", Validators.compose([])),
      message: new FormControl("", Validators.compose([])),
      subject: new FormControl("", Validators.compose([])),
    });

    //  FORM VALIDATORS
    /**
     * Validation Form receives input data sent by the user to Support service
     */
    this.nic_form = this.formBuilder.group({
      fullName: new FormControl(
        "",
        Validators.compose([Validators.pattern("^^[a-z A-Z\\.\\s]+$")])
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
   * Method for sending support for eCitizens
   * @param value form message body
   * @param ID Government ID
   */
  supportCitizen(value, ID) {
    let message = value.messageBody;
    this.message_form.reset();
    this.accessService.sendMessage(ID, message).then(
      async (res) => {
        const toast = await this.toastController.create({
          message: "Reponse sent",
          duration: 2000,
        });
        toast.present();
      },
      async (err) => {
        const toast = await this.toastController.create({
          message: "Reponse not sent, try again.",
          duration: 2000,
        });
        toast.present();
      }
    );
  }
  /**
   * Method for sending technical support
   */
  requestSupport(value) {
    this.message_form.reset();
    this.accessService.techSupport(value).then(
      async (res) => {
        const toast = await this.toastController.create({
          message: "Reponse sent",
          duration: 2000,
        });
        toast.present();
      },
      async (err) => {
        const toast = await this.toastController.create({
          message: "Reponse not sent, try again. ",
          duration: 2000,
        });
        toast.present();
      }
    );
  }
  /** Method for Scanning cards for vertification */
  scanCard() {
    this.eCitizenScanData = true;
    this.eCitizenSearchData = false;
    // Activates Recognision and Camera
    this.portalScanner = true;
    this.scanner = true;
    setTimeout(() => {
      this.scanner = false;
      this.portalScanner = false;
      setTimeout(async () => {
        if (qrResultString) {
          this.accessService
            .getECitizenByCard(qrResultString)
            .subscribe(async (data) => {
              console.log(data);
              if (data.length == 0) {
                const toast = await this.toastController.create({
                  message: "Card Fraud | Invalid Card",
                  duration: 2000,
                });
                toast.present();
              }
              data.map(async (e) => {
                let bioData = e.payload.doc.data()["Biometric_Data"];
                let GovernmentID = e.payload.doc.data()["GovernmentID"];
                let MatchID = CryptoJS.AES.decrypt(
                  qrResultString,
                  bioData
                ).toString(CryptoJS.enc.Utf8);
                if (MatchID == GovernmentID) {
                  const toast = await this.toastController.create({
                    message: "Card Valid",
                    duration: 2000,
                  });
                  toast.present();
                  this.scannedCardData = data.map((e) => {
                    return {
                      id: e.payload.doc.id,
                      Prefix: e.payload.doc.data()["Prefix"],
                      Full_Name: e.payload.doc.data()["Full_Name"],
                      homeAddress: e.payload.doc.data()["homeAddress"],
                      officeAddress: e.payload.doc.data()["officeAddress"],
                      scanECitizenIMG: e.payload.doc.data()["downloadURL"],
                      landLine: e.payload.doc.data()["landLine"],
                      mobile: e.payload.doc.data()["mobile"],
                      status: e.payload.doc.data()["status"],
                      email: e.payload.doc.data()["Email"],
                      scanECitizenGovernmentID: e.payload.doc.data()[
                        "GovernmentID"
                      ],
                    };
                  });
                }
              });
            });
        } else if (!qrResultString) {
          const toast = await this.toastController.create({
            message: "Card not found to scanner, try again.",
            duration: 2000,
          });
          toast.present();
        }
      }, 1000);
    }, 10000);
    /** Clears fetched data */
    setTimeout(() => {
      this.scannedCardData = [];
    }, 25000);
  }
  /**
   * Method for retreving all eCitizens
   */
  searchECitizen() {
    this.eCitizenSearchData = true;
    this.eCitizenScanData = false;
    this.accessService.getECitizens().subscribe((data) => {
      this.searchECitizenData = data.map((e) => {
        // console.log(e.payload.doc);
        return {
          id: e.payload.doc.id,
          Prefix: e.payload.doc.data()["Prefix"],
          Full_Name: e.payload.doc.data()["Full_Name"],
          homeAddress: e.payload.doc.data()["homeAddress"],
          officeAddress: e.payload.doc.data()["officeAddress"],
          scanECitizenIMG: e.payload.doc.data()["downloadURL"],
          landLine: e.payload.doc.data()["landLine"],
          mobile: e.payload.doc.data()["mobile"],
          email: e.payload.doc.data()["Email"],
          status: e.payload.doc.data()["status"],
          searchECitizenGovernmentID: e.payload.doc.data()["GovernmentID"],
        };
      });
    });
  }
  /**
   * Method for finding eCitizen by ID
   * @param value contains Government Portal ID
   */
  findECitizenByID(value) {
    if (value == "") {
      this.searchECitizen();
    } else {
      this.accessService.getECitizenbyID(value).subscribe((data) => {
        this.searchECitizenData = data.map((e) => {
          console.log(e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            Prefix: e.payload.doc.data()["Prefix"],
            Full_Name: e.payload.doc.data()["Full_Name"],
            homeAddress: e.payload.doc.data()["homeAddress"],
            officeAddress: e.payload.doc.data()["officeAddress"],
            scanECitizenIMG: e.payload.doc.data()["downloadURL"],
            landLine: e.payload.doc.data()["landLine"],
            mobile: e.payload.doc.data()["mobile"],
            status: e.payload.doc.data()["status"],
            email: e.payload.doc.data()["Email"],
            searchECitizenGovernmentID: e.payload.doc.data()["GovernmentID"],
          };
        });
      });
    }
  }
  /** Methods for Tabs Handling */
  openService() {
    this.servicesPanel = true;
    this.supportPanel = false;
    this.settingsPanel = false;
    this.accountPanel = false;
    this.verifyPanel = false;
  }
  openSupport() {
    this.servicesPanel = false;
    this.settingsPanel = false;
    this.accountPanel = false;
    this.supportPanel = true;
    this.getSupportMessages();
    this.newMessage = false;
    this.verifyPanel = false;
  }
  openAccounts() {
    this.servicesPanel = false;
    this.supportPanel = false;
    this.settingsPanel = false;
    this.verifyPanel = false;
    this.accountPanel = true;
  }
  openSettings() {
    this.settingsPanel = true;
    this.servicesPanel = false;
    this.supportPanel = false;
    this.accountPanel = false;
    this.verifyPanel = false;
  }
  openVerifier() {
    this.verifyPanel = true;
    this.settingsPanel = false;
    this.servicesPanel = false;
    this.supportPanel = false;
    this.accountPanel = false;
  }
  /**
   * Method responsible for fetching all paid NIC applications to officer
   */
  async getNICApplications() {
    this.loadingData = true;
    this.NICApplicantStatus = false;
    this.NICApplication = true;
    setTimeout(() => {
      this.accessService.getEApplications().subscribe((data) => {
        // console.log(data);
        this.loadingData = false;

        this.NICApplications = data.map((e) => {
          // console.log(e.payload.doc);
          return {
            id: e.payload.doc.id,
            GovernmentID: e.payload.doc.data()["GovernmentID"],
            status: e.payload.doc.data()["status"],
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
            photoURL: e.payload.doc.data()["photoURL"],
          };
        });
      });
    }, 1000);
  }
  exitStatus() {
    this.NICApplicantStatus = false;
  }
  /**Retriving list of NIC applications */
  getNICApplicationStatus() {
    this.NICApplicantStatus = true;
    this.NICApplication = false;
    this.accessService.getEApplicationStatus().subscribe((data) => {
      // console.log(data);
      this.loadingData = false;

      this.NICApplicationStatus = data.map((e) => {
        // console.log(e.payload.doc);
        return {
          id: e.payload.doc.id,
          GovernmentID: e.payload.doc.data()["GovernmentID"],
          requestType: e.payload.doc.data()["requestType"],
          name: e.payload.doc.data()["name"],
          familyName: e.payload.doc.data()["familyName"],
          assigneeName: e.payload.doc.data()["division"],
          applicationDescription: e.payload.doc.data()["description"],
          applicationStatus: e.payload.doc.data()["status"],
          payment_status: e.payload.doc.data()["payment_status"],
          receivedTime: e.payload.doc.data()["sentTimeStamp"],
          processedTime: e.payload.doc.data()["processedTimeStamp"],
          approvedTime: e.payload.doc.data()["approvedTimeStamp"],
          PhotoURL: e.payload.doc.data()["photoURL"],
        };
      });
    });
  }
  /**Finding eApplications */
  findEApplication(value) {
    if (value == "") {
      this.getNICApplicationStatus();
    } else {
      this.accessService.getEApplicationStatusByID(value).subscribe((data) => {
        // console.log(data);
        this.loadingData = false;

        this.NICApplicationStatus = data.map((e) => {
          // console.log(e.payload.doc);
          return {
            id: e.payload.doc.id,
            GovernmentID: e.payload.doc.data()["GovernmentID"],
            requestType: e.payload.doc.data()["requestType"],
            name: e.payload.doc.data()["name"],
            familyName: e.payload.doc.data()["familyName"],
            assigneeName: e.payload.doc.data()["assigneeName"],
            applicationDescription: e.payload.doc.data()[
              "applicationDescription"
            ],
            applicationStatus: e.payload.doc.data()["applicationStatus"],
            payment_status: e.payload.doc.data()["payment_status"],
            receivedTime: e.payload.doc.data()["receivedTime"],
            processedTime: e.payload.doc.data()["processedTime"],
            approvedTime: e.payload.doc.data()["approvedTime"],
            PhotoURL: e.payload.doc.data()["photoURL"],
          };
        });
      });
    }
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
   * Manages eCitizens accounts
   */
  manageAccount() {
    this.accountManage = true;
    this.accessService.getECitizens().subscribe((data) => {
      this.ECitizens = data.map((e) => {
        return {
          uid: e.payload.doc.data()["uid"],
          name: e.payload.doc.data()["Full_Name"],
          photo: e.payload.doc.data()["downloadURL"],
          governmentID: e.payload.doc.data()["GovernmentID"],
          status: e.payload.doc.data()["status"],
          dateofBirth: e.payload.doc.data()["Date_Of_Birth"],
        };
      });
    });
  }
  /**
   * Closes eCitizen manager
   */
  exitECitizenManager() {
    this.accountManage = false;
  }
  /** Method for finding ecitizens */
  findECitizen(value) {
    if (value == "") {
      this.manageAccount();
    } else {
      this.accessService.getECitizen(value).subscribe((data) => {
        this.ECitizens = data.map((e) => {
          return {
            uid: e.payload.doc.data()["uid"],
            name: e.payload.doc.data()["Full_Name"],
            photo: e.payload.doc.data()["downloadURL"],
            governmentID: e.payload.doc.data()["GovernmentID"],
            status: e.payload.doc.data()["status"],
            dateofBirth: e.payload.doc.data()["Date_Of_Birth"],
          };
        });
      });
    }
  }
  /** Method for account PIN update */
  async updateAccessPIN(governmentID, citizenDateofBirth) {
    const verifyAlert = await this.alertController.create({
      header: "Citizen Verification",
      inputs: [
        {
          name: "dateOfBirth",
          type: "text",
          placeholder: "Eg: 01/12/2020",
        },
      ],
      message: "Provide Citizen Data of Birth for verification",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: "Check",
          handler: async (alertData) => {
            if (citizenDateofBirth === alertData.dateOfBirth) {
              let Access_PIN = Math.floor(Math.random() * 9000000 + 1000000);
              this.accessService.updateECitizenAccessPIN(
                Access_PIN,
                governmentID
              );
              const alertSuccess = await this.alertController.create({
                header: "Access PIN Updated ✔",
                message: governmentID + " Access PIN has been updated",
                buttons: [
                  {
                    text: "View PIN",
                    handler: async () => {
                      const alert = await this.alertController.create({
                        header: "Access PIN: " + Access_PIN,
                        buttons: ["CLOSE"],
                      });
                      await alert.present();
                    },
                  },
                  {
                    text: "OK",
                  },
                ],
              });
              await alertSuccess.present();
            } else {
              const alertFail = await this.alertController.create({
                header: "Wrong Date of Birth ❌",
                message: "Provide Date of Birth doesn't match citizen record!",
                buttons: ["Close"],
              });
              await alertFail.present();
            }
          },
        },
      ],
    });
    await verifyAlert.present();
  }
  /** Method for account activation */
  activateAccount(user, governmentID) {
    this.http
      .get(
        "https://government-portal-firebase.herokuapp.com/activate-user?uid=" +
          user
      )
      .subscribe(
        async (data) => {
          // console.log(data);
          this.accessService.activateECitizen(governmentID);
          const alert = await this.alertController.create({
            header: "Account Activated ✔",
            message: governmentID + " has been activate",
            buttons: ["OK"],
          });
          await alert.present();
        },
        async (error) => {
          // console.log(error);
          const alert = await this.alertController.create({
            header: "🚫 Out of Service",
            subHeader: "Server Access Timeout",
            message:
              "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later or contact administrator",
            buttons: ["OK"],
          });
          await alert.present();
        }
      );
  }

  disableAccount(user, governmentID) {
    this.http
      .get(
        "https://government-portal-firebase.herokuapp.com/disable-user?uid=" +
          user
      )
      .subscribe(
        async (data) => {
          // console.log(data);
          this.accessService.disableECitizen(governmentID);
          const alert = await this.alertController.create({
            header: "Account Disabled ✔",
            message: governmentID + " has been disabled",
            buttons: ["OK"],
          });
          await alert.present();
        },
        async (error) => {
          // console.log(error);
          const alert = await this.alertController.create({
            header: "🚫 Out of Service",
            subHeader: "Server Access Timeout",
            message:
              "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later or contact administrator",
            buttons: ["OK"],
          });
          await alert.present();
        }
      );
  }

  deleteAccount(user, governmentID) {
    this.http
      .get(
        "https://government-portal-firebase.herokuapp.com/delete-user?uid=" +
          user
      )
      .subscribe(
        async (data) => {
          // console.log(data);
          this.accessService.deleteECitizen(governmentID);
          const alert = await this.alertController.create({
            header: "Account Deleted ✔",
            message: governmentID + " has been delete",
            buttons: ["OK"],
          });
          await alert.present();
        },
        async (error) => {
          // console.log(error);
          const alert = await this.alertController.create({
            header: "🚫 Out of Service",
            subHeader: "Server Access Timeout",
            message:
              "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later or contact administrator",
            buttons: ["OK"],
          });
          await alert.present();
        }
      );
  }

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
            let dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
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
                          let photoURL =
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
      `https://government-portal-stripe.herokuapp.com/officer-pay-nic`,
      { amount }
    );
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
        "Your message has not been sent, Try again later or contact administrator.",
      buttons: ["OK"],
    });

    await alert.present();
  }

  /** Methods reposible for loading customer messages to officer screen for reponding */
  async getSupportMessages() {
    this.loadingData = true;
    this.supportServices = true;
    this.supportTechServices = true;
    setTimeout(() => {
      this.accessService.getETechSupportMessages().subscribe((data) => {
        // console.log(data);
        this.loadingData = false;
        this.ETechSupportMessages = data.map((e) => {
          return {
            Techid: e.payload.doc.id,
            TechEmail: e.payload.doc.data()["Email"],
            TechSubject: e.payload.doc.data()["Subject"],
            TechDescription: e.payload.doc.data()["Description"],
            TechResponse: e.payload.doc.data()["Response"],
            TechStatus: e.payload.doc.data()["Status"],
            TechType: e.payload.doc.data()["Type"],
            TechCount: e.payload.doc.data()["Count"],
          };
        });
      });
      this.accessService.getESupportMessages().subscribe((data) => {
        // console.log(data);
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

  /** Method for approving NIC application status  */
  async declineRequest(GovernmentID) {
    const alert = await this.alertController.create({
      header: "Select Reason",
      cssClass: "applicationDecline",
      inputs: [
        {
          name: "IncorrectData",
          type: "radio",
          label: "Form Not Valid",
          value:
            "Form Not Valid / Incorrect|පෝරමය වලංගු නොවේ / වැරදිය|படிவம் செல்லுபடியாகாது / தவறானது",
        },
        {
          name: "PhoneFailed",
          type: "radio",
          label: "Phone Verification Failed",
          value:
            "Phone Verification Failed|දුරකථන සත්‍යාපනය අසාර්ථක විය|தொலைபேசி சரிபார்ப்பு தோல்வியுற்றது",
        },
        {
          name: "FakeData",
          type: "radio",
          label: "Form Data Mismatch",
          value:
            "Form Data Mismatch / Third Party Attempt|ආකෘති නොගැලපීම / තෙවන පාර්ශවීය උත්සාහය|படிவம் தரவு பொருந்தாதது / மூன்றாம் தரப்பு முயற்சி",
        },
        {
          name: "photoFail",
          type: "radio",
          label: "Photo Mismatch",
          value:
            "Photo Mismatch / Third Party Attempt|ඡායාරූප නොගැලපීම / තෙවන පාර්ශවීය උත්සාහය|புகைப்பட பொருத்தமின்மை / மூன்றாம் தரப்பு முயற்சி ",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            // console.log("Confirm Cancel");
          },
        },
        {
          text: "Ok",
          handler: (Reason) => {
            if (Reason) {
              // console.log(Reason);
              this.accessService.setApplicationToDeclined(GovernmentID, Reason);
            }
          },
        },
      ],
    });

    await alert.present();
  }
  /** Method for marking tech support as read */
  markSupportRead(id) {
    this.accessService.markTechMessageRead(id);
  }

  /**Method reponsible for working tracking of active hours */
  getWorkLogs() {
    this.activityLog = true;
    setTimeout(async () => {
      let user = firebase.default.auth().currentUser;
      let Email = user.email;
      (await this.accessService.getEWorkLogs(Email)).subscribe((data) => {
        // console.log(data);
        this.EWorkLogs = data.map((e) => {
          return {
            id: e.payload.doc.id,
            signIn: e.payload.doc.data()["signIn"],
            signOff: e.payload.doc.data()["signOff"],
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
    // console.log(this.NICApplication);
    this.NICApplication = false;
  }
  /** Opens guide for eAdministrator */
  async openGuide() {
    const Guide = this.modelCtrl.create({
      component: GuidePage,
    });
    return await (await Guide).present();
  }
  /** Signing of Officer at Work */
  async signtoWork() {
    this.accessService.signIn();
    const toast = await this.toastController.create({
      message: "Checked in to Office",
      duration: 2000,
    });
    toast.present();
  }
  /** Signing of Officer from Work */
  async signOffWork() {
    this.accessService.signOff();
    const toast = await this.toastController.create({
      message: "Checked out of Office",
      duration: 2000,
    });
    toast.present();
  }
  /**Logs out Officer */
  async logoutOfficer() {
    const loading = await this.loadingController.create({
      message: "Logging out...",
    });
    await loading.present();
    this.accessService.logoutOfficer().then(
      async (res) => {
        // console.log(res);
        loading.dismiss();
      },
      async (err) => {
        loading.dismiss();
        let user = firebase.default.auth().currentUser;
        let date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);

        await eAdministration.set(
          {
            Login: firebase.default.firestore.FieldValue.arrayUnion(
              "officer failed logout attempt from " +
                user.email +
                " at: " +
                new Date()
            ),
          },
          { merge: true }
        );
      }
    );
    // Automated Checkout during signout | Not to implement with sign as auth may recheck user status effecting work records
    this.accessService.signOff();
    const toast = await this.toastController.create({
      message: "Checked out of Office",
      duration: 2000,
    });
    toast.present();
    // Clear cache variables
    this.prefix = null;
    this.fullName = null;
    this.officeAddress = null;
    this.mobile = null;
    this.Division = null;
    this.Email = null;
  }
}
