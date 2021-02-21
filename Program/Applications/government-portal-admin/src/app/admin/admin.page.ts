import { Component, OnInit } from "@angular/core";
import { AccessService } from "src/app/service/access.service";
import { HttpClient } from "@angular/common/http";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.page.html",
  styleUrls: ["./admin.page.scss"],
})
export class AdminPage implements OnInit {
  accountPanel: boolean;
  userFilter: string;
  userRecords: any;
  accountManage: boolean;
  user: any;

  constructor(
    private accessService: AccessService,
    public http: HttpClient,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.accountPanel = true;
  }

  /**
   * Manages Government Portal accounts
   */
  async manageAccount() {
    this.accountManage = true;
    this.http
      .get(`http://localhost:4242/get-all-users`)
      .subscribe((response) => {
        console.log(response);
        this.userFilter = JSON.stringify(response);
        this.userRecords = JSON.parse(this.userFilter);
      });
  }
  /**
   * Closes Government Portal account services manager
   */
  exitECitizenManager() {
    this.accountManage = false;
  }
  /**
   * Find Government Portal user by registration email
   */
  async findUser(value) {
    this.http.get("http://localhost:4242/get-user?email=" + value).subscribe(
      (data) => {
        console.log(data);
        this.userFilter = JSON.stringify(data);
        var user = JSON.parse(this.userFilter);
        this.userRecords = [user];
      },
      async (error) => {
        console.log(error);
        const alert = await this.alertController.create({
          header: "🚫 Out of Service",
          subHeader: "Server Access Timeout",
          message:
            "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later.",
          buttons: ["OK"],
        });
        await alert.present();
      }
    );
  }
  /**
   * Activate Government Portal user account
   */
  async activateAccount(user) {
    this.http.get("http://localhost:4242/activate-user?uid=" + user).subscribe(
      async (data) => {
        const alert = await this.alertController.create({
          header: "Account Activated ✔",
          message: "Account has been activated",
          buttons: ["OK"],
        });
        await alert.present();
        this.manageAccount();
      },
      async (error) => {
        console.log(error);
        const alert = await this.alertController.create({
          header: "🚫 Out of Service",
          subHeader: "Server Access Timeout",
          message:
            "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later or contact administrator",
          buttons: ["OK"],
        });
        await alert.present();
      }
    );
  }
  /**
   * Disable Government Portal user account
   */
  async disableAccount(user) {
    this.http.get("http://localhost:4242/disable-user?uid=" + user).subscribe(
      async (data) => {
        const alert = await this.alertController.create({
          header: "Account Disabled ✔",
          message: "Account has been disabled",
          buttons: ["OK"],
        });
        await alert.present();
        this.manageAccount();
      },
      async (error) => {
        console.log(error);
        const alert = await this.alertController.create({
          header: "🚫 Out of Service",
          subHeader: "Server Access Timeout",
          message:
            "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later or contact administrator",
          buttons: ["OK"],
        });
        await alert.present();
      }
    );
  }
  /**
   * Delete Government Portal user account
   */
  async deleteAccount(user) {
    this.http.get("http://localhost:4242/delete-user?uid=" + user).subscribe(
      async (data) => {
        const alert = await this.alertController.create({
          header: "Account Deleted ✔",
          message: "Account has been deleted",
          buttons: ["OK"],
        });
        await alert.present();
        this.manageAccount();
      },
      async (error) => {
        console.log(error);
        const alert = await this.alertController.create({
          header: "🚫 Out of Service",
          subHeader: "Server Access Timeout",
          message:
            "Request cannot be sent Government Portal Data Center Server is down to maintenance or high traffic, try again later or contact administrator",
          buttons: ["OK"],
        });
        await alert.present();
      }
    );
  }

  /**Logs out Officer */
  async logoutAdmin() {
    this.accessService.logoutAdmin();
  }
}
