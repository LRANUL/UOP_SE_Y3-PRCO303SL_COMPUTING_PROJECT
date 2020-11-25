import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(private gAuth: AngularFireAuth, private firestore: AngularFirestore) { }
  registerECitizen(value) {
    return new Promise<any>((resolve, reject) => {
      this.gAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
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
          }).catch((error) => {
            reject();
          });
      }
    })
  }

  eCitizenData() {
    return this.gAuth.user
  }
}
