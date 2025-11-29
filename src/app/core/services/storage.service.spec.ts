import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve token', () => {
    const token = 'test-token';
    service.setToken(token);
    expect(service.getToken()).toBe(token);
  });

  it('should remove token', () => {
    service.setToken('test-token');
    service.removeToken();
    expect(service.getToken()).toBeNull();
  });

  it('should store and retrieve user', () => {
    const user = { id: 1, name: 'Test User' };
    service.setUser(user);
    expect(service.getUser()).toEqual(user);
  });

  it('should clear all storage', () => {
    service.setToken('token');
    service.setUser({ id: 1 });
    service.clear();
    expect(service.getToken()).toBeNull();
    expect(service.getUser()).toBeNull();
  });
});
