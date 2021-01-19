import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase';
import { ToastController, AlertController, NavController, LoadingController } from '@ionic/angular';
import { GoogleAuthService } from 'src/app/service/google-auth.service';

@Component({
  selector: 'app-home-affairs',
  templateUrl: './home-affairs.page.html',
  styleUrls: ['./home-affairs.page.scss'],
})
export class HomeAffairsPage implements OnInit {

  Authorised = false;
  Unauthorised = false;
  userEmail: string;
  menu: any;

  constructor(private firestore: AngularFirestore, public toastController: ToastController, public alertController: AlertController, private navCtrl: NavController, private gAuth: AngularFireAuth, private authService: GoogleAuthService, private loadingController: LoadingController) { }

  ngOnInit() {
    /**
    * At the initiation of page user authenticity is checked and allowed access to account portal
    * all activity is tracked and limited per single user per device at the current stage
    */
    // AUTHENTICATION MANAGER
    this.gAuth.authState.subscribe(async user => {
      if (user) {
        this.Authorised = true;
        this.userEmail = user.email;
        // User is signed in, auto login intiated.
        console.log('SIGNED IN');
        /**
         * Loading controller set to hold portal till it load/fetch data from firebase
         * This and other controllers allows to optimise performance by 'lazy loading' components and data
         */
        const loading = await this.loadingController.create({
          message: 'Please wait...',
          duration: 200,
          translucent: true,
          backdropDismiss: true
        });
        await loading.present();

        console.log('Loading dismissed!');

        this.navCtrl.navigateForward('account');
        this.menu.enable(true, 'first');
        this.menu.open('first');
      }
      else {
        // No user is signed in.
        // this.Unauthorised = true;
        this.Authorised = true;

        console.log('NOT SIGNED IN');
        // this.navCtrl.navigateBack("");
        // this.logout();
      }
    });
  }
  
}
