// Import Injectable decorator to make this class injectable in Angular DI system
import { Injectable } from '@angular/core';
// Import Router interfaces and classes for route protection and navigation
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
// Import the authentication service to check user authentication status
import { AuthService } from '../services/auth.service';
// Import RxJS operators: map transforms data, Observable is the async stream type, take limits emissions to 1
import { map, Observable, take } from 'rxjs';

// Decorator marks this class as a service and provides it at root module level
@Injectable({ providedIn: 'root' })
// AuthGuard implements CanActivate to protect routes from unauthorized access
export class AuthGuard implements CanActivate {
  // Constructor injects AuthService and Router dependencies
  constructor(private authService: AuthService, private router: Router) {}

  // canActivate method determines if a route can be accessed
  // Parameters: route contains route info, state contains current router state and URL
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    // Returns an Observable, Promise, boolean, or UrlTree indicating access permission or redirect
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Subscribe to isAuthenticated$ observable from AuthService
    return this.authService.isAuthenticated$.pipe(
      // take(1) ensures only the first emitted value is taken, then the subscription completes
      take(1),
      // map transforms the isAuthenticated value into an access decision (boolean or UrlTree redirect)
      map(isAuthenticated => {
        // Check if user is authenticated AND token has not expired
        if (isAuthenticated && !this.authService.isTokenExpired()) {
          // Return true to allow route access
          return true;
        }

        // Navigate to login page if authentication fails
        // queryParams preserves the return URL so user is redirected back after login
        this.router.navigate(['auth/login'], {
          queryParams: { returnUrl: state.url }
        });
        // Return false to deny route access
        return false;
      })
    );
  }
}
