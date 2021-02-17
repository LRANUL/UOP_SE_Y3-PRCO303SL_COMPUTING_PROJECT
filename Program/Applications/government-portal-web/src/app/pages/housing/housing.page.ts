import { Component, OnInit } from '@angular/core';
import * as algoliasearch from 'algoliasearch';

@Component({
  selector: 'app-housing',
  templateUrl: './housing.page.html',
  styleUrls: ['./housing.page.scss'],
})
/**
* Housing Page of Government Portal, this is an intial prebuild for egovernance coverage.
* Currenlty only information is available with search functionality enabled.
* Only Search Function Setup
*/
export class HousingPage implements OnInit {
  private client: any;
  private index: any;
  private ALGOLIA_APP_ID: string = "MGBODS63FP";
  private ALGOLIA_APP_KEY: string = "01c0dc6bd76e601f053adefc271763ed";
  private searchQuery: string = "";
  private algoliaResults = [];
  constructor() { }

  ngOnInit() {
    //  Search Function Init Start
    this.client = algoliasearch(this.ALGOLIA_APP_ID, this.ALGOLIA_APP_KEY,
      { protocol: 'https' });
    this.index = this.client.initIndex("pages");
    //  Search Function Init End
  }
  //  Search Function Starts 
  private pagesList = false;
  private click_in() {
    this.pagesList = true;
  }
  private onClickedOutside(e: Event) {
    this.pagesList = false;
  }
  private search(event) {
    this.index.search({
      query: this.searchQuery
    }).then((data) => {
      this.algoliaResults = data.hits;
    })
  }
  //  Search Function Ends
}