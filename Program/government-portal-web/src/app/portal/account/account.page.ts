import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore/';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { GoogleAuthService } from '../../service/google-auth.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(private menu: MenuController, private navCtrl: NavController, private gAuth: AngularFireAuth, private authService: GoogleAuthService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.gAuth.authState.subscribe(async user => {
      if (user) {
        // User is signed in, auto login intiated.
        console.log('SIGNED IN');
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
        console.log('NOT SIGNED IN');
        this.logout();
      }
    });
  }
  async logout() {
    this.authService
      .logoutCitizen()
      .then(async res => {
        const loading = await this.loadingController.create({
          message: 'Logging out...',
          duration: 2000
        });
        await loading.present();

        const { role, data } = await loading.onDidDismiss();
        this.navCtrl.navigateBack("");
      })
      .catch(error => {
      });
  }

  
}
