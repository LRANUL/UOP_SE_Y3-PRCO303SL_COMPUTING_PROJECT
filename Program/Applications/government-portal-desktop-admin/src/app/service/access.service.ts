/**
 * CONTAINS SERVICE CLASS CODE FOR ADMINISTRATOR FUNCTIONALITY
 */
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  AlertController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import * as firebase from "firebase/app";
import * as dateFormat from "dateformat";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AccessService {
  private BASE_URL = "https://government-portal-firebase.herokuapp.com/";

  constructor(
    public http: HttpClient,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private navCtrl: NavController
  ) {}
  /** Management of System via Remote Configuration - Allows management of all system clients */
  // Setting Maintenance Status Line 16-31
  setSystemMaintenance(value) {
    return this.http.get(this.BASE_URL + "system_maintenance?value=" + value);
  }
  setKioskSystemMaintenance(value: any) {
    return this.http.get(
      this.BASE_URL + "kiosk_system_maintenance?value=" + value
    );
  }
  setWebSystemMaintenance(value: any) {
    return this.http.get(
      this.BASE_URL + "web_system_maintenance?value=" + value
    );
  }
  setOfficeSystemMaintenance(value: any) {
    return this.http.get(
      this.BASE_URL + "office_system_maintenance?value=" + value
    );
  }
  setSecretarySystemMaintenance(value: any) {
    return this.http.get(
      this.BASE_URL + "secretary_system_maintenance?value=" + value
    );
  }
  // Checking Maintenance Status Line 33-47
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
  /**
   *  Method for Officer Registration
   * @param {Form} contains form data
   * */
  registerOfficer(value) {
    let dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
    /**
     * Data gets stored on Firebase for references
     */
    this.firestore
      .collection("eAdministration")
      .doc(value.email + "@homeaffairs.gov.lk")
      .set({
        Type: value.type,
        Full_Name: value.fullName,
        Gender: value.gender,
        Date_Of_Birth: dateBirth,
        Division: value.division.toUpperCase(),
        NIC: value.nic,
        downloadURL: value.downloadURL,
        Prefix: value.prefix,
        homeAddress: value.homeAddress,
        officeAddress: value.officeAddress,
        mobile: value.mobile,
        landLine: value.landLine,
        Email: value.email + "@homeaffairs.gov.lk",
        createdDateTime: new Date(),
        status: "Active",
      });

    this.http
      .post(
        // "http://localhost:5000/create-user", {
        "https://government-portal-firebase.herokuapp.com/create-user",
        {
          email: value.email + "@homeaffairs.gov.lk",
          password: value.password,
          downloadURL: value.downloadURL,
          Full_Name: value.fullName,
        }
      )
      .subscribe(
        async (data) => {
          const alert = await this.alertController.create({
            header: "Account Created ✔",
            message: value.type + " Account has been created.",
            buttons: ["OK"],
          });
          await alert.present();
          let user = firebase.default.auth().currentUser;
          let date = dateFormat(new Date(), "mm-dd-yyyy");
          const eAdministration = this.firestore
            .collection("eAdministration")
            .doc("eServices")
            .collection("SystemLogs")
            .doc(date);
          const res = await eAdministration.set(
            {
              Lock: firebase.default.firestore.FieldValue.arrayUnion(
                "administrator account create attempt to " +
                  value.email +
                  " from " +
                  user.email +
                  " at: " +
                  new Date()
              ),
            },
            { merge: true }
          );
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
          let user = firebase.default.auth().currentUser;
          let date = dateFormat(new Date(), "mm-dd-yyyy");
          const eAdministration = this.firestore
            .collection("eAdministration")
            .doc("eServices")
            .collection("SystemLogs")
            .doc(date);
          const res = await eAdministration.set(
            {
              Account: firebase.default.firestore.FieldValue.arrayUnion(
                "administrator failed server contact on attempt to create " +
                  value.email +
                  " from " +
                  user.email +
                  " at: " +
                  new Date()
              ),
            },
            { merge: true }
          );
        }
      );
  }
  /**
   * Method for unlocking theft cards
   * @param GovernmentID eCitizen ID
   * @returns unlock result
   */
  async PortalCardManage(Status: any, GovernmentID: any) {
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();
    const eCitizen = this.firestore.collection("eCitizens").doc(GovernmentID);
    const res = await eCitizen
      .set(
        {
          kioskLock: Status,
        },
        { merge: true }
      )
      .then(
        async (data) => {
          if (Status == true) {
            const alert = await this.alertController.create({
              header: "Card Locked 🔓",
              message: GovernmentID + " card has been locked.",
              buttons: ["OK"],
            });
            await alert.present();
            loading.dismiss();
            let user = firebase.default.auth().currentUser;
            let date = dateFormat(new Date(), "mm-dd-yyyy");
            const eAdministration = this.firestore
              .collection("eAdministration")
              .doc("eServices")
              .collection("SystemLogs")
              .doc(date);
            const res = await eAdministration.set(
              {
                Lock: firebase.default.firestore.FieldValue.arrayUnion(
                  "administrator card lock attempt to " +
                    GovernmentID +
                    " from " +
                    user.email +
                    " at: " +
                    new Date()
                ),
              },
              { merge: true }
            );
          } else {
            const alert = await this.alertController.create({
              header: "Card UnLocked 🔓",
              message: GovernmentID + " card has been unlocked.",
              buttons: ["OK"],
            });
            await alert.present();
            loading.dismiss();
            let user = firebase.default.auth().currentUser;
            let date = dateFormat(new Date(), "mm-dd-yyyy");
            const eAdministration = this.firestore
              .collection("eAdministration")
              .doc("eServices")
              .collection("SystemLogs")
              .doc(date);
            const res = await eAdministration.set(
              {
                Lock: firebase.default.firestore.FieldValue.arrayUnion(
                  "administrator card unlock attempt to " +
                    GovernmentID +
                    " from " +
                    user.email +
                    " at: " +
                    new Date()
                ),
              },
              { merge: true }
            );
          }
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
          loading.dismiss();
          let user = firebase.default.auth().currentUser;
          let date = dateFormat(new Date(), "mm-dd-yyyy");
          const eAdministration = this.firestore
            .collection("eAdministration")
            .doc("eServices")
            .collection("SystemLogs")
            .doc(date);
          const res = await eAdministration.set(
            {
              Lock: firebase.default.firestore.FieldValue.arrayUnion(
                "administrator failed server contact on attempt to manage card " +
                  GovernmentID +
                  " from " +
                  user.email +
                  " at: " +
                  new Date()
              ),
            },
            { merge: true }
          );
        }
      );
  }
  /**
   * Method for Kiosk Registration
   * @param {Form} contains form data
   * */
  async registerKiosk(value) {
    const loading = await this.loadingController.create({
      message: "Registering...",
    });
    await loading.present();
    this.http
      .post(
        // "http://localhost:5000/create-user", {
        "https://government-portal-firebase.herokuapp.com/create-kiosk",
        {
          email: value.email + "@kiosk.gov.lk",
          password: value.password,
        }
      )
      .subscribe(
        async (data) => {
          const alert = await this.alertController.create({
            header: "Kiosk Account Created ✔",
            message: value.email + " Kiosk account has been created.",
            buttons: ["OK"],
          });
          await alert.present();
          loading.dismiss();
          let user = firebase.default.auth().currentUser;
          let date = dateFormat(new Date(), "mm-dd-yyyy");
          const eAdministration = this.firestore
            .collection("eAdministration")
            .doc("eServices")
            .collection("SystemLogs")
            .doc(date);
          const res = await eAdministration.set(
            {
              Lock: firebase.default.firestore.FieldValue.arrayUnion(
                "administrator create kiosk attempt to " +
                  value.email +
                  " from " +
                  user.email +
                  " at: " +
                  new Date()
              ),
            },
            { merge: true }
          );
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
          loading.dismiss();
          let user = firebase.default.auth().currentUser;
          let date = dateFormat(new Date(), "mm-dd-yyyy");
          const eAdministration = this.firestore
            .collection("eAdministration")
            .doc("eServices")
            .collection("SystemLogs")
            .doc(date);
          const res = await eAdministration.set(
            {
              Account: firebase.default.firestore.FieldValue.arrayUnion(
                "administrator failed server contact on attempt to create " +
                  value.email +
                  " from " +
                  user.email +
                  " at: " +
                  new Date()
              ),
            },
            { merge: true }
          );
        }
      );
  }
  /**
   * Method for Citizen Registration
   * @param {Form} contains form data*/
  async registerBirths(value) {
    // console.log(value);
    const loading = await this.loadingController.create({
      message: "Storing record...",
    });
    await loading.present();
    let dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
    /**
     * Data gets stored on Firebase for references
     */
    this.firestore
      .collection("BirthRegistrations")
      .doc(value.birthCertNo.toString())
      .set({
        FatherName: value.fatherFullName.toUpperCase(),
        Full_Name: value.fullName.toUpperCase(),
        MotherName: value.motherFullName.toUpperCase(),
        birthRegNo: value.birthCertNo.toString(),
        dateOfBirth: dateBirth,
        gender: value.gender.toUpperCase(),
        placeOfBirth: value.placeOfBirth.toUpperCase(),
      })
      .then(
        async (data) => {
          const alert = await this.alertController.create({
            header: "Birth Registration Added",
            message:
              "Record with Birth Registration No: " +
              value.birthCertNo.toString() +
              " has been added to Government Portal.",
            buttons: ["OK"],
          });
          await alert.present();
          loading.dismiss();
          let user = firebase.default.auth().currentUser;
          let date = dateFormat(new Date(), "mm-dd-yyyy");
          const eAdministration = this.firestore
            .collection("eAdministration")
            .doc("eServices")
            .collection("SystemLogs")
            .doc(date);
          const res = await eAdministration.set(
            {
              Application: firebase.default.firestore.FieldValue.arrayUnion(
                "administrator add birth registration attempt to " +
                  value.birthCertNo +
                  " from " +
                  user.email +
                  " at: " +
                  new Date()
              ),
            },
            { merge: true }
          );
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
          loading.dismiss();
          let user = firebase.default.auth().currentUser;
          let date = dateFormat(new Date(), "mm-dd-yyyy");
          const eAdministration = this.firestore
            .collection("eAdministration")
            .doc("eServices")
            .collection("SystemLogs")
            .doc(date);
          const res = await eAdministration.set(
            {
              Application: firebase.default.firestore.FieldValue.arrayUnion(
                "administrator failed server contact on attempt to add " +
                  value.birthCertNo +
                  " from " +
                  user.email +
                  " at: " +
                  new Date()
              ),
            },
            { merge: true }
          );
        }
      );
  }
  /**
   * Method for logging in user to system
   * @param value Holds data coming from Login form and invokes for verfication before allowing access
   */
  async loginAdmin(value) {
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
        let date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        const res = await eAdministration.set(
          {
            Login: firebase.default.firestore.FieldValue.arrayUnion(
              "administrator failed login attempt " +
                " using " +
                value.email +
                " at: " +
                new Date()
            ),
          },
          { merge: true }
        );
      }
    });
  }
  /** Method for retrieving active new eCitizen users*/
  getECitizens() {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref.limit(50).where("status", "!=", "Deleted")
      )
      .snapshotChanges();
  }

  /** Method for retrieving an active eCitizen*/
  getECitizen(GovernmentID) {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref
          .where("GovernmentID", "==", GovernmentID)
          .where("status", "!=", "Deleted")
      )
      .snapshotChanges();
  }
  /**
   * Method for logging out user to system
   */
  async logoutAdmin() {
    if (this.auth.currentUser) {
      this.auth
        .signOut()
        .then(async () => {
          // console.log("Signing out");
          this.navCtrl.navigateForward("access");
        })
        .catch(async (_error) => {
          // console.log(_error);
        });
    }
  }
  /** Method for retrieving eSupport messages */
  getETechSupportMessages() {
    return this.firestore
      .collection("eSupport", (ref) =>
        ref.limit(10).where("Status", "==", "New").where("Type", "==", "Admin")
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
      let user = firebase.default.auth().currentUser;
      let date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministrationLog = this.firestore
        .collection("eAdministration")
        .doc("eServices")
        .collection("SystemLogs")
        .doc(date);
      const resLog = await eAdministrationLog.update({
        Lock: firebase.default.firestore.FieldValue.arrayUnion(
          "administrator technical support attempt to " +
            ID +
            " from " +
            user.email +
            " at: " +
            new Date()
        ),
      });
      let supportNo = firebase.default.firestore.FieldValue.increment(1);
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
    let user = firebase.default.auth().currentUser;
    let date = dateFormat(new Date(), "mm-dd-yyyy");
    let time = dateFormat(new Date(), "h:MM:ss TT");
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
    let user = firebase.default.auth().currentUser;
    let date = dateFormat(new Date(), "mm-dd-yyyy");
    let time = dateFormat(new Date(), "h:MM:ss TT");
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
