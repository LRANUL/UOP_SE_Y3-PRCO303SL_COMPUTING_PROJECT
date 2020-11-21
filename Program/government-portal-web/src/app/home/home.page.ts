import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loading: boolean;
  home: boolean;
  visitor: string;
  Welcome: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    speed: 400
  };
  constructor() { }
  ngOnInit() {
    this.loading = false; // loading disabled during development
    this.home = true; // delete this line and set this.loading to true
    // setTimeout(() => {
    //   this.loading = false;
    //   this.home = true;
    // }, 5000);
    // if (localStorage.getItem('Visitor') == null) {
      localStorage.setItem('Visitor', 'false');
      this.Welcome = true;
      this.home = false;
      console.log("New user");
    // }
    // else if (localStorage.getItem('Visitor') == 'false') {
    //   this.Welcome = false;
    //   console.log("Old user" + localStorage.getItem('Visitor'));
    // }
  }
  goHome() {
    this.Welcome = false;
    this.home = true;
  }
}
