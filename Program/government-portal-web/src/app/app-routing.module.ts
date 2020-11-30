import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./portal/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./maintainance/page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./maintainance/page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
