import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AUTH_ROUTE, SEARCH_ROUTE } from '@const';
import { AuthGuard } from '@guards';

const routes: Routes = [
  {
    path: SEARCH_ROUTE,
    loadChildren: 'app/modules/search/search.module#SearchModule',
    canActivate: [AuthGuard]
  },
  {
    path: AUTH_ROUTE,
    loadChildren: 'app/modules/auth/auth.module#AuthModule'
  },
  {
    path: '**',
    redirectTo: SEARCH_ROUTE,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
