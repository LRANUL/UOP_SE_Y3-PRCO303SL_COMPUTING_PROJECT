/**
 * CONTAINS GUIDE CLASS CODE FOR OFFICER FUNCTIONALITY WORKS AS A MODAL TO CORE PAGE
 */
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import * as algoliasearch from "algoliasearch/lite";

@Component({
  selector: "app-guide",
  templateUrl: "./guide.page.html",
  styleUrls: ["./guide.page.scss"],
})
export class GuidePage implements OnInit {
  private client: any;
  private index: any;
  private ALGOLIA_APP_ID = "MGBODS63FP";
  private ALGOLIA_APP_KEY = "01c0dc6bd76e601f053adefc271763ed";
  eDocuments: object;
  dataFilter: object;

  constructor(private modelCtrl: ModalController) {}

  ngOnInit() {
    /**Searching algolia index */
    this.client = algoliasearch(this.ALGOLIA_APP_ID, this.ALGOLIA_APP_KEY, {
      protocol: "https",
    });
    this.index = this.client.initIndex("eGuide");
    this.index
      .search({
        query: this.dataFilter,
        hitsPerPage: 50,
      })
      .then((data) => {
        this.eDocuments = data.hits;
      });
  }
  /**Method for seaching algolia support documents */
  findDocument() {
    this.index
      .search({
        query: this.dataFilter,
      })
      .then((data) => {
        this.eDocuments = data.hits;
      });
  }

  closeGuide() {
    this.modelCtrl.dismiss();
  }
}
