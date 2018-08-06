import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class NavigationService {
  private rootPrefix = '/';

  constructor(private router: Router) { }

  public rootifyRoutes(routes: { [key: string]: string }): { [key: string]: string } {
    const rootified = {};

    Object.keys(routes).forEach((key: string) => {
      rootified[key] = this.rootifyOne(routes[key]);
    });

    return rootified;
  }

  public navigateTo(route: string, extras: NavigationExtras = {}): Promise<boolean> {
    return this.router.navigate([this.rootifyOne(route)], extras);
  }

  private rootifyOne(route: string): string {
    return `${this.rootPrefix}${route}`;
  }
}
