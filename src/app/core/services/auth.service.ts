import { RegisterRequest } from './../models/auth-response.model';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { AuthResponse, LoginRequest } from '../models/auth-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    const storedUser = this.storageService.getUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!storedUser);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  public get currentUserValue():User|null{
    return this.currentUserSubject.value;
  }

  public get isAuthenticatedValue():boolean{
    return this.isAuthenticatedSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse>{
    return this.http.get<any[]>(`${environment.apiUrl}/users?username=${credentials.username}`)
    .pipe(
        delay(500), //simulate network delay
        map(users=>{
            if(users && users.length > 0){
                const user = users[0];
                //Simulate JWT TOKEN
                const token = this.generateMockToken(user);
                const authResponse: AuthResponse={
                    token,
                    user:{
                        id:user.id,
                        username:user.username,
                        email:user.email,
                        name:user.name
                    }
                };
                return authResponse;
            }
            throw new Error('Invalid credentials');
        }),
        tap(response=>{
            this.storageService.setToken(response.token);
            this.storageService.setUser(response.user);
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
        }),
        catchError(err=>{
            return throwError(() => new Error('Login failed. Please check your credentials'));
        })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse>{
    return this.http.post<any>(`${environment.apiUrl}/users`,userData).pipe(
        delay(500),
        map(user=>{
            const token = this.generateMockToken(user);
            const authResponse = {
                token,
                user:{
                    id: user.id || Math.floor(Math.random() * 1000),
                    username: userData.username,
                    email:userData.email,
                    name:userData.name
                }
            };
            return authResponse;
        }),
        tap(response=>{
            this.storageService.setToken(response.token);
            this.storageService.setUser(response.user);
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
        }),
        catchError(error=>{
            return throwError(()=> new Error('Registration failed. Please try again'));
        })
    );
  }
   logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<string> {
    // Simulate token refresh
    const user = this.currentUserValue;
    if (user) {
      const newToken = this.generateMockToken(user);
      this.storageService.setToken(newToken);
      return of(newToken);
    }
    return throwError(() => new Error('No user logged in'));
  }

  isTokenExpired(): boolean {
    const token = this.storageService.getToken();
    if (!token) return true;
    
    try {
      const payload = this.decodeToken(token);
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    } catch {
      return true;
    }
  }

  private generateMockToken(user: any): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id.toString(),
      username: user.username,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  private decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    return JSON.parse(atob(parts[1]));
  }
}
