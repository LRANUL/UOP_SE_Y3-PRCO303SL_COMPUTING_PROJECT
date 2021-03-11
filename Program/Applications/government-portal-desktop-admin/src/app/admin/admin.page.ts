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
import { FormBuilder, Validators, FormControl } from "@angular/forms";

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
  ESupportMessages: { id: string; GovernmentID: any; FullName: any; Subject: any; Description: any; Status: any; Type: any; Count: any; }[];

  constructor(
    private accessService: AccessService,
    public http: HttpClient,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private firestore: AngularFirestore,
    public loadingController: LoadingController,
    private modelCtrl: ModalController
  ) {}

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  public barChartLabels = [
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
  ];
  public barChartType = "bar";
  public barChartLegend = true;

  public barChartData = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Active Users" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
  ];

  ngOnInit() {
    this.accountPanel = true;
    this.accessService.getETechSupportMessages().subscribe((data) => {
      data.map((e) => {
        // console.log(e.payload.doc);
        if (e.payload.doc.data()["Status"] == "New") {
          // console.log("Unread Messages");
          this.newMessage = true;
        }
      });
    });
    /**
     * Validation Form receives input data sent by the user to Support service
     */
    this.message_form = this.formBuilder.group({
      messageBody: new FormControl("", Validators.compose([])),
    });
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

  /** Methods reposible for loading customer messages to officer screen for reponding */
  async getSupportMessages() {
    this.loadingData = true;
    this.supportServices = true;
    setTimeout(() => {
      this.accessService.getETechSupportMessages().subscribe((data) => {
        // console.log(data);
        this.loadingData = false;
        this.ESupportMessages = data.map((e) => {
          return {
            id: e.payload.doc.id,
            GovernmentID: e.payload.doc.data()["Email"],
            FullName: e.payload.doc.data()["FullName"],
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
  /**
   * Manages Government Portal accounts
   */
  async manageAccount() {
    this.accountManage = true;
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
