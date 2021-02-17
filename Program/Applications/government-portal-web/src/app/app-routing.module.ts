import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from "@angular/fire/auth-guard";

/**
 *  Redirect Unauthorized users to Access page
 */
const redirectUnauthorizedToAccess = () => redirectUnauthorizedTo(["/sign-in"]);

/**
 *  Access Automated for Authorized users to Account page
 */
const redirectLoggedInToAccount = () => redirectLoggedInTo(["/account"]);

/**
 * Application Routing
 * Manage routes of the application from here.
 */
const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule)
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "sign-in",
    loadChildren: () =>
      import("./sign-in/sign-in.module").then((m) => m.SignInPageModule),
    ...canActivate(redirectLoggedInToAccount)
  },
  {
    path: "create-account",
    loadChildren: () =>
      import("./create-account/create-account.module").then(
        (m) => m.CreateAccountPageModule
      )
  },
  {
    path: "account",
    loadChildren: () =>
      import("./portal/account/account.module").then(
        (m) => m.AccountPageModule
      ),
    ...canActivate(redirectUnauthorizedToAccess)
  },
  {
    path: "page-under-construction",
    loadChildren: () =>
      import(
        "./maintainance/page-under-construction/page-under-construction.module"
      ).then((m) => m.PageUnderConstructionPageModule)
  },
  {
    path: "page-not-found",
    loadChildren: () =>
      import("./maintainance/page-not-found/page-not-found.module").then(
        (m) => m.PageNotFoundPageModule
      )
  },
  {
    path: "registrations",
    loadChildren: () =>
      import("./pages/registrations/registrations.module").then(
        (m) => m.RegistrationsPageModule
      )
  },
  {
    path: "education",
    loadChildren: () =>
      import("./pages/education/education.module").then(
        (m) => m.EducationPageModule
      )
  },
  {
    path: "agriculture",
    loadChildren: () =>
      import("./pages/agriculture/agriculture.module").then(
        (m) => m.AgriculturePageModule
      )
  },
  {
    path: "trading",
    loadChildren: () =>
      import("./pages/trading/trading.module").then((m) => m.TradingPageModule)
  },
  {
    path: "banking",
    loadChildren: () =>
      import("./pages/banking/banking.module").then((m) => m.BankingPageModule)
  },
  {
    path: "travel",
    loadChildren: () =>
      import("./pages/travel/travel.module").then((m) => m.TravelPageModule)
  },
  {
    path: "justice",
    loadChildren: () =>
      import("./pages/justice/justice.module").then((m) => m.JusticePageModule)
  },
  {
    path: "environment",
    loadChildren: () =>
      import("./pages/environment/environment.module").then(
        (m) => m.EnvironmentPageModule
      )
  },
  {
    path: "housing",
    loadChildren: () =>
      import("./pages/housing/housing.module").then((m) => m.HousingPageModule)
  },
  {
    path: "healthcare",
    loadChildren: () =>
      import("./pages/healthcare/healthcare.module").then(
        (m) => m.HealthcarePageModule
      )
  },
  {
    path: "media",
    loadChildren: () =>
      import("./pages/media/media.module").then((m) => m.MediaPageModule)
  },
  {
    path: "employment",
    loadChildren: () =>
      import("./pages/employment/employment.module").then(
        (m) => m.EmploymentPageModule
      )
  },
  {
    path: "payment-not-made",
    loadChildren: () =>
      import("./maintainance/payment-not-made/payment-not-made.module").then(
        (m) => m.PaymentNotMadePageModule
      )
  },
  {
    path: "**",
    loadChildren: () =>
      import("./maintainance/page-not-found/page-not-found.module").then(
        (m) => m.PageNotFoundPageModule
      )
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
