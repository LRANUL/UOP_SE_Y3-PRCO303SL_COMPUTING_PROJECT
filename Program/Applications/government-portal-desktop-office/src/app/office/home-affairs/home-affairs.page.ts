import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import {FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { NavController, ToastController } from "@ionic/angular";

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
  message_form: FormGroup;
  constructor(
    private firestore: AngularFirestore,
    private gAuth: AngularFireAuth,
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    private accessService: AccessService,
    public toastController: ToastController,
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
    //  FORM VALIDATORS
    /**
     * Validation Form receives input data sent by the user to Support service
     */
    this.message_form = this.formBuilder.group({
      messageBody: new FormControl(
        "",
        Validators.compose([])
      ),
      messageID: new FormControl(
        "",
        Validators.compose([])
      ),
    });
  }

  supportCitizen(value)
  {
    console.log(value)
    this.accessService.sendMessage(value.messageID,value.messageBody).then(
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
          this.message_form.patchValue({
            messageID: e.payload.doc.id
          });
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
