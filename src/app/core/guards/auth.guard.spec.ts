// Import required Angular testing utilities
import { TestBed } from '@angular/core/testing';
// Import Router for mocking navigation functionality
import { Router } from '@angular/router';
// Import the guard class being tested
import { AuthGuard } from './auth.guard';
// Import the authentication service dependency
import { AuthService } from '../services/auth.service';
// Import RxJS utilities for handling observables in tests
import { Observable, of } from 'rxjs';
// Import Vitest testing framework functions and utilities
import { describe, it, beforeEach, expect, vi } from 'vitest';

/**
 * Test suite for AuthGuard
 * Tests route protection based on authentication status
 */
describe('AuthGuard', () => {
  // Variable to hold the guard instance being tested
  let guard: AuthGuard;
  // Variable to hold the mocked AuthService
  let authService: any;
  // Variable to hold the mocked Router
  let router: any;

  // Setup function that runs before each test
  beforeEach(() => {
    // Create mock AuthService with a spy function for isTokenExpired
    const authServiceSpy = {
      isTokenExpired: vi.fn(),
      // Mock the isAuthenticated$ observable to return true
      isAuthenticated$: of(true)
    };
    // Create mock Router with a spy function for navigate method
    const routerSpy = {
      navigate: vi.fn()
    };

    // Configure the testing module with required providers and dependencies
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        // Inject the mocked AuthService instead of the real one
        { provide: AuthService, useValue: authServiceSpy },
        // Inject the mocked Router instead of the real one
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    // Inject the AuthGuard instance for testing
    guard = TestBed.inject(AuthGuard);
    // Inject the mocked AuthService instance
    authService = TestBed.inject(AuthService);
    // Inject the mocked Router instance
    router = TestBed.inject(Router);
  });

  // Test that the guard service is instantiated successfully
  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Test that guard allows route activation when user is authenticated
  it('should allow activation when authenticated', () => {
    // Mock the isTokenExpired method to return false (token is valid)
    authService.isTokenExpired.mockReturnValue(false);
    
    // Call canActivate method with mock route and router state
    const result = guard.canActivate({} as any, { url: '/posts' } as any);
    
    // Return a promise to handle async observable result
    return new Promise<void>((resolve) => {
      // Check if the result is an Observable
      if (result instanceof Observable) {
        // Subscribe to the observable and verify the guard allows activation
        (result as Observable<boolean>).subscribe((canActivate: boolean) => {
          // Expect the guard to return true (allow access)
          expect(canActivate).toBe(true);
          // Resolve the promise to complete the test
          resolve();
        });
      }
    });
  });
});