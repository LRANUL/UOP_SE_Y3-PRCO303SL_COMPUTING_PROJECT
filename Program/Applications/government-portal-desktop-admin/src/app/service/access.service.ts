import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AlertController, NavController } from "@ionic/angular";
import * as firebase from "firebase";
import * as dateFormat from "dateformat";

@Injectable({
  providedIn: "root",
})
export class AccessService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    public alertController: AlertController,
    private navCtrl: NavController
  ) {}

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
