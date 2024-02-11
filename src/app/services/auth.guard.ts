// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    return this.checkLoginStatus();
  }

  private checkLoginStatus(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // If not logged in, navigate to the login page without adding to the browser history
      this.router.navigate(['/login'], { skipLocationChange: true });
      return false;
    }
  }

  subscribeToNavigationEnd(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.checkLoginStatus();
    });
  }
}
