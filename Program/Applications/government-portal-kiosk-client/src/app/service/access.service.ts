import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AlertController, NavController } from "@ionic/angular";
import * as dateFormat from "dateformat";
import * as firebase from "firebase";
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
   * Method reponsible for sending Support messages via Government Portal
   *
   * @param value This holds Support message data send by registered user via forms available on the Account Portal
   *
   */
  sendSupportMessage(value, name, GovernmentID) {
    return new Promise<any>(async (_resolve, _reject) => {
      return new Promise<any>(async (resolve, reject) => {
        /**
         * Data gets stored on firebase, used for message tracking and references
         */
        const alert = await this.alertController.create({
          header: "✅ Support Requested|සහාය ඉල්ලා ඇත|ஆதரவு கோரப்பட்டது",
          subHeader: "Message Sent|පණිවිඩය යැව්වා|தகவல் அனுப்பப்பட்டது",
          message:
            "Your message has been sent, wait for a reponse from support.| ඔබගේ පණිවිඩය යවා ඇත, සහාය දක්වන ප්‍රතිචාරයක් බලාපොරොත්තුවෙන් සිටින්න.|உங்கள் செய்தி அனுப்பப்பட்டது, ஆதரவிலிருந்து பதிலுக்காக காத்திருங்கள்.",
          buttons: ["OK"],
        });
        await alert.present();
        var user = firebase.default.auth().currentUser;
        var date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministrationLog = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        await eAdministrationLog.set(
          {
            Account: firebase.default.firestore.FieldValue.arrayUnion(
              "kiosk support request of " +
                GovernmentID +
                " from " +
                user.email +
                " at: " +
                new Date()
            ),
          },
          { merge: true }
        );
        this.firestore
          .collection("/eSupport/")
          .doc()
          .set({
            Description: value.message,
            FullName: name,
            GovernmentID: GovernmentID,
            Status: "New",
            Subject: value.subject,
            Response:
              "Message Sent | Wait for Response/පණිවිඩය යවන ලදි | ප්‍රතිචාරය සඳහා රැඳී සිටින්න/செய்தி அனுப்பப்பட்டது | பதிலுக்காக காத்திருங்கள்",
          })
          .then(
            (response) => resolve(response),
            (error) => reject(error)
          );
      });
    });
  }
  /**
   * Method for locking theft cards
   * @param GovernmentID eCitizen ID
   * @returns lock result
   */
  async lockAccount(GovernmentID: any) {
    const eCitizen = this.firestore.collection("eCitizens").doc(GovernmentID);
    const res = await eCitizen.set(
      {
        kioskLock: true,
      },
      { merge: true }
    );
    var user = firebase.default.auth().currentUser;
    var date = dateFormat(new Date(), "mm-dd-yyyy");
    const eAdministrationLog = this.firestore
      .collection("eAdministration")
      .doc("eServices")
      .collection("SystemLogs")
      .doc(date);
    await eAdministrationLog.set(
      {
        Account: firebase.default.firestore.FieldValue.arrayUnion(
          "kiosk card locked of " +
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
  /**
   * Method for getting all support messages
   * @param GovernmentID
   * @returns messages documents
   */
  getESupportMessages(GovernmentID) {
    return this.firestore
      .collection("eSupport", (ref) =>
        ref.where("GovernmentID", "==", GovernmentID)
      )
      .snapshotChanges();
  }
  /**
   * Method for getting eapplications
   * @param GovernmentID
   * @returns application documents
   */
  getEApplication(GovernmentID) {
    return this.firestore
      .collection("eApplications", (ref) =>
        ref.where("GovernmentID", "==", GovernmentID)
      )
      .snapshotChanges();
  }
  /**
   * Method for getting Government eCitizen before sending eApplication (NIC)
   * @param GovernmentID
   * @returns Profile Photo
   */
  getECitizensPhoto(GovernmentID) {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref.where("GovernmentID", "==", GovernmentID)
      )
      .snapshotChanges();
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
        header:
          "✅ Application Requested|අයදුම්පත ඉල්ලා ඇත|விண்ணப்பம் கோரப்பட்டது",
        subHeader:
          "Application Sent|අයදුම්පත යවන ලදි|விண்ணப்பம் அனுப்பப்பட்டது",
        message:
          "Your application has been sent, check Services page for process tracking.|ඔබගේ අයදුම්පත යවා ඇත, ක්‍රියාවලි ලුහුබැඳීම සඳහා සේවා පිටුව පරීක්ෂා කරන්න.|உங்கள் விண்ணப்பம் அனுப்பப்பட்டுள்ளது, செயல்முறை கண்காணிப்புக்கு சேவைகள் பக்கத்தை சரிபார்க்கவும்.",
        buttons: ["OK"],
      });
      await alert.present();

      var user = firebase.default.auth().currentUser;
      var date = dateFormat(new Date(), "mm-dd-yyyy");
      const eAdministrationLog = this.firestore
        .collection("eAdministration")
        .doc("eServices")
        .collection("SystemLogs")
        .doc(date);
      await eAdministrationLog.set(
        {
          Application: firebase.default.firestore.FieldValue.arrayUnion(
            "kiosk NIC application attempt to " +
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
  /**Method for getting eCitizen data for Access key using scanner */
  getECitizen(Access_Key) {
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref.where("Access_Key", "==", Access_Key)
      )
      .snapshotChanges();
  }
  /**
   * Method for logging in user to system
   * @param value Holds data coming from Login form and invokes for verfication before allowing access
   */
  loginKiosk(value) {
    return new Promise<any>(async (resolve, reject) => {
      const email = value.email;
      const address = email.split("@").pop();
      if (address == "kiosk.gov.lk") {
        this.auth.signInWithEmailAndPassword(value.email, value.password).then(
          (res) => resolve(res),
          (err) => reject(err)
        );
        var user = firebase.default.auth().currentUser;
        var date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        await eAdministration.set(
          {
            Login: firebase.default.firestore.FieldValue.arrayUnion(
              "kiosk login attempt from " + value.email + " at: " + new Date()
            ),
          },
          { merge: true }
        );
        this.navCtrl.navigateForward("home");
      } else {
        const alert = await this.alertController.create({
          header: "⚠ Unauthorized Access",
          message: "Login attempt failed, service not registered.",
          buttons: ["Close"],
        });
        await alert.present();
        var user = firebase.default.auth().currentUser;
        var date = dateFormat(new Date(), "mm-dd-yyyy");
        const eAdministration = this.firestore
          .collection("eAdministration")
          .doc("eServices")
          .collection("SystemLogs")
          .doc(date);
        await eAdministration.set(
          {
            Login: firebase.default.firestore.FieldValue.arrayUnion(
              "kiosk failed login attempt from " +
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
}
