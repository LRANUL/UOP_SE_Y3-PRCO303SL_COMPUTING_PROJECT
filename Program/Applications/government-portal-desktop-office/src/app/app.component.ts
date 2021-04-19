import { Component } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OnInit, OnDestroy } from '@angular/core';
import { RemoteConfigService } from './service/remote-config.service';
import { Plugins, NetworkStatus, PluginListenerHandle } from '@capacitor/core';
const { Network } = Plugins;
import firebase from "firebase/app";
import "firebase/performance";
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private networkStatus: any;
  private networkListener: PluginListenerHandle;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private remoteConfig: RemoteConfigService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
  ) {
    this.initializeApp();
  }

  private async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(environment.firebaseConfig);
    // Initializing Application Performance Monitoring accodring to Firebase Documentation
    const performance = firebase.performance();
    const maintenance = await this.remoteConfig.maintenanceLockCheck();
    const officeMaintenanceLockCheck = await this.remoteConfig.officeMaintenanceLockCheck();
    if (maintenance) {
      const alertMaintenance = await this.alertCtrl.create({
        header: 'Under Maintenance',
        subHeader: 'System Down',
        backdropDismiss: false,
        message: 'We are currently maintaining the system and all functions are disabled right now, visit back shortly.',
      });
      await alertMaintenance.present();
    }
    else if (officeMaintenanceLockCheck) {
      const alertMaintenance = await this.alertCtrl.create({
        header: 'Under Maintenance',
        subHeader: 'System Down',
        backdropDismiss: false,
        message: 'We are currently maintaining the system and all functions are disabled right now, visit back shortly.',
      });
      await alertMaintenance.present();
    }
    this.networkListener = Network.addListener('networkStatusChange', async (status) => {
      this.networkStatus = status;
      if (status.connected == false) {
        const loading = await this.loadingController.create({
          message: "Network Down, Please wait while we reconnect you...",
          backdropDismiss: false,
          spinner: "dots",
        });
        await loading.present();
      }
      else if (status.connected == true) {
        this.loadingController.dismiss()
      }
    });
  }
}

