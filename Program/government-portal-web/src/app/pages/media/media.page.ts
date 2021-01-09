import { Component, OnInit } from '@angular/core';
import * as algoliasearch from 'algoliasearch';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
})
/**
* Media Page of Government Portal, this is an intial prebuild for egovernance coverage.
* Currenlty only information is available with search functionality enabled.
* Only Search Function Setup
*/
export class MediaPage implements OnInit {
client: any;
index: any;
ALGOLIA_APP_ID: string = "MGBODS63FP";
ALGOLIA_APP_KEY: string = "01c0dc6bd76e601f053adefc271763ed";
searchQuery: string = "";
algoliaResults = [];
constructor() { }

ngOnInit() {
  //  Search Function Init Start
  this.client = algoliasearch(this.ALGOLIA_APP_ID, this.ALGOLIA_APP_KEY,
    { protocol: 'https' });
  this.index = this.client.initIndex("pages");
  //  Search Function Init End
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
}