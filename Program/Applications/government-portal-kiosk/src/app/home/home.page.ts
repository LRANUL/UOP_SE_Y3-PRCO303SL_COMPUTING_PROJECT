import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { NavController } from "@ionic/angular";
var qrResultString: string;
import { AccessService } from "../Service/access.service";
import * as CryptoJS from 'crypto-js'

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  scannedData: string;
  portalScanner = false;
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
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.portalScanner = true;
    setTimeout(() => {
      this.portalScanner = false;
    }, 3000);
  }

  English() {
    this.portalScanner = true;
    console.log("English");
    let welcome = new Audio();
    welcome.src = "assets/audio/welcome-en.mp3";
    welcome.load();
    this.scanner_en = true;
    setTimeout(() => {
      console.log(qrResultString);
      this.scanner_en = false;
      this.portalScanner = false;
      setTimeout(async () => {
        this.firestore
          .collection("eCitizens", (ref) =>
            ref.where(
              "Access_Key",
              "==",
              qrResultString
              // "a22932220415ad2fc8044739c7e4a348541821146879a7bcc1f79b72077ec527"
            )
          )
          .get()
          .forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var MatchID = CryptoJS.AES.decrypt(
                qrResultString,
                doc.data["bioData"]
              );
              if (MatchID == doc.data["GovernmentID"]) {
                welcome.play();
                this.navCtrl.navigateForward("english");
              }
            });
          })
          .catch((error) => {
            let invalidCard = new Audio();
            invalidCard.src = "assets/audio/invalid-card-en.mp3";
            invalidCard.load();
            invalidCard.play();
          });
        //  console.log(value)
        //     //  if(value == false){
        //   if (value == "Invalid") {
        //     let invalidCard = new Audio();
        //     invalidCard.src = "assets/audio/invalid-card-en.mp3";
        //     invalidCard.load();
        //     invalidCard.play();
        //   } else{
        //   // (qrResultString == "Valid") {
        //     welcome.play();
        //     this.navCtrl.navigateForward("english");
        // }
      }, 1000);
    }, 7000);
  }
  Sinhala() {
    this.portalScanner = true;
    console.log("Sinhala");
    let welcome = new Audio();
    welcome.src = "assets/audio/welcome-si.mp3";
    welcome.load();
    this.scanner_si = true;
    setTimeout(() => {
      console.log(qrResultString);
      this.scanner_si = false;
      this.portalScanner = false;
      setTimeout(() => {
        this.firestore
          .collection("eCitizens", (ref) =>
            ref.where(
              "Access_Key",
              "==",
              qrResultString
              // "a22932220415ad2fc8044739c7e4a348541821146879a7bcc1f79b72077ec527"
            )
          )
          .get()
          .forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var MatchID = CryptoJS.AES.decrypt(
                qrResultString,
                doc.data["bioData"]
              );
              if (MatchID == doc.data["GovernmentID"]) {
                welcome.play();
                this.navCtrl.navigateForward("sinhala");
              }
            });
          })
          .catch((error) => {
            let invalidCard = new Audio();
            invalidCard.src = "assets/audio/invalid-card-si.mp3";
            invalidCard.load();
            invalidCard.play();
          });
        // if (qrResultString == "Invalid") {
        //   let invalidCard = new Audio();
        //   invalidCard.src = "assets/audio/invalid-card-si.mp3";
        //   invalidCard.load();
        //   invalidCard.play();
        // } else if (qrResultString == "Valid") {
        //   welcome.play();
        //   this.navCtrl.navigateForward("sinhala");
        // }
      }, 1000);
    }, 7000);
  }
  Tamil() {
    this.portalScanner = true;
    console.log("Tamil");
    let welcome = new Audio();
    welcome.src = "assets/audio/welcome-ta.mp3";
    welcome.load();
    this.scanner_ta = true;
    setTimeout(() => {
      console.log(qrResultString);
      this.scanner_ta = false;
      this.portalScanner = false;
      setTimeout(() => {
        this.firestore
          .collection("eCitizens", (ref) =>
            ref.where(
              "Access_Key",
              "==",
              qrResultString
              // "a22932220415ad2fc8044739c7e4a348541821146879a7bcc1f79b72077ec527"
            )
          )
          .get()
          .forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var MatchID = CryptoJS.AES.decrypt(
                qrResultString,
                doc.data["bioData"]
              );
              if (MatchID == doc.data["GovernmentID"]) {
                welcome.play();
                this.navCtrl.navigateForward("tamil");
              }
            });
          })
          .catch((error) => {
            let invalidCard = new Audio();
            invalidCard.src = "assets/audio/invalid-card-ta.mp3";
            invalidCard.load();
            invalidCard.play();
          });
        // if (qrResultString == "Invalid") {
        //   let invalidCard = new Audio();
        //   invalidCard.src = "assets/audio/invalid-card-ta.mp3";
        //   invalidCard.load();
        //   invalidCard.play();
        // } else if (qrResultString == "Valid") {
        //   welcome.play();
        //   this.navCtrl.navigateForward("tamil");
        // }
      }, 1000);
    }, 7000);
  }
}
