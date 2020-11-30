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
    speed: 3000
  };
  SiteName: string;

  constructor() { }
  ngOnInit() {
    this.loading = true; // loading disabled during development set this.loading to true
    setTimeout(() => {
      this.loading = false;
      if (localStorage.getItem('Visitor') == null) {
        localStorage.setItem('Visitor', 'false');
        this.home = false;
        this.Welcome = true;
        console.log('New user');
      }
      else if (localStorage.getItem('Visitor') === 'false') {
        this.Welcome = false;
        this.home = true;
        console.log('Old user' + localStorage.getItem('Visitor'));
      }
    }, 5000);

  }
  goHome() {
    this.Welcome = false;
    this.home = true;
  }
  // Pages = ['Loans', 'Taxes', 'Passports', 'Educational', 'Security', 'Lands', 'Law'];
  // pageList = this.Pages;
  // selected_index = -1;
  // pagesList = false;

  // click_in() {
  //   this.pagesList = true;
  // }
  // onClickedOutside(e: Event) {
  //   this.pagesList = false;
  // }
  // clickResult() {
  //   this.SiteName
  //   console.log(this.SiteName);
  //   // for (let i = 0; i < this.Pages.length; i++) {
  //   //   if (this.pageList[val].toUpperCase() === this.Pages[i].toUpperCase()) {
  //   //     this.selected_index = i;
  //   // console.log(this.selected_index);

  //   //     break;
  //   //   }
  //   // }
  // }

  // change_query(query) {
  //   let k = 0;
  //   this.pageList = [];
  //   for (let i = 0; i < this.Pages.length; i++) {
  //     if (this.Pages[i].toUpperCase().includes(query.toUpperCase())) {
  //       this.pageList[k] = this.Pages[i];
  //       k += 1;
  //     }
  //   }
  // }
}
