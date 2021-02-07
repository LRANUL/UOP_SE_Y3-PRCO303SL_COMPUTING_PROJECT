import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AlertController, NavController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    public alertController: AlertController,
    private navCtrl: NavController
  ) { }

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
