import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, VerifyEmailRequest, GenericResponse, ResetPasswordRequest } from '../auth/interfaces/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = 'http://localhost:3000/auth';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // ========== API Calls ==========
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, data);
  }

  verifyEmail(data: VerifyEmailRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.API}/verify-email`, data);
  }

  requestVerificationCode(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${this.API}/request-verification-code`,
      { email }
    );
  }

  forgotPassword(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.API}/forgot-password`, {
      email,
    });
  }

  resetPassword(data: ResetPasswordRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.API}/reset-password`, data);
  }

  resendRequestCode(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.API}/resend-reset-code`, {
      email,
    });
  }

  // ========== Handler Methods ==========
  isLogegedIn(): boolean {
    return !!localStorage.getItem('token'); // returns true if token exists
  }

  handleRegister(data: RegisterRequest): void {
    this.loadingSubject.next(true);
    this.register(data).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Registration successful');
        localStorage.setItem('verifyEmail', data.email);
        this.router.navigate(['/verify-email']);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.log(error.error?.message || 'Registration failed')
        this.toastr.error(error.error?.message || 'Registration failed');
        this.loadingSubject.next(false);
      }
      ,
    });
  }

  handleLogin(data: LoginRequest): void {
    this.loadingSubject.next(true);
    this.login(data).subscribe({
      next: (response) => {
        if (!response.success || !response.data) {
          this.toastr.error('Invalid credentials');
          this.loadingSubject.next(false);
          return;
        }

        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('userId', user.id);
        this.toastr.success('Login successful', 'Welcome back');

        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
        this.loadingSubject.next(false);
      },
    });
  }

  handleVeridyEmail(data: VerifyEmailRequest): void {
    this.loadingSubject.next(true);
    this.verifyEmail(data).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Email verified');
        this.router.navigate(['/login']);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Email verification failed');
        this.loadingSubject.next(false);
      },
    });
  }

  handleRequestVerificationCode(email: string): void {
    this.loadingSubject.next(true);
    this.requestVerificationCode(email).subscribe({
      next: (response) => {
        this.toastr.success(
          response.message || 'Verification code sent to your email'
        );
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.toastr.error(
          err.error.message || 'Failed to send verification code'
        );
      },
    });
  }

  handleForgotPassword(email: string): void {
    this.loadingSubject.next(true);
    this.forgotPassword(email).subscribe({
      next: (response) => {
        this.toastr.success(
          response.message || 'Password reset code sent to your email'
        );
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.toastr.error(
          err.error.message || 'Failed to send password reset code'
        );
        this.loadingSubject.next(false);
      },
    });
  }

  handleResetPassword(data: ResetPasswordRequest): void {
    this.loadingSubject.next(true);
    this.resetPassword(data).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Password reset successfully');
        this.router.navigate(['/login']);
        this.loadingSubject.next(false);
      },
    });
  }

  handleResendResetCode(email: string): void {
    this.loadingSubject.next(true);
    this.resendRequestCode(email).subscribe({
      next: (response) => {
        this.toastr.success(
          'Verification code resent to your email',
          'success'
        );
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.toastr.error('Failed to resend verification code');
        this.loadingSubject.next(false);
      },
    });
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
