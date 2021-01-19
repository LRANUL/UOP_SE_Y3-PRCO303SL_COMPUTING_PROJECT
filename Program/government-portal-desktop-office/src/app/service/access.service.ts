import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private auth: AngularFireAuth, public alertController: AlertController, private navCtrl: NavController) { }

  /**
  * Method for logging in user to system
  * @param value Holds data coming from Login form and invokes for verfication before allowing access
  */
  loginOfficer(value) {
    return new Promise<any>(async (resolve, reject) => {
      const email = value.email;
      const address = email.split('@').pop();
      if (address != "homeaffairs.gov.lk") {
        this.auth.signInWithEmailAndPassword(value.email, value.password)
          .then(
            res => resolve(res),
            err => reject(err))
        this.navCtrl.navigateForward('office/home-affairs');
      }
      else {
        const alert = await this.alertController.create({
          header: '⚠ Unauthorized Access',
          message: 'Login attempt failed, service not registered.',
          buttons: ['Close']
        });
        await alert.present();
      }
    })
  }

  logoutOfficer() {
    return new Promise<void>((resolve, reject) => {
      if (this.auth.currentUser) {
        this.auth.signOut()
          .then(() => {
            console.log("Signing out");
            this.navCtrl.navigateForward("access");
            resolve();
          })
          .catch((_error) => {
            reject();
          });
      }
    })
  }
}
