import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AlertController, NavController } from "@ionic/angular";
import * as firebase from "firebase";
import { loadStripe } from "@stripe/stripe-js";
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

  getEApplications() {
    return this.firestore
      .collection("eApplications", (ref) =>
        ref
          .where("status", "in", ["New", "Processing"])
          .where("payment_status", "==", "paid")
      )
      .snapshotChanges();
  }

  getECitizens() {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref.limit(50).where("status", "!=", "Deleted")
      )
      .snapshotChanges();
  }

  getECitizen(GovernmentID) {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref
          .where("GovernmentID", "==", GovernmentID)
          .where("status", "!=", "Deleted")
      )
      .snapshotChanges();
  }

  getESupportMessages() {
    return this.firestore
      .collection("eSupport", (ref) => ref.where("Status", "==", "New"))
      .snapshotChanges();
  }
  getEWorkLogs(Email) {
    return this.firestore
      .collection("eAdministration")
      .doc(Email)
      .collection("WorkLogs")
      .snapshotChanges();
  }

  async activateECitizen(governmentID) {
    const eCitizen = this.firestore.collection("eCitizens").doc(governmentID);
    const res = await eCitizen.set(
      {
        status: "Active",
      },
      { merge: true }
    );
  }
  async disableECitizen(governmentID) {
    const eCitizen = this.firestore.collection("eCitizens").doc(governmentID);
    const res = await eCitizen.set(
      {
        status: "Disabled",
      },
      { merge: true }
    );
  }
  async deleteECitizen(uid) {
    const eCitizen = this.firestore
      .collection("eCitizens", (ref) => ref.where("uid", "==", uid))
      .doc();
    const res = await eCitizen.set(
      {
        status: "Deleted",
      },
      { merge: true }
    );
  }

  async setApplicationToProcessing(DocumentID) {
    console.log(DocumentID);
    const eApplication = this.firestore
      .collection("eApplications")
      .doc(DocumentID);
    const res = await eApplication.set(
      {
        status: "Processing",
        description:
          "Your application is being processed and will be approved soon.",
      },
      { merge: true }
    );
  }

  async setApplicationToApproved(DocumentID) {
    console.log(DocumentID);
    const eApplication = this.firestore
      .collection("eApplications")
      .doc(DocumentID);
    const res = await eApplication.set(
      {
        status: "Processed",
        description:
          "Your application is processed, we have mailed your ID card.",
      },
      { merge: true }
    );
  }

  /**
   * Method reponsible for sending NIC applications via Government Portal
   * To prevent third party usage of Government Resources secondary validation takes place to validate entered data before submitting application
   * This restricts that only the personal account holder to apply / Any form of Joint/Enterprise/Partner accounts are available at this time
   *
   * @param value This holds NIC application data send by registered user via forms available on the Account Portal
   *
   */
  sendNICApplication(value) {
    return new Promise<any>(async (_resolve, _reject) => {
      this.firestore
        .collection("BirthRegistrations")
        .doc("" + value.birthCertNo + "")
        .ref.get()
        .then(async (doc) => {
          console.log(doc.data());
          if (doc.exists) {
            var dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
            console.log(doc.data());
            console.log(value);
            if (
              doc.data()["birthRegNo"] == value.birthCertNo ||
              doc.data()["dateofBirth"] == dateBirth
            ) {
              return new Promise<any>((resolve, reject) => {
                /**
                 * Data gets stored on firebase, used for application tracking and references
                 */
                var user = firebase.default.auth().currentUser;
                this.firestore
                  .collection("/eApplications/")
                  .doc()
                  .set({
                    type: "NIC-Application",
                    status: "New",
                    GovernmentID: value.GovernmentID,
                    payment_status: "paid",
                    description: "Application sent for Department",
                    email: value.email,
                    familyName: value.familyName,
                    name: value.name,
                    surname: value.surname,
                    engFamilyName: value.engFamilyName,
                    engName: value.engName,
                    engSurname: value.engSurname,
                    nicFamilyName: value.nicFamilyName,
                    nicName: value.nicName,
                    nicSurname: value.nicSurname,
                    gender: value.gender,
                    civilStatus: value.civilStatus,
                    profession: value.profession,
                    dateOfBirth: dateBirth,
                    birthCertNo: value.birthCertNo,
                    placeOfBirth: value.placeOfBirth,
                    division: value.division,
                    district: value.district,
                    birthRegNo: value.birthRegNo,
                    countryOfBirth: value.countryOfBirth,
                    foreignCertNo: value.foreignCertNo,
                    city: value.city,
                    houseNo: value.houseNo,
                    houseName: value.houseName,
                    streetName: value.streetName,
                    postalcode: value.postalcode,
                    postcity: value.postcity,
                    posthouseNo: value.posthouseNo,
                    posthouseName: value.posthouseName,
                    poststreetName: value.poststreetName,
                    postpostalcode: value.postpostalcode,
                    certDate: dateFormat(value.certDate, "mm/dd/yyyy"),
                    cardNo: value.cardNo,
                    nicDate: dateFormat(value.nicDate, "mm/dd/yyyy"),
                    policeName: value.policeName,
                    policeReportDate: dateFormat(
                      value.policeReportDate,
                      "mm/dd/yyyy"
                    ),
                    homePhone: value.homePhone,
                    mobilePhone: value.mobilePhone,
                    requestType: value.NICType,
                    TimeStamp: new Date(),
                  })
                  .then(
                    (response) => resolve(response),
                    (error) => reject(error)
                  );
              });
            } else {
              /**
               * Informs applicant that the details dont't match with records to proceed further
               */
              console.log(
                "INVALID BIRTH REGISTRATION NO. OR DATE OF BIRTH" +
                  dateBirth +
                  "  " +
                  value.birthCertNo
              );
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
            console.log("BIRTH REGISTRATION NUMBER NOT FOUND!");
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
    });
  }
  sendMessage(ID, messageBody) {
    return new Promise<any>(async (resolve, reject) => {
      /**
       * Data gets stored on firebase, used for message tracking and references
       */
      console.log(ID + "\n" + messageBody);
      console.log(ID);
      const eSupport = this.firestore.collection("eSupport").doc(ID);
      const res = await eSupport
        .set(
          {
            Status: "Completed",
            Response: messageBody,
          },
          { merge: true }
        )
        .then(
          (response) => resolve(response),
          (error) => reject(error)
        );
    });
  }
  /**
   * Method for logging in user to system
   * @param value Holds data coming from Login form and invokes for verfication before allowing access
   */
  loginOfficer(value) {
    return new Promise<any>(async (resolve, reject) => {
      const email = value.email;
      const address = email.split("@").pop();
      if (address == "homeaffairs.gov.lk") {
        this.auth.signInWithEmailAndPassword(value.email, value.password).then(
          (res) => resolve(res),
          (err) => reject(err)
        );
        this.navCtrl.navigateForward("office/home-affairs");
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

  logoutOfficer() {
    return new Promise<void>((resolve, reject) => {
      if (this.auth.currentUser) {
        this.auth
          .signOut()
          .then(() => {
            console.log("Signing out");
            this.navCtrl.navigateForward("access");
            resolve();
          })
          .catch((_error) => {
            reject();
          });
      }
    });
  }
}
