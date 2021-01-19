import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { ToastController, AlertController, NavController, LoadingController, MenuController } from '@ionic/angular';
import * as firebase from 'firebase';
import { AccessService } from 'src/app/service/access.service';

@Component({
  selector: 'app-home-affairs',
  templateUrl: './home-affairs.page.html',
  styleUrls: ['./home-affairs.page.scss'],
})
export class HomeAffairsPage implements OnInit {
  requestType: any;
  assigneeName: any;
  applicationDescription: any;
  applicationStatus: any;
  receivedTime: any;

  constructor(private menu: MenuController, private firestore: AngularFirestore, public toastController: ToastController, public alertController: AlertController, public formBuilder: FormBuilder, private gAuth: AngularFireAuth, private navCtrl: NavController, private accessService: AccessService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.menu.open('start');
    // var data = this.firestore.collection('/eApplications/').snapshotChanges();
    //       ModuleCode = data.data()['moduleCode'] + "-" + e.payload.doc.data()['moduleTitle']
    //       LocationCheck = e.payload.doc.data()['LocationCheck']
    this.firestore.collection('/eApplications/').doc('NICApplication').ref.get().then((doc) => {
      if (doc.exists) {
        console.log(doc.data)
        this.requestType = doc.data()['requestType'];
        this.assigneeName = doc.data()['division'];
        this.applicationDescription = doc.data()['description'];
        this.applicationStatus = doc.data()['status'];
        this.receivedTime = doc.data()['TimeStamp'].toDate();
      }
    })
  }
  async logoutOfficer() {
    this.accessService.logoutOfficer();
  }
}
