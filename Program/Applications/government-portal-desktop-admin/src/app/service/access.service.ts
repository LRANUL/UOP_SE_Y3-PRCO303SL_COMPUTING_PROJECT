import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AlertController, NavController } from "@ionic/angular";
import * as firebase from "firebase";
import * as dateFormat from "dateformat";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AccessService {
  private BASE_URL = 'http://localhost:5000/'

/** Management of System via Remote Configuration - Allows management of all system clients */
  setSystemMaintenance(value) {
    return this.http.get(this.BASE_URL + "system_maintenance?value="+value);
  }
  setKioskSystemMaintenance(value: any) {
    return this.http.get(this.BASE_URL + "kiosk_system_maintenance?value="+value);
  }
  setWebSystemMaintenance(value: any) {
    return this.http.get(this.BASE_URL + "web_system_maintenance?value="+value);
  }
  setOfficeSystemMaintenance(value: any) {
    return this.http.get(this.BASE_URL + "office_system_maintenance?value="+value);
  }
  setSecretarySystemMaintenance(value: any) {
    return this.http.get(this.BASE_URL + "secretary_system_maintenance?value="+value);
  }
  getSystemMaintenanceStatus() {
    return this.http.get(this.BASE_URL + "system_maintenance_status");
  }
  getWebSystemMaintenanceStatus() {
    return this.http.get(this.BASE_URL + "web_system_maintenance_status");
  }
  getKioskSystemMaintenanceStatus() {
    return this.http.get(this.BASE_URL + "kiosk_system_maintenance_status");
  }
  getOfficeSystemMaintenanceStatus() {
    return this.http.get(this.BASE_URL + "office_system_maintenance_status");
  }
  getSecretarySystemMaintenanceStatus() {
    return this.http.get(this.BASE_URL + "secretary_system_maintenance_status");
  }
  constructor(
    public http: HttpClient,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    public alertController: AlertController,
    private navCtrl: NavController
  ) { }

  registerOfficer(value) {
    var dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
    /**
     * Data gets stored on Firebase for references
    */
    this.firestore
      .collection("eAdministration")
      .doc(value.email)
      .set({
        Type: value.type,
        Full_Name: value.fullName,
        Gender: value.gender,
        Date_Of_Birth: dateBirth,
        Place_Of_Birth: value.placeOfBirth,
        Division: value.division,
        NIC: value.nic,
        downloadURL: value.downloadURL,
        Prefix: value.prefix,
        homeAddress: value.homeAddress,
        officeAddress: value.officeAddress,
        mobile: value.mobile,
        landLine: value.landLine,
        Email: value.email + '@homeaffairs.gov.lk',
        createdDateTime: new Date(),
        status: "Active",
      })

    this.http
      .post(
        "http://localhost:5000/create-user", {
          // "https://government-portal-firebase.herokuapp.com/create-user", {
        email: value.email + '@homeaffairs.gov.lk', password: value.password, downloadURL: value.downloadURL, mobile: value.mobile, Full_Name: value.fullName
      }
      )
      .subscribe(
        async (data) => {
          const alert = await this.alertController.create({
            header: "Account Create ✔",
            message: value.type + " Account has been created.",
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
              "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later.",
            buttons: ["OK"],
          });
          await alert.present();
        }
      );
  }
  /**
   * Method for logging in user to system
   * @param value Holds data coming from Login form and invokes for verfication before allowing access
   */
  loginAdmin(value) {
    return new Promise<any>(async (resolve, reject) => {
      const email = value.email;
      const address = email.split("@").pop();
      if (address == "admin.gov.lk") {
        this.auth.signInWithEmailAndPassword(value.email, value.password).then(
          (res) => resolve(res),
          (err) => reject(err)
        );
        this.navCtrl.navigateForward("admin");
      } else {
        const alert = await this.alertController.create({
          header: "⚠ Unauthorized Access",
          message: "Login attempt failed, service not registered.",
          buttons: ["Close"],
        });
        await alert.present();
      }
    });
  }
  /**
   * Method for logging out user to system
   */
  logoutAdmin() {
    return new Promise<void>((resolve, reject) => {
      if (this.auth.currentUser) {
        this.auth
          .signOut()
          .then(() => {
            // console.log("Signing out");
            this.navCtrl.navigateForward("access");
            resolve();
          })
          .catch((_error) => {
            reject();
          });
      }
    });
  }
  /** Method for retrieving eSupport messages */
  getETechSupportMessages() {
    return this.firestore
      .collection("eSupport", (ref) =>
        ref.limit(10).where("Status", "==", "New")
          .where("Type", "==", "Admin")
      )
      .snapshotChanges();
  }
  /** Method for sending admin reponse to officer */
  sendMessage(ID, messageBody) {
    return new Promise<any>(async (resolve, reject) => {
      const eSupport = this.firestore.collection("eSupport").doc(ID);
      const res = await eSupport.set(
        {
          Status: "Completed",
          Response: messageBody,
        },
        { merge: true }
      );
      var user = firebase.default.auth().currentUser;
      var supportNo = firebase.default.firestore.FieldValue.increment(1);
      var date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministration = this.firestore
        .collection("eAdministration")
        .doc(user.email)
        .collection("WorkLogs")
        .doc(date);
      await eAdministration
        .set(
          {
            messagesHandled: supportNo,
          },
          { merge: true }
        )
        .then(
          (response) => resolve(response),
          (error) => reject(error)
        );
    });
  }
  /** Method for getting Officer worklogs */
  async getEWorkLogs(Email) {
    return this.firestore
      .collection("eAdministration")
      .doc(Email)
      .collection("WorkLogs")
      .snapshotChanges();
  }

  /** Method for officer signin activity */
  async signIn() {
    var user = firebase.default.auth().currentUser;
    var date = dateFormat(new Date(), "mm-dd-yyyy");
    var time = dateFormat(new Date(), "h:MM:ss TT");
    const eAdministration = this.firestore
      .collection("eAdministration")
      .doc(user.email)
      .collection("WorkLogs")
      .doc(date);
    const res = await eAdministration.set(
      {
        signIn: time,
        date: date,
        messagesHandled: 0,
        accountsHandled: 0,
      },
      { merge: true }
    );
  }
  /** Method for officer signoff activity */
  async signOff() {
    var user = firebase.default.auth().currentUser;
    let date = dateFormat(new Date(), "mm-dd-yyyy");
    var time = dateFormat(new Date(), "h:MM:ss TT");
    const eAdministration = this.firestore
      .collection("eAdministration")
      .doc(user.email)
      .collection("WorkLogs")
      .doc(date);
    const res = await eAdministration.set(
      {
        signOff: time,
        date: date,
      },
      { merge: true }
    );
  }
}
