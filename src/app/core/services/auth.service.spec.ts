import { StorageService } from './storage.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, StorageService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shoiuld be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      name: 'test user',
    };

    const login$ = service
      .login({ username: 'testuser', password: 'password' })
      .subscribe((response) => {
        expect(response.user.username).toBe('testuser');
        expect(storageService.getToken()).toBeTruthy();
      });

    const req = httpMock.expectOne((request) => request.url.includes('/users'));
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);

    return login$;
  });

  it('should logout and clear storage', () => {
    storageService.setToken('test-token');
    service.logout();
    expect(storageService.getToken()).toBeNull();
    expect(service.isAuthenticatedValue).toBe(false);
  });
});
