import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { NavController } from "@ionic/angular";

import { AccessService } from "src/app/service/access.service";

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
  EWorkLogs: { id: string; signIn: any; signOut: any; messagesHandled: any; documentsHandled: any; date: any; }[];
  activityLog: boolean;

  constructor(
    private firestore: AngularFirestore,
    private gAuth: AngularFireAuth,
    private navCtrl: NavController,
    private accessService: AccessService
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
  }
  openService() {
    this.servicesPanel = true;
    this.supportPanel = false;
    this.settingsPanel = false
    this.accountPanel = false;
  }
  openSupport() {
    this.servicesPanel = false;
    this.settingsPanel = false
    this.accountPanel = false;
    this.supportPanel = true;
    this.getSupportMessages();
    this.newMessage = false;
  }
  openAccounts()
  {
    this.servicesPanel = false;
    this.supportPanel = false;
    this.settingsPanel = false
    this.accountPanel = true;
  }
  openSettings(){
    this.settingsPanel = true
    this.servicesPanel = false;
    this.supportPanel = false;
    this.accountPanel = false;
  }
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
            applicationDescription: e.payload.doc.data()[
              "Description"
            ],
            applicationStatus: e.payload.doc.data()["Status"],
          };
        });
      });
    }, 1000);
  }

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
            Subject: e.payload.doc.data()["Subject"],
            Description: e.payload.doc.data()["Description"],
            Status: e.payload.doc.data()["Status"],
            Count: e.payload.doc.data()["Count"],
          };
        });
      });
    }, 1000);
  }

  getWorkLogs(){
    this.activityLog = true
    setTimeout(() => {
      //  get email from auth
      var Email = 'william@homeaffairs.gov.lk';
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
  exitApp() {
    console.log(this.NICApplication);
    this.NICApplication = false;
  }

  async logoutOfficer() {
    this.accessService.logoutOfficer();
  }
}
