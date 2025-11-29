// Import required dependencies for testing AuthService
import { StorageService } from './storage.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * Test suite for AuthService
 * Covers authentication operations including login, logout, and token management
 */
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageService: StorageService;

  // Setup test module before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, StorageService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService);
    // Clear localStorage to ensure clean state for each test
    localStorage.clear();
  });

  // Verify all HTTP requests have been consumed after each test
  afterEach(() => {
    httpMock.verify();
  });

  // Test that service is instantiated successfully
  it('shoiuld be created', () => {
    expect(service).toBeTruthy();
  });

  // Test successful login flow with mock user data
  it('should login successfully', () => {
    // Mock user object returned from API
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      name: 'test user',
    };

    // Subscribe to login observable and verify response
    const login$ = service
      .login({ username: 'testuser', password: 'password' })
      .subscribe((response) => {
        expect(response.user.username).toBe('testuser');
        expect(storageService.getToken()).toBeTruthy();
      });

    // Expect GET request to /users endpoint and return mock user data
    const req = httpMock.expectOne((request) => request.url.includes('/users'));
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);

    return login$;
  });

  // Test logout functionality clears authentication state and storage
  it('should logout and clear storage', () => {
    // Set a test token in storage
    storageService.setToken('test-token');
    // Call logout method
    service.logout();
    // Verify token is cleared from storage
    expect(storageService.getToken()).toBeNull();
    // Verify authentication flag is set to false
    expect(service.isAuthenticatedValue).toBe(false);
  });
}); // End of AuthService test suite
