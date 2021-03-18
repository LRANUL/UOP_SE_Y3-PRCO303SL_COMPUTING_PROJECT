import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import { AngularFirestore } from "@angular/fire/firestore";
import { AlertController, ToastController } from "@ionic/angular";
import * as dateFormat from "dateformat";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";

/**
 * Service Page contains mandatory methods for application running which are directly called by other components when required
 * Update with care, certains methods are used in more than in onr place. Updates can cause the application to halt processess.
 *
 * Firebase Authentication, Firestore Management is controlled here.
 */
@Injectable({
  providedIn: "root",
})
export class GoogleAuthService {
  constructor(
    protected route: Router,
    public toastController: ToastController,
    protected gAuth: AngularFireAuth,
    protected firestore: AngularFirestore,
    public alertController: AlertController
  ) {
    // TESTED AUTH SYSTEMS
    /**
     * @example
     *  this.gAuth.authState.subscribe(user => {
     *  if (user) {
     *    // User is signed in.
     *    console.log('User is signed in');
     *    }
     *  else {
     *    // No user is signed in.
     *    console.log('User is NOT signed in');
     *    }
     *  });
     *
     */
  }
  /**
   * Method for Registering user with the System
   * @param value Takes all inputs from Registration form
   * @param value.birthRegNo Holds the applicants Birth Certificate Registration Number
   * @param value.dateBirth Holds the applicants Date of Birth
   * @param value.fullName Holds the applicants Full Name
   * These 3 parameters are verfied before proceeding with the registration
   *
   * @example
   *  doc.data()['birthRegNo'] == value.birthRegNo && doc.data()['dateOfBirth'] == dateBirth && doc.data()['Full_Name'] == value.fullName.toUpperCase()
   *
   */
  registerECitizen(value) {
    return new Promise<any>(async (_resolve, _reject) => {
      this.firestore
        .collection("BirthRegistrations")
        .doc("" + value.birthRegNo + "")
        .ref.get()
        .then(async (doc) => {
          if (doc.exists) {
            var dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
            if (
              doc.data()["birthRegNo"] == value.birthRegNo &&
              doc.data()["gender"] == value.gender.toUpperCase() &&
              doc.data()["dateOfBirth"] == dateBirth &&
              doc.data()["Full_Name"] == value.fullName.toUpperCase()
            ) {
              return new Promise<any>(async (resolve, reject) => {
                this.gAuth
                  .createUserWithEmailAndPassword(value.email, value.password)
                  .then(
                    (res) => resolve(res),
                    (err) => reject(err)
                  );

                this.gAuth.authState.subscribe(async (user) => {
                  if (user) {
                    user.updateProfile({
                      displayName: value.GovernmentID,
                      photoURL: value.downloadURL,
                    });
                  }
                  // Access PIN for Users via Portal Card
                  var Access_PIN = Math.floor(
                    Math.random() * 9000000 + 1000000
                  );
                  // https://code.google.com/archive/p/crypto-js/

                  var Access_Key = CryptoJS.AES.encrypt(
                    value.GovernmentID,
                    value.bioData
                  ).toString();
                  /**
                   * Data gets stored on Firebase for references
                   * */
                  this.firestore
                    .collection("eCitizens")
                    .doc(value.GovernmentID)
                    .set({
                      Access_PIN: Access_PIN,
                      Access_Key: Access_Key,
                      Full_Name: value.fullName.toUpperCase(),
                      Gender: value.gender.toUpperCase(),
                      Date_Of_Birth: dateBirth,
                      Place_Of_Birth: value.placeOfBirth.toUpperCase(),
                      Registar_Division: value.registarDivision.toUpperCase(),
                      Birth_Reg_No: value.birthRegNo,
                      Biometric_Data: value.bioData,
                      GovernmentID: value.GovernmentID,
                      downloadURL: value.downloadURL,
                      Father_Name: value.fatherName.toUpperCase(),
                      Mother_Name: value.motherName.toUpperCase(),
                      Prefix: value.prefix,
                      homeAddress: value.homeAddress.toUpperCase(),
                      officeAddress: value.officeAddress.toUpperCase(),
                      mobile: value.mobile,
                      landLine: value.landLine,
                      Email: value.email.toUpperCase(),
                      createdDateTime: new Date(),
                      status: "Active",
                    })
                    .then(
                      async (res) => {
                        resolve(res);
                        const eCitizen = this.firestore
                          .collection("eCitizens")
                          .doc(value.GovernmentID);
                        await eCitizen.set(
                          {
                            uid: "" + user.uid,
                          },
                          { merge: true }
                        );
                      },
                      (err) => reject(err)
                    );
                });
                // console.log("eCitizen Registered");
                /**
                 * Once verifed registration takes place and informs applicant about the process by toast messages
                 * If registration is successful user will be redirect to login page
                 */
                const toast = await this.toastController.create({
                  message: "Registration successful ✅",
                  duration: 2000,
                });
                toast.present();
                this.route.navigate(["sign-in"]);
              });
            } else {
              /**
               * Informs applicant that the details dont't match with record
               */
              // console.log("BIRTH REGISTRATION NOT MATCH!");
              const alert = await this.alertController.create({
                header: "Registration Failed",
                subHeader: "BIRTH REGISTRATION DATA MISMATCH",
                message:
                  "Your registration has failed, as the entered details does not your match records.",
                buttons: ["Retry"],
              });
              await alert.present();
            }
          } else {
            /**
             * Informs applicant that the Birth Registration number is invalid to proceed further
             * This logic condition is set to prevent malicous access to system and it's resources
             */
            // console.log("INVALID BIRTH REGISTRATION NO.");
            const alert = await this.alertController.create({
              header: "⚠ Registration Failed",
              subHeader: "INVALID BIRTH REGISTRATION NO.",
              message:
                "Your registration has failed, as the entered details are not valid.",
              buttons: ["Retry"],
            });
            await alert.present();
          }
        });
    });
  }

  /**
   * Method reponsible for sending NIC applications via Government Portal
   * To prevent third party usage of Government Resources secondary validation takes place to validate entered data before submitting application
   * This restricts that only the personal account holder to apply / Any form of Joint/Enterprise/Partner accounts are available at this time
   *
   * @param value This holds NIC application data send by registered user via forms available on the Account Portal
   *
   */
  async sendNICApplication(value, token) {
    return new Promise<any>(async (_resolve, _reject) => {
      this.firestore
        .collection("BirthRegistrations")
        .doc("" + value.birthCertNo + "")
        .ref.get()
        .then(async (doc) => {
          // console.log(doc.data());
          if (doc.exists) {
            var dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
            // console.log(value);
            if (
              doc.data()["birthRegNo"] == value.birthCertNo &&
              doc.data()["gender"] == value.gender.toUpperCase() &&
              doc.data()["dateOfBirth"] == dateBirth
            ) {
              return new Promise<any>((resolve, reject) => {
                var user = firebase.default.auth().currentUser;
                this.firestore
                  .collection("/eApplications/")
                  .doc(token)
                  .set({
                    GovernmentID: user.displayName,
                    token: token,
                    type: "NIC-Application",
                    status: "New",
                    payment_status: "unpaid",
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
                    sentTimeStamp: "" + new Date(),
                    processedTimeStamp: "",
                    approvedTimeStamp: "",
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
            // console.log("BIRTH REGISTRATION NUMBER NOT FOUND!");
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
  /**
   * Method reponsible for sending Support messages via Government Portal
   *
   * @param value This holds Support message data send by registered user via forms available on the Account Portal
   *
   */
  sendSupportMessage(value, name) {
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
        var user = firebase.default.auth().currentUser;
        this.firestore
          .collection("/eSupport/")
          .doc()
          .set({
            Description: value.message,
            FullName: name,
            GovernmentID: user.displayName,
            Status: "New",
            Type: "eCitizen",
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
  getESupportMessages() {
    var user = firebase.default.auth().currentUser;

    return this.firestore
      .collection("eSupport", (ref) =>
        ref.where("GovernmentID", "==", user.displayName)
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
  /**
   * Method for logging in user to system
   * @param value Holds data coming from Login form and invokes for verfication before allowing access
   */
  loginCitizen(value) {
    return new Promise<any>((resolve, reject) => {
      this.gAuth.signInWithEmailAndPassword(value.email, value.password).then(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  /**
   * On user command initiates Firebase signout, this method is accessible by all accounts for users, officers and administrators
   */
  logoutCitizen() {
    return new Promise<void>((resolve, reject) => {
      if (this.gAuth.currentUser) {
        this.gAuth
          .signOut()
          .then(() => {
            // console.log("Signing out");
            resolve();
          })
          .catch((_error) => {
            reject();
          });
      }
    });
  }

  /**
   * Method used for fetching current active user data from firebase these include email, photo, name of the authenticated user
   * Used for displaying data at required functions
   */
  eCitizenData() {
    return this.gAuth.user;
  }
}
