import { Component, OnInit } from "@angular/core";
import { AccessService } from "src/app/service/access.service";
import { HttpClient } from "@angular/common/http";
import {
  ToastController,
  AlertController,
  ModalController,
  LoadingController,
} from "@ionic/angular";
import * as firebase from "firebase";
import { AngularFirestore } from "@angular/fire/firestore";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import {
  AngularFireStorage,
  AngularFireUploadTask,
  AngularFireStorageReference,
} from "@angular/fire/storage";
import { Observable, ReplaySubject } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.page.html",
  styleUrls: ["./admin.page.scss"],
})
export class AdminPage implements OnInit {
  accountPanel: boolean;
  userFilter: string;
  userRecords: any;
  accountManage: boolean;
  user: any;
  statisticsPanel: boolean;
  settingsPanel: boolean;
  activityLog: boolean;
  EWorkLogs: {
    id: string;
    signIn: any;
    signOff: any;
    messagesHandled: any;
    accountsHandled: any;
    date: any;
  }[];
  message_form: any;
  newMessage: boolean;
  supportPanel: boolean;
  supportServices: boolean;
  loadingData: boolean;
  ETechSupportMessages: { id: string; Email: any; Subject: any; Description: any; Status: any; Type: any; Count: any; }[];
  prefix: any;
  fullName: any;
  officeAddress: any;
  mobile: any;
  Division: any;
  Email: string;
  imageURL = "";
  CollectionPath = "/Users/eAdministrators";
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;
  progress: Observable<number>;
  registration_form: FormGroup;
  errorMessage: string;
  accountCreate: boolean;
  system_maintenance: boolean;
  web_system_maintenance: boolean;
  kiosk_system_maintenance: boolean;
  office_system_maintenance: boolean;
  secretary_system_maintenance: boolean;

  constructor(
    public storage: AngularFireStorage,
    private accessService: AccessService,
    public http: HttpClient,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private firestore: AngularFirestore,
    public loadingController: LoadingController,
    private modelCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.accountPanel = true;
    // Function for checking all system status
    this.checkSystemStatus();
    this.accessService.getETechSupportMessages().subscribe((data) => {
      data.map((e) => {
        // console.log(e.payload.doc);
        if (e.payload.doc.data()["Status"] == "New") {
          // console.log("Unread Messages");
          this.newMessage = true;
        }
        else {
          this.newMessage = false;
        }
      });
    });
    var user = firebase.default.auth().currentUser;

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
          this.Email = user.email
        }
      });
    /**
     * Validation Form receives input data sent by the user to Support service
     */
    this.message_form = this.formBuilder.group({
      messageBody: new FormControl("", Validators.compose([])),
    });
    /**
    * Form validators for registration process
    */
    this.registration_form = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "^([ a-zA-Z])+$"
          ),
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
      fullName: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(15),
          Validators.required,
          Validators.pattern("^([ a-zA-Z])+$"),
        ])
      ),
      type: new FormControl("", Validators.compose([Validators.required])),
      nic: new FormControl("", Validators.compose([Validators.required])),
      gender: new FormControl("", Validators.compose([Validators.required])),
      prefix: new FormControl("", Validators.compose([Validators.required])),
      dateOfBirth: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      division: new FormControl(
        "",
        Validators.compose([Validators.minLength(10), Validators.required])
      ),
      landLine: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^[0-9]{10}$"),
          Validators.minLength(10),
          Validators.required,
        ])
      ),
      mobile: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^[0-9]{10}$"),
          Validators.minLength(10),
          Validators.required,
        ])
      ),
      homeAddress: new FormControl(
        "",
        Validators.compose([Validators.minLength(20), Validators.required])
      ),
      officeAddress: new FormControl("", Validators.compose([])),
      downloadURL: new FormControl("", Validators.compose([])),
    });
  }
  validation_form = {
    email: [
      {
        type: "required",
        message: "Your Government Portal username is required."
      }, {
        type: "pattern",
        message: "Invalid username."
      }
    ],
    password: [
      {
        type: "required",
        message: "Password is required."
      }, {
        type: "minlength",
        message: "Password must be at meet mininum characters."
      }, {
        type: "maxlength",
        message: "Password cannot be longer than 30 characters long."
      }
    ],
    prefix: [
      {
        type: "required",
        message: "Name prefix is required.",
      },
    ],
    fullName: [
      {
        type: "required",
        message: "Full Name is required.",
      },
    ],
    gender: [
      {
        type: "required",
        message: "Gender is required.",
      },
    ],
    nic: [
      {
        type: "required",
        message: "NIC is required.",
      },
    ],
    dateOfBirth: [
      {
        type: "required",
        message: "Date of Birth is required.",
      },
    ],
    placeOfBirth: [
      {
        type: "required",
        message: "Place of birth is required.",
      },
    ],
    division: [
      {
        type: "required",
        message: "Registar's division is required.",
      },
    ],
    homeAddress: [
      {
        type: "required",
        message: "Home Address is required.",
      },
    ],
    officeAddress: [
      {
        type: "required",
        message: "Office Address is required.",
      },
    ],
    mobile: [
      {
        type: "required",
        message: "Mobile number is required.",
      },
    ],
    landLine: [
      {
        type: "required",
        message: "Landline number is required.",
      },
    ],
    type: [
      {
        type: "required",
        message: "Account type is required.",
      },
    ],
  }

  openSupport() {
    this.accountPanel = false;
    this.settingsPanel = false;
    this.statisticsPanel = false;
    this.supportPanel = true;
    this.getSupportMessages();
  }
  openStatistics() {
    this.accountPanel = false;
    this.settingsPanel = false;
    this.supportPanel = false;
    this.statisticsPanel = true;
  }
  openSettings() {
    this.accountPanel = false;
    this.supportPanel = false;
    this.settingsPanel = true;
    this.statisticsPanel = false;
  }
  openAccounts() {
    this.accountPanel = true;
    this.settingsPanel = false;
    this.supportPanel = false;
    this.statisticsPanel = false;
  }

  /**
    * Method reposible for registering officers
    */
  registerOfficer(value) {
    this.accessService.registerOfficer(value);
  }

  async onFileChange(event) {
    var NIC = this.registration_form.value.nic
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.CollectionPath}/${NIC}/ProfilePhoto`;
      const fileRef: AngularFireStorageReference = this.storage.ref(filePath);
      this.task = this.storage.upload(filePath, file);
      this.progress = this.task.percentageChanges();
      const loading = await this.loadingController.create({
        message: "Uploading Photo",
      });
      await loading.present();
      this.task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(async (downloadURL) => {
              downloadURL = "" + downloadURL;
              await loading.dismiss();
              this.registration_form.patchValue({ downloadURL: downloadURL });
            });
          })
        )
        .subscribe();
    }
  }
/** Checking System Status */
checkSystemStatus(){
  // Full System
  this.accessService.getSystemMaintenanceStatus().subscribe(
    (data) => {
      if(data=='true'){
        this.system_maintenance = true
      }
      else{
        this.system_maintenance = false
      }
    },
    (error) => {
      console.log(error);
    }
  );
  // Web System
  this.accessService.getWebSystemMaintenanceStatus().subscribe(
    (data) => {
      if(data=='true'){
        this.web_system_maintenance = true
      }
      else{
        this.web_system_maintenance = false
      }
    },
    (error) => {
      console.log(error);
    }
  );
  // Kiosk System
  this.accessService.getKioskSystemMaintenanceStatus().subscribe(
    (data) => {
      if(data=='true'){
        this.kiosk_system_maintenance = true
      }
      else{
        this.kiosk_system_maintenance = false
      }
    },
    (error) => {
      console.log(error);
    }
  );
  // Office System
  this.accessService.getOfficeSystemMaintenanceStatus().subscribe(
    (data) => {
      if(data=='true'){
        this.office_system_maintenance = true
      }
      else{
        this.office_system_maintenance = false
      }
    },
    (error) => {
      console.log(error);
    }
  );
  // Secretary System
  this.accessService.getSecretarySystemMaintenanceStatus().subscribe(
    (data) => {
      if(data=='true'){
        this.secretary_system_maintenance = true
      }
      else{
        this.secretary_system_maintenance = false
      }
    },
    (error) => {
      console.log(error);
    }
  );
}
/** System Status Management */
systemMaintenance(value){
  this.accessService.setSystemMaintenance(value)
}
kioskSystemMaintenance(value){
  this.accessService.setKioskSystemMaintenance(value)
}
webSystemMaintenance(value){
  this.accessService.setWebSystemMaintenance(value)
}
officeSystemMaintenance(value){
  this.accessService.setOfficeSystemMaintenance(value)
}
secretarySystemMaintenance(value){
  this.accessService.setSecretarySystemMaintenance(value)
}

  /** Methods reposible for loading customer messages to officer screen for reponding */
  async getSupportMessages() {
    this.loadingData = true;
    this.supportServices = true;
    setTimeout(() => {
      this.accessService.getETechSupportMessages().subscribe((data) => {
        // console.log(data);
        this.loadingData = false;
        this.ETechSupportMessages = data.map((e) => {
          return {
            id: e.payload.doc.id,
            Email: e.payload.doc.data()["Email"],
            Subject: e.payload.doc.data()["Subject"],
            Description: e.payload.doc.data()["Description"],
            Status: e.payload.doc.data()["Status"],
            Type: e.payload.doc.data()["Type"],
            Count: e.payload.doc.data()["Count"],
          };
        });
      });
    }, 1000);
  }
  createAccount() {
    this.accountCreate = true;
    this.accountManage = false;
  }
  /**
   * Manages Government Portal accounts
   */
  async manageAccount() {
    this.accountManage = true;
    this.accountCreate = false;

    this.http
      .get(`https://government-portal-firebase.herokuapp.com/get-all-users`)
      .subscribe(
        (response) => {
          // console.log(response);
          this.userFilter = JSON.stringify(response);
          this.userRecords = JSON.parse(this.userFilter);
        },
        async (error) => {
          // console.log(error);
          const alert = await this.alertController.create({
            header: "🚫 Out of Service",
            subHeader: "Server Access Timeout",
            message:
              "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later.",
            buttons: ["OK"],
          });
          await alert.present();
        }
      );
  }
  /**
   * Closes Government Portal account services manager
   */
  exitECitizenManager() {
    this.accountManage = false;
  }
  /**
   * Find Government Portal user by registration email
   */
  async findUser(value) {
    // Do not change with null value condition if('!value') as the results should refresh
    if (value == "") {
      this.manageAccount();
    } else {
      this.http
        .get(
          "https://government-portal-firebase.herokuapp.com/get-user?email=" +
          value
        )
        .subscribe(
          (data) => {
            // console.log(data);
            this.userFilter = JSON.stringify(data);
            var user = JSON.parse(this.userFilter);
            this.userRecords = [user];
          },
          async (error) => {
            // console.log(error);
            const alert = await this.alertController.create({
              header: "🚫 Out of Service",
              subHeader: "Server Access Timeout",
              message:
                "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later.",
              buttons: ["OK"],
            });
            await alert.present();
          }
        );
    }
  }
  /**
   * Activate Government Portal user account
   */
  async activateAccount(user) {
    this.http
      .get(
        "https://government-portal-firebase.herokuapp.com/activate-user?uid=" +
        user
      )
      .subscribe(
        async (data) => {
          const alert = await this.alertController.create({
            header: "Account Activated ✔",
            message: "Account has been activated",
            buttons: ["OK"],
          });
          await alert.present();
          this.manageAccount();
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
   * Disable Government Portal user account
   */
  async disableAccount(user) {
    this.http
      .get(
        "https://government-portal-firebase.herokuapp.com/disable-user?uid=" +
        user
      )
      .subscribe(
        async (data) => {
          const alert = await this.alertController.create({
            header: "Account Disabled ✔",
            message: "Account has been disabled",
            buttons: ["OK"],
          });
          await alert.present();
          this.manageAccount();
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
   * Delete Government Portal user account
   */
  async deleteAccount(user) {
    this.http
      .get(
        "https://government-portal-firebase.herokuapp.com/delete-user?uid=" +
        user
      )
      .subscribe(
        async (data) => {
          const alert = await this.alertController.create({
            header: "Account Deleted ✔",
            message: "Account has been deleted",
            buttons: ["OK"],
          });
          await alert.present();
          this.manageAccount();
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
  supportOfficer(value, ID) {
    var message = value.messageBody;
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
  /**Method reponsible for working tracking of active hours */
  getWorkLogs() {
    this.activityLog = true;
    setTimeout(async () => {
      var user = firebase.default.auth().currentUser;
      var Email = user.email;
      (await this.accessService.getEWorkLogs(Email)).subscribe((data) => {
        // console.log(data);
        this.EWorkLogs = data.map((e) => {
          return {
            id: e.payload.doc.id,
            signIn: e.payload.doc.data()["signIn"],
            signOff: e.payload.doc.data()["signOff"],
            messagesHandled: e.payload.doc.data()["messagesHandled"],
            accountsHandled: e.payload.doc.data()["accountsHandled"],
            date: e.payload.doc.data()["date"],
          };
        });
      });
    }, 1000);
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
  async logoutAdmin() {
    this.accessService.logoutAdmin();
  }
}