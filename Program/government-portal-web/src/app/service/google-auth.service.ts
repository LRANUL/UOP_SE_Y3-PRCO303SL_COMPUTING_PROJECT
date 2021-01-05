import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';
import * as dateFormat from 'dateformat';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(private gAuth: AngularFireAuth, private firestore: AngularFirestore, public alertController: AlertController) {
    // TESTED AUTH SYSTEMS
    // this.gAuth.authState.subscribe(user => {
    //   if (user) {
    //     // User is signed in.
    //     console.log('User is signed in');
    //   }
    //   else {
    //     // No user is signed in.
    //     console.log('User is NOT signed in');
    //   }
    // });
  }

  registerECitizen(value) {
    return new Promise<any>(async (_resolve, _reject) => {
      this.firestore.collection('BirthRegistrations').doc("" + value.birthRegNo + "").ref.get().then((doc) => {
        if (doc.exists) {
          var dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
          if (doc.data()['birthRegNo'] == value.birthRegNo) {
            return new Promise<any>((resolve, reject) => {
              console.log('eCitizen Registered')
              this.firestore.collection('eCitizens' + value.email + '/Account').doc('Profile').set({
                Full_Name: value.fullName.toUpperCase(),
                Gender: value.gender.toUpperCase(),
                Date_Of_Birth: dateBirth,
                Place_Of_Birth: value.placeOfBirth.toUpperCase(),
                Registar_Division: value.registarDivision.toUpperCase(),
                Birth_Reg_No: value.birthRegNo,
                Father_Name: value.fatherName.toUpperCase(),
                Mother_Name: value.motherName.toUpperCase(),
                Email: value.email.toUpperCase(),
                createdDateTime: new Date(),
                status: "Active"
              })
                .then(
                  (res) => {
                    resolve(res)
                    this.gAuth.createUserWithEmailAndPassword(value.email, value.password)
                      .then(
                        res => resolve(res),
                        err => reject(err))
                  },
                  err => reject(err)
                )
            })

          } else {
            console.log('INVALID BIRTH REGISTRATION NO.');
          }
        }
        else {
          console.log('BIRTH REGISTRATION NUMBER NOT FOUND!');
        }
      })
    })
  }

  sendNICApplication(value) {
    return new Promise<any>(async (_resolve, _reject) => {
      this.firestore.collection('BirthRegistrations').doc("" + value.birthCertNo + "").ref.get().then(async (doc) => {
        if (doc.exists) {
          var dateBirth = dateFormat(value.dateOfBirth, "mm/dd/yyyy");
          console.log(doc.data())
          if (doc.data()['birthRegNo'] == value.birthCertNo && doc.data()['dateofBirth'] == dateBirth) {
            const alert = await this.alertController.create({
              header: '✅ Application Requested',
              subHeader: 'Application Sent',
              message: 'Your application has been sent, check Services page for process tracking.',
              buttons: ['OK']
            });
            await alert.present();
            return new Promise<any>((resolve, reject) => {
              this.firestore.collection('eCitizens/' + value.email + '/eApplications/').doc('NICApplication').set({
                status: "Active New",
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
                certDate: value.certDate,
                cardNo: value.cardNo,
                nicDate: value.nicDate,
                policeName: value.policeName,
                policeReportDate: value.policeReportDate,
                homePhone: value.homePhone,
                mobilePhone: value.mobilePhone,
                requestType: value.NICType,
                TimeStamp: new Date(),
              }).then(response => resolve(response),
                error => reject(error))
            })
          } else {
            console.log('INVALID BIRTH REGISTRATION NO. OR DATE OF BIRTH' + dateBirth + "  " + value.birthCertNo);
            const alert = await this.alertController.create({
              header: '⚠ Application Not Sent',
              subHeader: 'Registration Details !',
              message: 'Your application has not been sent, as the entered details does not your match records.',
              buttons: ['Retry']
            });
            await alert.present();
          }
        }
        else {
          console.log('BIRTH REGISTRATION NUMBER NOT FOUND!');
          const alert = await this.alertController.create({
            header: '⚠ Application Not Sent !',
            subHeader: 'Birth Registration',
            message: 'Your application has not been sent, as your details does not match any records.',
            buttons: ['Close']
          });
          await alert.present();
        }
      })
    })
  }


  loginCitizen(value) {
    return new Promise<any>((resolve, reject) => {
      this.gAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  logoutCitizen() {
    return new Promise<void>((resolve, reject) => {
      if (this.gAuth.currentUser) {
        this.gAuth.signOut()
          .then(() => {
            console.log("Signing out");
            resolve();
          }).catch((_error) => {
            reject();
          });
      }
    })
  }

  eCitizenData() {
    return this.gAuth.user
  }
}
