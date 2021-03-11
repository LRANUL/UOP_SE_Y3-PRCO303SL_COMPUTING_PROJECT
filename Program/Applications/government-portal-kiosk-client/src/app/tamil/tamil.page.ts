import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-tamil",
  templateUrl: "./tamil.page.html",
  styleUrls: ["./tamil.page.scss"],
})
export class TamilPage implements OnInit {
  portalScanner: boolean;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.portalScanner = false;
    // 15 Minutes and logout initiated
    this.kioskUserTimer();
    setTimeout(() => {
      this.navCtrl.navigateForward("home");
    }, 900000);
  }

  kioskUserTimer() {
    // Source refered from https://www.w3schools.com/howto/howto_js_countdown.asp
    let minutes = 15;
    let seconds = 0;
    let SetTime = minutes * 60 + seconds;
    let liveTime = SetTime;
    const convert = (value, seconds) => {
      if (value > seconds) {
        let x = value % seconds;
        liveTime = x;
        return (value - x) / seconds;
      } else {
        return 0;
      }
    };
    const setSeconds = (seconds) => {
      document.querySelector("#seconds").textContent = seconds + "s";
    };
    const setMinutes = (minutes) => {
      document.querySelector("#minutes").textContent = minutes + "m";
    };
    var x = setInterval(() => {
      if (SetTime <= 0) {
        clearInterval(x);
      }
      setMinutes(convert(liveTime, 60));
      setSeconds(liveTime == 60 ? 59 : liveTime);
      SetTime--;
      liveTime = SetTime;
    }, 1000);
  }
  Logout() {
    this.navCtrl.navigateForward("home");
  }
}
