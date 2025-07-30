import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DriverGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    if (role === 'DRIVER') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
