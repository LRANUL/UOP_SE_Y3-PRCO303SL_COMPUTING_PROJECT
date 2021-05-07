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
const redirectLoggedInToAccount = () => redirectLoggedInTo(['/admin']);

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
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
    ...canActivate(redirectUnauthorizedToAccess)
  },  {
    path: 'activities',
    loadChildren: () => import('./activities/activities.module').then( m => m.ActivitiesPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
