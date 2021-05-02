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
const redirectLoggedInToAccount = () => redirectLoggedInTo(['/home']);

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
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToAccess)

  },
  {
    path: 'english',
    loadChildren: () => import('./english/english.module').then( m => m.EnglishPageModule)
  },
  {
    path: 'sinhala',
    loadChildren: () => import('./sinhala/sinhala.module').then( m => m.SinhalaPageModule)
  },
  {
    path: 'tamil',
    loadChildren: () => import('./tamil/tamil.module').then( m => m.TamilPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
