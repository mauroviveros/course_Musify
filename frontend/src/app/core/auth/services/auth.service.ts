import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import {
  AuthResponse,
  LoginRequestBody,
} from '@shared/interfaces/auth.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly URL_API = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'token';

  constructor() {
    console.log('auth');
  }

  login(body: LoginRequestBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL_API}/login`, body).pipe(
      tap(response => localStorage.setItem(this.TOKEN_KEY, response.token)),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    );
  }

  logout(): Promise<boolean> {
    localStorage.removeItem(this.TOKEN_KEY);
    return this.router.navigate(['/auth']);
  }
}
