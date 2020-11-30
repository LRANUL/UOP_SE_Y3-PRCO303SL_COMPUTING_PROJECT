import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(private gAuth: AngularFireAuth, private firestore: AngularFirestore) {
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
      this.firestore.collection('BirthRegistrations').doc(""+value.birthRegNo+"").ref.get().then((doc) => {
        if (doc.exists) {
          if (doc.data()['birthRegNo'] == value.birthRegNo) {
            return new Promise<any>((resolve, reject) => {
              console.log('eCitizen Registered')
              this.firestore.collection('eCitizens').doc(value.email).set({
                Full_Name: value.fullName.toUpperCase(),
                Gender: value.gender.toUpperCase(),
                Date_Of_Birth: value.dateOfBirth,
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

  loginCitizen(value) {
    return new Promise<any>((resolve, reject) => {
      this.gAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  logoutCitizen() {
    return new Promise((resolve, reject) => {
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
