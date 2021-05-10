/**
 * CONTAINS SERVICE CLASS CODE FOR OFFICER FUNCTIONALITY
 */
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
  /** Method for getting eApplications to Officer */
  getEApplications() {
    return this.firestore
      .collection("eApplications", (ref) =>
        ref
          .limit(10)
          .where("status", "in", [
            "Processing - Stage 1|සැකසීම - අදියර 1|செயலாக்கம் - நிலை 1",
            "Processing - Stage 2|සැකසීම - අදියර 2|செயலாக்கம் - நிலை 2",
          ])
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
    let user = firebase.default.auth().currentUser;
    return this.firestore
      .collection("eSupport", (ref) =>
        ref
          .limit(10)
          .where("Status", "in", ["New", "Completed"])
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
        ref
          .limit(10)
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
        documentsHandled: 0,
        messagesHandled: 0,
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
  /** Method for updating eCitizen access key */

  async updateECitizenAccessPIN(Access_Key, governmentID) {
    const eCitizen = this.firestore.collection("eCitizens").doc(governmentID);
    const res = await eCitizen.set(
      {
        Access_Key: Access_Key,
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
      await eAdministrationLog.set(
        {
          Account: firebase.default.firestore.FieldValue.arrayUnion(
            "officer card PIN update attempt to " +
              governmentID +
              " from " +
              user.email +
              " at: " +
              new Date()
          ),
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
    let user = firebase.default.auth().currentUser;
      let date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministrationLog = this.firestore
        .collection("eAdministration")
        .doc("eServices")
        .collection("SystemLogs")
        .doc(date);
      await eAdministrationLog.set(
        {
          Account: firebase.default.firestore.FieldValue.arrayUnion(
            "officer account activate attempt to " +
              governmentID +
              " from " +
              user.email +
              " at: " +
              new Date()
          ),
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
    let user = firebase.default.auth().currentUser;
      let date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministrationLog = this.firestore
        .collection("eAdministration")
        .doc("eServices")
        .collection("SystemLogs")
        .doc(date);
      await eAdministrationLog.set(
        {
          Account: firebase.default.firestore.FieldValue.arrayUnion(
            "officer account disable attempt to " +
              governmentID +
              " from " +
              user.email +
              " at: " +
              new Date()
          ),
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
    let user = firebase.default.auth().currentUser;
      let date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministrationLog = this.firestore
        .collection("eAdministration")
        .doc("eServices")
        .collection("SystemLogs")
        .doc(date);
      await eAdministrationLog.set(
        {
          Account: firebase.default.firestore.FieldValue.arrayUnion(
            "officer account delete attempt to " +
              governmentID +
              " from " +
              user.email +
              " at: " +
              new Date()
          ),
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
        status: "Processing - Stage 2|සැකසීම - අදියර 2|செயலாக்கம் - நிலை 2",
        description:
          "Your application has being processed at the divisional secretary and will be approved soon.|ඔබගේ අයදුම්පත ප්‍රාදේශීය ලේකම් වෙත ඉදිරිපත් කර ඇති අතර එය ඉක්මණින් අනුමත වේ.|உங்கள் விண்ணப்பம் பிரதேச செயலாளரிடம் செயல்படுத்தப்பட்டு விரைவில் ஒப்புதல் பெறப்படும்.",
        processedTimeStamp: "" + new Date(),
      },
      { merge: true }
    );
    let user = firebase.default.auth().currentUser;
    let documentNo = firebase.default.firestore.FieldValue.increment(1);
    let date = dateFormat(new Date(), "mm-dd-yyyy");
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
    const eAdministrationLog = this.firestore
      .collection("eAdministration")
      .doc("eServices")
      .collection("SystemLogs")
      .doc(date);
    await eAdministrationLog.set(
      {
        Account: firebase.default.firestore.FieldValue.arrayUnion(
          "secretary set NIC application to Phase 2 with ID " +
            DocumentID +
            " from " +
            user.email +
            " at: " +
            new Date()
        ),
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
        status: "Approved|අනුමත කර ඇත|அங்கீகரிக்கப்பட்டது",
        description:
          "Your application is processed, we have mailed your ID card.|ඔබගේ අයදුම්පත සකසා ඇත, අපි ඔබගේ හැඳුනුම්පත තැපැල් කර ඇත.|உங்கள் விண்ணப்பம் செயலாக்கப்பட்டது, நாங்கள் உங்கள் அடையாள அட்டையை அனுப்பியுள்ளோம்.",
        approvedTimeStamp: "" + new Date(),
      },
      { merge: true }
    );
    let user = firebase.default.auth().currentUser;
    let documentNo = firebase.default.firestore.FieldValue.increment(1);
    let date = dateFormat(new Date(), "mm-dd-yyyy");
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
    const eAdministrationLog = this.firestore
      .collection("eAdministration")
      .doc("eServices")
      .collection("SystemLogs")
      .doc(date);
    await eAdministrationLog.set(
      {
        Account: firebase.default.firestore.FieldValue.arrayUnion(
          "secretary set NIC application to Processed with ID " +
            DocumentID +
            " from " +
            user.email +
            " at: " +
            new Date()
        ),
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
        status: "Declined|ප්රතික්ෂේප විය|குறைந்தது",
        description: Reason,
        approvedTimeStamp: "" + new Date(),
      },
      { merge: true }
    );
    let user = firebase.default.auth().currentUser;
    let documentNo = firebase.default.firestore.FieldValue.increment(1);
    let date = dateFormat(new Date(), "mm-dd-yyyy");
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
    const eAdministrationLog = this.firestore
      .collection("eAdministration")
      .doc("eServices")
      .collection("SystemLogs")
      .doc(date);
    await eAdministrationLog.set(
      {
        Account: firebase.default.firestore.FieldValue.arrayUnion(
          "secretary declined application with ID " +
            DocumentID +
            " from " +
            user.email +
            " at: " +
            new Date()
        ),
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
    let dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
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
          description:
            "Application sent for Department | දෙපාර්තමේන්තුව සඳහා අයදුම්පත යවා ඇත| துறைக்கு விண்ணப்பம் அனுப்பப்பட்டது",
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
      let user = firebase.default.auth().currentUser;
      let date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministrationLog = this.firestore
        .collection("eAdministration")
        .doc("eServices")
        .collection("SystemLogs")
        .doc(date);
      await eAdministrationLog.set(
        {
          Application: firebase.default.firestore.FieldValue.arrayUnion(
            "officer NIC application attempt to " +
              value.GovernmentID +
              " from " +
              user.email +
              " at: " +
              new Date()
          ),
        },
        { merge: true }
      );
    });
  }
  /** Method for sending officer support request to Administrator */
  async techSupport(value) {
    /**
     * Data gets stored on firebase, used for message tracking and references
     */
    let user = firebase.default.auth().currentUser;
    console.log(value);
    this.firestore.collection("/eSupport/").doc().set({
      Description: value.message,
      Email: user.email,
      Status: "New",
      Type: "Admin",
      Subject: value.subject,
      Response: "Support Request Sent | Wait for Response",
    });
      let date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministrationLog = this.firestore
        .collection("eAdministration")
        .doc("eServices")
        .collection("SystemLogs")
        .doc(date);
      await eAdministrationLog.set(
        {
          Application: firebase.default.firestore.FieldValue.arrayUnion(
            "officer technical message attempt from" +
              user.email +
              " at: " +
              new Date()
          ),
        },
        { merge: true }
      );
  }
  /** Method for marking messages as read */
  async markTechMessageRead(ID) {
    const eSupport = this.firestore.collection("eSupport").doc(ID);
    const res = await eSupport.set(
      {
        Status: "Read",
      },
      { merge: true }
    );
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
      let user = firebase.default.auth().currentUser;
      let date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministrationLog = this.firestore
        .collection("eAdministration")
        .doc("eServices")
        .collection("SystemLogs")
        .doc(date);
      await eAdministrationLog.set(
        {
          Application: firebase.default.firestore.FieldValue.arrayUnion(
            "officer message attempt to " +
              ID +
              " from " +
              user.email +
              " at: " +
              new Date()
          ),
        },
        { merge: true }
      );
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
        let date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        const res = await eAdministration.set(
          {
            Login: firebase.default.firestore.FieldValue.arrayUnion(
              "officer failed login attempt " +
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
  /**Method for logging user out */
  logoutOfficer() {
    return new Promise<void>((resolve, reject) => {
      let user = firebase.default.auth().currentUser;
            let date = dateFormat(new Date(), "mm-dd-yyyy");
      if (this.auth.currentUser) {
        this.auth
          .signOut()
          .then(async () => {
            // console.log("Signing out");
            
            const eAdministration = this.firestore
              .collection("eAdministration")
              .doc("eServices")
              .collection("SystemLogs")
              .doc(date);
            await eAdministration.set(
              {
                Login: firebase.default.firestore.FieldValue.arrayUnion(
                  "officer logout attempt from " +
                    user.email +
                    " at: " +
                    new Date()
                ),
              },
              { merge: true }
            );
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
