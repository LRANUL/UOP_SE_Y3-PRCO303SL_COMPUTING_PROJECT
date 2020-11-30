import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls: ['./page-not-found.page.scss'],
})
export class PageNotFoundPage implements OnInit {

  constructor(private navCtrl: NavController,private loadingController: LoadingController) { }

  ngOnInit() {
  }
async redirectHome(){
  const loading = await this.loadingController.create({
    message: 'Redirecting back to Government Portal...',
    duration: 800,
    translucent: true,
  });
  await loading.present();
  setTimeout(() => {
  this.navCtrl.navigateForward('home');
  }, 800);
  

}
}
