import { Component } from '@angular/core';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
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
  searchFilter: string;
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
      if (localStorage.getItem('Visitor') == null) {
        localStorage.setItem('Visitor', 'false');
        this.loading = false;
        this.home = false;
        this.Welcome = true;
        console.log("New user");
      }
      else if (localStorage.getItem('Visitor') == 'false') {
      // this.loading = false;
      // this.Welcome = false;
      this.loading = false;
      this.Welcome = true;
      
    this.home = true;
        console.log("Old user" + localStorage.getItem('Visitor'));
      }
    }, 5000);
    
  }
  goHome() {
    this.Welcome = false;
    this.home = true;
  }

  availablePages = [{
    "id": 1,
    "name": "Loans",
    "link": ""
  },
  {
    "id": 2,
    "name": "Taxes",
    "link": ""
  },
  {
    "id": 3,
    "name": "NIC",
    "link": ""
  },
  {
    "id": 4,
    "name": "Passports",
    "link": ""
  },
  {
    "id": 6,
    "name": "Educational",
    "link": ""
  }
]
}
