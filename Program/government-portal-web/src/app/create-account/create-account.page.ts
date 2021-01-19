import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { NavController } from '@ionic/angular';
import { GoogleAuthService } from '../service/google-auth.service';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * Create Account Page Responsible for handling backend logic of Client Account Registration, 
 * Validation for forms are set as per requirements of Government regulations, data available on the users birth certificate would be
 * required for registration
 */
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  imageURL = '';
  CollectionPath = '/Users/eCitizens';
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;
  progress: Observable<number>;
  validations_form: FormGroup;
  errorMessage: string;
  constructor(public formBuilder: FormBuilder, private authService: GoogleAuthService, private storage: AngularFireStorage) { }

  ngOnInit() {
    /**
     * Mandatory form validators for registration process, applicant has to fill all data which is usally present on their
     * birth certificate
     */
    this.validations_form = this.formBuilder.group({
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])),
      password: new FormControl("", Validators.compose([Validators.minLength(15), Validators.maxLength(30), Validators.required])),
      fullName: new FormControl("", Validators.compose([Validators.minLength(1), Validators.required])),
      gender: new FormControl("", Validators.compose([Validators.minLength(1), Validators.required])),
      dateOfBirth: new FormControl("", Validators.compose([])),
      placeOfBirth: new FormControl("", Validators.compose([Validators.minLength(1), Validators.required])),
      registarDivision: new FormControl("", Validators.compose([Validators.minLength(1), Validators.required])),
      birthRegNo: new FormControl("", Validators.compose([Validators.minLength(1), Validators.required])),
      fatherName: new FormControl("", Validators.compose([Validators.minLength(1), Validators.required])),
      motherName: new FormControl("", Validators.compose([Validators.minLength(1), Validators.required])),
      GovernmentID: new FormControl("", Validators.compose([])),
      downloadURL: new FormControl("", Validators.compose([])),
      landLine: new FormControl("", Validators.compose([])),
      mobile: new FormControl("", Validators.compose([])),
      homeAddress: new FormControl("", Validators.compose([])),
      officeAddress: new FormControl("", Validators.compose([])),
    });
  }
  /**
   * Validation messages to user
   */
  validation_messages = {
    email: [
      {
        type: "required",
        message: "Your Government Portal registered email is required."
      }, {
        type: "pattern",
        message: "Invalid email."
      }
    ],
    password: [
      {
        type: "required",
        message: "Password is required."
      }, {
        type: "minlength",
        message: "Password must be at least 15 characters long."
      }, {
        type: "maxlength",
        message: "Password cannot be longer than 30 characters long."
      }
    ]
  };
  /**
   * Method reposible for fetching data from login form and sending to google-auth services page for registration after verification
   * @param value hold validated values from login form
   */
  registerECitizen(value) {
    this.authService.registerECitizen(value)
      .then(res => {
        console.log(res);
        console.log(this.imageURL)
      })
  }
  /**
   * Method responsible for uploading applicants Photograph to cloud and generating a Government Portal ID 
   * (This method was recently updated to improve scalability from Email Key to Portal ID)
   * @param event Captures image upload event and uploads image to firebase storage
   */
  async userPhoto(event) {
    var GovernmentID;
    var downloadURL;
    GovernmentID = "A" + Math.floor((Math.random() * 9000000000) + 1000000000);
    this.validations_form.patchValue({ GovernmentID: GovernmentID });
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.CollectionPath}/${GovernmentID}/ProfilePhoto`;
      const fileRef: AngularFireStorageReference = this.storage.ref(filePath);
      this.task = this.storage.upload(filePath, file);
      this.progress = this.task.percentageChanges();

      this.task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            downloadURL = ""+ downloadURL;
            console.log(downloadURL);
            this.validations_form.patchValue({ downloadURL: downloadURL });
          });
        })
      )
        .subscribe();
    }
  }
}
