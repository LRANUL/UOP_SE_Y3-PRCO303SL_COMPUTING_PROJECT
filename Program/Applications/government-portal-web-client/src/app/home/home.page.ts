import { Component } from '@angular/core';
import * as algoliasearch from 'algoliasearch';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   client: any;
   index: any;
   ALGOLIA_APP_ID: string = "MGBODS63FP";
   ALGOLIA_APP_KEY: string = "01c0dc6bd76e601f053adefc271763ed";
   searchQuery: string = "";
   algoliaResults = [];
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
//  Search Function Init Start
    this.client = algoliasearch(this.ALGOLIA_APP_ID, this.ALGOLIA_APP_KEY,
      { protocol: 'https' });
    this.index = this.client.initIndex("pages");
//  Search Function Init End

// LOADING DISABLED DURING DEVELOPMENT | UNCOMMENT Line 35 to 50 (Exclude L46) AFTER DEVELOPMENT !
    this.loading = true; 
    
    setTimeout(() => {
      this.loading = false;
      if (localStorage.getItem('Visitor') == null) {
        localStorage.setItem('Visitor', 'false');
        this.home = false;
        this.Welcome = true;
        // console.log('New user');
      }
      else if (localStorage.getItem('Visitor') === 'false') {
        this.Welcome = false;
        this.home = true;
        // console.log('Old user' + localStorage.getItem('Visitor'));
      }
    }, 5000);

  }
  //  Search Function Starts 
   pagesList = false;
   click_in() {
    this.pagesList = true;
  }
   onClickedOutside(e: Event) {
    this.pagesList = false;
  }
   search(event) {
    this.index.search({
      query: this.searchQuery
    }).then((data) => {
      this.algoliaResults = data.hits;
    })
  }
  //  Search Function Ends
   goHome() {
    this.Welcome = false;
    this.home = true;
  }

}
