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
  constructor() { }
  ngOnInit() {
    this.loading = false; // loading disabled during development set this.loading to true
    setTimeout(() => {
      this.loading = false;
      if (localStorage.getItem('Visitor') == null) {
        localStorage.setItem('Visitor', 'false');
        this.home = false;
        this.Welcome = true;
        console.log("New user");
      }
      else if (localStorage.getItem('Visitor') == 'false') {
        this.Welcome = false;
        this.home = true;
        console.log("Old user" + localStorage.getItem('Visitor'));
      }
    }, 5000);

  }
  goHome() {
    this.Welcome = false;
    this.home = true;
  }
  list_original = ['Loans', 'Taxes', 'Passports', 'Educational', 'Security', 'Lands', 'Law'];
  list_to_show = this.list_original;
  selected_index = -1;
  show_list = false;

  click_in() {
    this.show_list = true;
  }
  onClickedOutside(e: Event) {
    this.show_list = false;
  }
  click_item(val) {
    for (let i = 0; i < this.list_original.length; i++) {
      if (this.list_to_show[val].toUpperCase() === this.list_original[i].toUpperCase()) {
        this.selected_index = i;
        break;
      }
    }
  }

  change_query(query) {
    let k = 0;
    this.list_to_show = [];
    for (let i = 0; i < this.list_original.length; i++) {
      if (this.list_original[i].toUpperCase().includes(query.toUpperCase())) {
        this.list_to_show[k] = this.list_original[i];
        k += 1;
      }
    }
  }

}
