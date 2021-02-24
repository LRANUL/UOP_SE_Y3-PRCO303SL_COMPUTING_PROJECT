import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AlertController, NavController } from "@ionic/angular";
import * as dateFormat from "dateformat";
import * as firebase from "firebase";
@Injectable({
  providedIn: 'root'
})
export class AccessService {
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
          header: "✅ Support Requested",
          subHeader: "Message Sent",
          message:
            "Your message has been sent, wait for a reponse from support.",
          buttons: ["OK"],
        });
        await alert.present();
        this.firestore
          .collection("/eSupport/")
          .doc()
          .set({
            Description: value.message,
            FullName: name,
            GovernmentID: GovernmentID,
            Status: "New",
            Subject: value.subject,
            Response: "Message Sent | Wait for Response",
          })
          .then(
            (response) => resolve(response),
            (error) => reject(error)
          );
      });
    });
  }
  getESupportMessages(GovernmentID) {
    return this.firestore
      .collection("eSupport", (ref) =>
        ref.where("GovernmentID", "==", GovernmentID)
      )
      .snapshotChanges();
  }

  getEApplications() {
    var user = firebase.default.auth().currentUser;
    return this.firestore
      .collection("eApplications", (ref) =>
        ref.where("GovernmentID", "==", user.displayName)
      )
      .snapshotChanges();
  }
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    public alertController: AlertController,
    private navCtrl: NavController
  ) { }
/**
   * Method reponsible for sending NIC applications via Government Portal
   * To prevent third party usage of Government Resources secondary validation takes place to validate entered data before submitting application
   * This restricts that only the personal account holder to apply / Any form of Joint/Enterprise/Partner accounts are available at this time
   *
   * @param value This holds NIC application data send by registered user via forms available on the Account Portal
   *
   */
  sendNICApplication(value,GovernmentID) {
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
                this.firestore
                  .collection("/eApplications/")
                  .doc()
                  .set({
                    type: "NIC-Application",
                    status: "New",
                    GovernmentID: GovernmentID,
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
/**Method for getting eCitizen data for Access key using scanner */
  getECitizen(Access_Key){
    return this.firestore
      .collection("eCitizens", (ref) =>
        ref
          .where("Access_Key", "==", Access_Key)
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
        this.navCtrl.navigateForward("home");
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

}
