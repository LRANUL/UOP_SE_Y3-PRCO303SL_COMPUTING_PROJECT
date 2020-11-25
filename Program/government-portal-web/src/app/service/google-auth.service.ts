import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(private gAuth: AngularFireAuth) { }
  registerECitizen(value) {
    return new Promise<any>((resolve, reject) => {
      this.gAuth.createUserWithEmailAndPassword(value.userID, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })

  }

  loginCitizen(value) {
    return new Promise<any>((resolve, reject) => {
      this.gAuth.signInWithEmailAndPassword(value.userID, value.password)
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
