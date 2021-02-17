import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-english',
  templateUrl: './english.page.html',
  styleUrls: ['./english.page.scss'],
})
export class EnglishPage implements OnInit {
  portalScanner: boolean;

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.portalScanner = false;
    // 10 Minutes and logout initiated
    setTimeout(() => {
    this.navCtrl.navigateForward("home");
    }, 600000 );
  }

}
