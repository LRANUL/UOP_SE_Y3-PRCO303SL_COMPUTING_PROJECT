import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OnInit, OnDestroy } from '@angular/core';
import { Plugins, NetworkStatus, PluginListenerHandle } from '@capacitor/core';
const { Network } = Plugins;

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
    private alertController: AlertController,
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.networkListener = Network.addListener('networkStatusChange', async (status) => {
      this.networkStatus = status;
      let alertOffline;
      let alertOnline;
      if (status.connected == false) {
        alertOffline = await this.alertController.create({
          header: 'OFFLINE',
          subHeader: 'Disconnected/No Network',
          message: 'Disconnected from Headquaters',
          backdropDismiss: false,
          buttons: ['Close'],
        });
        await alertOffline.present();
      }
      else if (status.connected == true) {
        alertOnline = await this.alertController.create({
          header: 'ONLINE',
          subHeader: 'Reconnection Successful',
          message: 'Connected to Headquaters',
          buttons: ['OK'],
        });
        await alertOnline.present();
      }
      // console.log('Network status changed', status);
    });
  }

}
