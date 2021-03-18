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
  ) { }
  /** Method for getting eApplications to Officer */
  getEApplications() {
    return this.firestore
      .collection("eApplications", (ref) =>
        ref
          .limit(10)
          .where("status", "in", ["New", "Processing - Stage 1","Processing - Stage 2"])
          .where("payment_status", "==", "paid")
      )
      .snapshotChanges();
  }
  /** Method for getting eApplications Status to Officer on request*/
  getEApplicationStatus() {
    return this.firestore
      .collection("eApplications", (ref) => ref.limit(20))
      .snapshotChanges();
  }
  /** Method for getting eApplications Status to Officer on request*/
  getEApplicationStatusByID(GovernmentID) {
    return this.firestore
      .collection("eApplications", (ref) =>
        ref.where("GovernmentID", "==", GovernmentID)
      )
      .snapshotChanges();
  }
  /** Method for fetching eApplicant Data for verification */
  getECitizensPhoto(GovernmentID) {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref.where("GovernmentID", "==", GovernmentID)
      )
      .snapshotChanges();
  }
  /** Method for retrieving eSupport messages */
  getETechSupportMessages() {
    var user = firebase.default.auth().currentUser;
    return this.firestore
      .collection("eSupport", (ref) =>
        ref.limit(10).where("Status", "==", "New")
          .where("Type", "==", "Admin")
          .where("Email", "==", user.email)
      )
      .snapshotChanges();
  }
  /** Method for retrieving active new eCitizen users*/
  getECitizens() {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref.limit(50).where("status", "!=", "Deleted")
      )
      .snapshotChanges();
  }
  /** Method for retrieving an eCitizen by Card*/
  getECitizenByCard(Access_Key) {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref.where("Access_Key", "==", Access_Key)
      )
      .snapshotChanges();
  }
  /** Method for retrieving an eCitizen by ID*/
  getECitizenbyID(GovernmentID) {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref.where("GovernmentID", "==", GovernmentID)
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
  /** Method for retrieving eSupport messages */
  getESupportMessages() {
    return this.firestore
      .collection("eSupport", (ref) =>
        ref.
          limit(10)
          .where("Status", "==", "New")
          .where("Type", "==", "eCitizen")
      )
      .snapshotChanges();
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
        documentsHandled: 0,
        messagesHandled: 0,
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
  /** Method for updating eCitizen access key */

  async updateECitizenAccessPIN(Access_Key, governmentID) {
    const eCitizen = this.firestore.collection("eCitizens").doc(governmentID);
    const res = await eCitizen.set(
      {
        Access_Key: Access_Key,
      },
      { merge: true }
    );
  }
  /** Method for activating disabled eCitizen account */
  async activateECitizen(governmentID) {
    const eCitizen = this.firestore.collection("eCitizens").doc(governmentID);
    const res = await eCitizen.set(
      {
        status: "Active",
      },
      { merge: true }
    );
  }
  /** Method for disabling active eCitizen account */
  async disableECitizen(governmentID) {
    const eCitizen = this.firestore.collection("eCitizens").doc(governmentID);
    const res = await eCitizen.set(
      {
        status: "Disabled",
      },
      { merge: true }
    );
  }
  /** Method for permanentely locking eCitizen account, do not delete actual profile [HOLD FOR REFERENCES] */
  async deleteECitizen(governmentID) {
    const eCitizen = this.firestore.collection("eCitizens").doc(governmentID);
    const res = await eCitizen.set(
      {
        status: "Deleted",
      },
      { merge: true }
    );
  }
  /** Method for setting application to processing */
  async setApplicationToProcessing(DocumentID) {
    // console.log(DocumentID);
    const eApplication = this.firestore
      .collection("eApplications")
      .doc(DocumentID);
    await eApplication.set(
      {
        status: "Processing - Stage 2",
        description:
          "Your application is being processed and will be approved soon.",
        processedTimeStamp: "" + new Date(),
      },
      { merge: true }
    );
    var user = firebase.default.auth().currentUser;
    var documentNo = firebase.default.firestore.FieldValue.increment(1);
    var date = dateFormat(new Date(), "mm-dd-yyyy");
    const eAdministration = this.firestore
      .collection("eAdministration")
      .doc(user.email)
      .collection("WorkLogs")
      .doc(date);
    await eAdministration.set(
      {
        documentsHandled: documentNo,
      },
      { merge: true }
    );
  }
  /** Method for setting application to approved */
  async setApplicationToApproved(DocumentID) {
    // console.log(DocumentID);
    const eApplication = this.firestore
      .collection("eApplications")
      .doc(DocumentID);
    const res = await eApplication.set(
      {
        status: "Processed",
        description:
          "Your application is processed, we have mailed your ID card.",
        approvedTimeStamp: "" + new Date(),
      },
      { merge: true }
    );
    var user = firebase.default.auth().currentUser;
    var documentNo = firebase.default.firestore.FieldValue.increment(1);
    var date = dateFormat(new Date(), "mm-dd-yyyy");
    const eAdministration = this.firestore
      .collection("eAdministration")
      .doc(user.email)
      .collection("WorkLogs")
      .doc(date);
    await eAdministration.set(
      {
        documentsHandled: documentNo,
      },
      { merge: true }
    );
  }
  /** Method for declining application*/
  async setApplicationToDeclined(DocumentID, Reason) {
    const eApplication = this.firestore
      .collection("eApplications")
      .doc(DocumentID);
    const res = await eApplication.set(
      {
        status: "Declined",
        description: Reason,
        approvedTimeStamp: "" + new Date(),
      },
      { merge: true }
    );
    var user = firebase.default.auth().currentUser;
    var documentNo = firebase.default.firestore.FieldValue.increment(1);
    var date = dateFormat(new Date(), "mm-dd-yyyy");
    const eAdministration = this.firestore
      .collection("eAdministration")
      .doc(user.email)
      .collection("WorkLogs")
      .doc(date);
    await eAdministration.set(
      {
        documentsHandled: documentNo,
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
  sendNICApplication(value, photoURL) {
    var dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
    return new Promise<any>(async (resolve, reject) => {
      /**
       * Data gets stored on firebase, used for application tracking and references
       */
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
          policeReportDate: dateFormat(value.policeReportDate, "mm/dd/yyyy"),
          homePhone: value.homePhone,
          mobilePhone: value.mobilePhone,
          requestType: value.NICType,
          TimeStamp: new Date(),
          photoURL: photoURL,
          sentTimeStamp: "" + new Date(),
          processedTimeStamp: "",
          approvedTimeStamp: "",
        })
        .then(
          (response) => resolve(response),
          (error) => reject(error)
        );
      const alert = await this.alertController.create({
        header: "✅ Application Requested",
        subHeader: "Application Sent",
        message:
          "Your application has been sent, check Services page for process tracking.",
        buttons: ["OK"],
      });
      await alert.present();
    });
  }
  /** Method for sending officer support request to Administrator */
  async techSupport(value) {
    /**
         * Data gets stored on firebase, used for message tracking and references
         */
    var user = firebase.default.auth().currentUser;
    console.log(value)
    this.firestore
      .collection("/eSupport/")
      .doc()
      .set({
        Description: value.message,
        Email: user.email,
        GovernmentID: user.displayName,
        Status: "New",
        Type: "Admin",
        Subject: value.subject,
        Response: "Support Request Sent | Wait for Response",
      })
  }
  /** Method for sending officer reponse to ecitizen */
  sendMessage(ID, messageBody) {
    return new Promise<any>(async (resolve, reject) => {
      /**
       * Data gets stored on firebase, used for message tracking and references
       */
      // console.log(ID + "\n" + messageBody);
      // console.log(ID);
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
}
