/**
 * CONTAINS REMOTE CONFIG CLASS CODE FOR KIOSK FUNCTIONALITY
 */
import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import "@capacitor-community/firebase-remote-config";
const { FirebaseRemoteConfig } = Plugins;
FirebaseRemoteConfig.initializeFirebase({
  apiKey: "AIzaSyAB8BDQmIz8jCENQDgD0rnzr1GxzLLvChM",
  authDomain: "prco303sl-3f1b2.firebaseapp.com",
  databaseURL: "https://prco303sl-3f1b2.firebaseio.com",
  projectId: "prco303sl-3f1b2",
  storageBucket: "prco303sl-3f1b2.appspot.com",
  messagingSenderId: "249428583886",
  appId: "1:249428583886:web:57574a422325a56a16b79f",
  measurementId: "G-50JXP96D8X",
});

@Injectable({
  providedIn: "root",
})
export class RemoteConfigService {
  remoteConfig: any = null;

  constructor() {
    this.ngOnInit();
  }
  private async ngOnInit() {
    const { FirebaseRemoteConfig } = Plugins;
    this.remoteConfig = FirebaseRemoteConfig as any;
    await this.remoteConfig.initialize({ minimumFetchIntervalInSeconds: 3600 });
    this.remoteConfig.defaultConfig = {
      system_maintenance: "false",
      kiosk_system_maintenance: "false",
    };
  }
  /**
   * Methods for maintenance locks
   * @returns boolean
   */
  async maintenanceLockCheck() {
    if (this.remoteConfig) {
      const maintenanceLock = (await this.maintenanceLock()) || "false";
      if (maintenanceLock == "true") {
        return true;
      }
      return false;
    }
    return false;
  }
  async kioskMaintenanceLockCheck() {
    if (this.remoteConfig) {
      const kioskMaintenanceLock =
        (await this.kioskMaintenanceLock()) || "false";
      if (kioskMaintenanceLock == "true") {
        return true;
      }
      return false;
    }
    return false;
  }
  private async maintenanceLock() {
    return new Promise<string>((resolve, reject) => {
      this.remoteConfig
        .fetchAndActivate()
        .then(() => {
          this.remoteConfig
            .getString({ key: "system_maintenance" })
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }
  private async kioskMaintenanceLock() {
    return new Promise<string>((resolve, reject) => {
      this.remoteConfig
        .fetchAndActivate()
        .then(() => {
          this.remoteConfig
            .getString({ key: "kiosk_system_maintenance" })
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }
}
