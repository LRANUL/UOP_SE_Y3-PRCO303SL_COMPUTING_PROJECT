import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-page-under-construction',
  templateUrl: './page-under-construction.page.html',
  styleUrls: ['./page-under-construction.page.scss'],
})
/**
 * Component prepared for informing visitors of pages that require work or under maintanance
 * Currently on Registration component is functional from related pages as per objective of the
 * Project Initiation further updates and could introduces during enhancements in the future.
 */
export class PageUnderConstructionPage implements OnInit {

  constructor(protected navCtrl: NavController) { }

  ngOnInit() {
  }

}
