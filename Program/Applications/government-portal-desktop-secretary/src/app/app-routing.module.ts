import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

/**
 *  Redirect Unauthorized users to Access page
 */
const redirectUnauthorizedToAccess = () =>
redirectUnauthorizedTo(['/access']);

/**
 *  Access Automated for Authorized users to Account page
 */
const redirectLoggedInToAccount = () => redirectLoggedInTo(['/secretary/home-affairs']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'access',
    pathMatch: 'full'
  },
  {
    path: 'access',
    loadChildren: () => import('./access/access.module').then( m => m.AccessPageModule),
    ...canActivate(redirectLoggedInToAccount),
  },
  {
    path: 'secretary/home-affairs',
    loadChildren: () => import('./secretary/home-affairs/home-affairs.module').then( m => m.HomeAffairsPageModule),
    ...canActivate(redirectUnauthorizedToAccess)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
