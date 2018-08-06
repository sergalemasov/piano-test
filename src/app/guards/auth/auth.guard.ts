import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AUTH_ROUTE } from '@const';
import { NavigationService } from '@services';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private navigationService: NavigationService) {}

    public canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
      // TODO: обработать авторизованного пользователя
      this.navigationService.navigateTo(AUTH_ROUTE, { queryParams: { backstate: state.url } });
      return false;
    }
}
