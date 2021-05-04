import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { RemoteConfigService } from './service/remote-config.service';
import firebase from "firebase/app";
import "firebase/performance";
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private remoteConfig: RemoteConfigService,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  private async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(environment.config);
    // Initializing Application Performance Monitoring accodring to Firebase Documentation
    const performance = firebase.performance();
    const maintenance = await this.remoteConfig.maintenanceLockCheck();
    const webMaintenanceLockCheck = await this.remoteConfig.webMaintenanceLockCheck();
    if (maintenance) {
      const alertMaintenance = await this.alertCtrl.create({
        header: 'Under Maintenance',
        subHeader: 'System Down',
        backdropDismiss: false,
        message: 'We are currently maintaining the system and all functions are disabled right now, visit back shortly.',
      });
      await alertMaintenance.present();
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    }
    else if (webMaintenanceLockCheck) {
      const alertMaintenance = await this.alertCtrl.create({
        header: 'Under Maintenance',
        subHeader: 'System Down',
        backdropDismiss: false,
        message: 'We are currently maintaining the system and all functions are disabled right now, visit back shortly.',
      });
      await alertMaintenance.present();
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    }
  }

}
