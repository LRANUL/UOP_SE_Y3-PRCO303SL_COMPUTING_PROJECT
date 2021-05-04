import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { NavController } from "@ionic/angular";
import { AccessService } from "../Service/access.service";
import * as CryptoJS from "crypto-js";
import { AlertController } from "@ionic/angular";
var qrResultString: string;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  scannedData: string;
  portalScanner: boolean;
  scanner_en = false;
  scanner_si = false;
  scanner_ta = false;

  clearResult(): void {
    qrResultString = null;
  }

  onCodeResult(resultString: string) {
    qrResultString = resultString;
  }

  constructor(
    private navCtrl: NavController,
    private service: AccessService,
    private firestore: AngularFirestore,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  English() {
    this.portalScanner = true;
    let welcome = new Audio();
    welcome.src = "assets/audio/welcome-en.mp3";
    welcome.load();
    this.scanner_en = true;
    setTimeout(() => {
      this.scanner_en = false;
      this.portalScanner = false;
      setTimeout(async () => {
        console.log(qrResultString)
        if (qrResultString) {
          this.service.getECitizen(qrResultString).subscribe((data) => {
            data.map(async (e) => {
              var Access_PIN = e.payload.doc.data()["Access_PIN"];
              var bioData = e.payload.doc.data()["Biometric_Data"];
              var GovernmentID = e.payload.doc.data()["GovernmentID"];
              var MatchID = CryptoJS.AES.decrypt(
                qrResultString,
                bioData
              ).toString(CryptoJS.enc.Utf8);
              if (MatchID == GovernmentID) {
                this.portalScanner = false;
                const alert = await this.alertController.create({
                  header: "Access PIN Required",
                  inputs: [
                    {
                      name: "Access_PIN",
                      type: "number",
                      max: 999999,
                      placeholder: "6-Digit PIN",
                    },
                  ],
                  buttons: [
                    {
                      text: "Cancel",
                      role: "cancel",
                      handler: () => {
                        qrResultString = null;
                      }
                    },
                    {
                      text: "OK",
                      handler: (data) => {
                        qrResultString = null;
                        if (Access_PIN == data.Access_PIN) {
                          welcome.play();
                          this.navCtrl.navigateForward(
                            "english?id=" + GovernmentID
                          );
                        } else {
                          let invalidCard = new Audio();
                          invalidCard.src = "assets/audio/wrong-pin-en.mp3";
                          invalidCard.load();
                          invalidCard.play();
                        }
                      },
                    },
                  ],
                });
                await alert.present();
              } else {
                let invalidCard = new Audio();
                invalidCard.src = "assets/audio/invalid-card-en.mp3";
                invalidCard.load();
                invalidCard.play();
              }
            });
          });
        } else {
          let invalidCard = new Audio();
          invalidCard.src = "assets/audio/no-card-en.mp3";
          invalidCard.load();
          invalidCard.play();
        }
      }, 1000);
    }, 10000);
  }
  Sinhala() {
    this.portalScanner = true;
    let welcome = new Audio();
    welcome.src = "assets/audio/welcome-si.mp3";
    welcome.load();
    this.scanner_si = true;
    setTimeout(() => {
      this.scanner_si = false;
      this.portalScanner = false;
      setTimeout(async () => {
        if (qrResultString) {
          this.service.getECitizen(qrResultString).subscribe((data) => {
            data.map(async (e) => {
              var Access_PIN = e.payload.doc.data()["Access_PIN"];
              var bioData = e.payload.doc.data()["Biometric_Data"];
              var GovernmentID = e.payload.doc.data()["GovernmentID"];
              var MatchID = CryptoJS.AES.decrypt(
                qrResultString,
                bioData
              ).toString(CryptoJS.enc.Utf8);
              if (MatchID == GovernmentID) {
                this.portalScanner = false;
                const alert = await this.alertController.create({
                  header: "ප්‍රවේශ PIN අවශ්‍යය",
                  inputs: [
                    {
                      name: "Access_PIN",
                      type: "number",
                      max: 999999,
                      placeholder: "6-ඉලක්කම් PIN",
                    },
                  ],
                  buttons: [
                    {
                      text: "අවලංගු කරන්න",
                      role: "cancel",
                      handler: () => {
                        qrResultString = null;
                      }
                    },
                    {
                      text: "හරි",
                      handler: (data) => {
                        qrResultString = null;
                        if (Access_PIN == data.Access_PIN) {
                          welcome.play();
                          this.navCtrl.navigateForward(
                            "sinhala?id=" + GovernmentID
                          );
                        } else {
                          let invalidCard = new Audio();
                          invalidCard.src = "assets/audio/wrong-pin-si.mp3";
                          invalidCard.load();
                          invalidCard.play();
                        }
                      },
                    },
                  ],
                });
                await alert.present();
              } else {
                let invalidCard = new Audio();
                invalidCard.src = "assets/audio/invalid-card-si.mp3";
                invalidCard.load();
                invalidCard.play();
              }
            });
          });
        } else {
          let invalidCard = new Audio();
          invalidCard.src = "assets/audio/no-card-si.mp3";
          invalidCard.load();
          invalidCard.play();
        }
      }, 1000);
    }, 10000);
  }
  Tamil() {
    this.portalScanner = true;
    let welcome = new Audio();
    welcome.src = "assets/audio/welcome-ta.mp3";
    welcome.load();
    this.scanner_ta = true;
    setTimeout(() => {
      this.scanner_ta = false;
      this.portalScanner = false;
      setTimeout(async () => {
        if (qrResultString) {
          this.service.getECitizen(qrResultString).subscribe((data) => {
            data.map(async (e) => {
              var Access_PIN = e.payload.doc.data()["Access_PIN"];
              var bioData = e.payload.doc.data()["Biometric_Data"];
              var GovernmentID = e.payload.doc.data()["GovernmentID"];
              var MatchID = CryptoJS.AES.decrypt(
                qrResultString,
                bioData
              ).toString(CryptoJS.enc.Utf8);
              if (MatchID == GovernmentID) {
                this.portalScanner = false;
                const alert = await this.alertController.create({
                  header: "அணுகல் பின் தேவை",
                  inputs: [
                    {
                      name: "Access_PIN",
                      type: "number",
                      max: 999999,
                      placeholder: "6-இலக்க பின்",
                    },
                  ],
                  buttons: [
                    {
                      text: "ரத்துசெய்",
                      role: "cancel",
                      handler: () => {
                        qrResultString = null;
                      }
                    },
                    {
                      text: "சரி",
                      handler: (data) => {
                        qrResultString = null;
                        if (Access_PIN == data.Access_PIN) {
                          welcome.play();
                          this.navCtrl.navigateForward(
                            "tamil?id=" + GovernmentID
                          );
                        } else {
                          let invalidCard = new Audio();
                          invalidCard.src = "assets/audio/wrong-pin-ta.mp3";
                          invalidCard.load();
                          invalidCard.play();
                        }
                      },
                    },
                  ],
                });
                await alert.present();
              } else {
                let invalidCard = new Audio();
                invalidCard.src = "assets/audio/invalid-card-ta.mp3";
                invalidCard.load();
                invalidCard.play();
              }
            });
          });
        } else {
          let invalidCard = new Audio();
          invalidCard.src = "assets/audio/no-card-ta.mp3";
          invalidCard.load();
          invalidCard.play();
        }
      }, 1000);
    }, 10000);
  }
}
