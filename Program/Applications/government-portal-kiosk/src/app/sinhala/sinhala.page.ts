import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-sinhala',
  templateUrl: './sinhala.page.html',
  styleUrls: ['./sinhala.page.scss'],
})
export class SinhalaPage implements OnInit {
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
