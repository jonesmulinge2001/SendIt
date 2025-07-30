import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from '../../interfaces/menu-interface';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule, RouterLink],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  userImage = '';
  menuOpen = false;

  menus: MenuItem[] = [
    { title: 'Home', path: '/', icon: 'home' },
    { title: 'About Us', path: '/about-us', icon: 'info' },
    { title: 'Services', path: '/services', icon: 'build' },
    { title: 'Contact', path: '/contact', icon: 'contact_mail' },
    { title: 'Login', path: '/login', icon: 'login', isLogin: true },
    { title: 'Sign Up', path: '/register', icon: 'person_add', isRegister: true },
    { title: 'My Dashboard', path: '', icon: 'dashboard', isDashboard: true }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.menus = this.menus.filter(item => !item.isLogin && !item.isRegister);
    }
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isLoggedIn = false;
    this.menus = this.menus.filter(item => !item.isLogin && !item.isRegister);
    this.router.navigate(['/']);
    this.toastr.success('Logged out successfully.');
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  handleMenuClick(menu: MenuItem): void {
    this.isLoggedIn = this.authService.isLoggedIn(); 

    if (menu.isDashboard) {
      this.router.navigate([this.isLoggedIn ? '/my-dashboard' : '/login']);
    } else if (menu.isLogin || menu.isRegister) {
      if (this.isLoggedIn) {
        this.toastr.info('You are already logged in.');
      } else {
        this.router.navigate([menu.path]);
      }
    } else {
      this.router.navigate([menu.path]);
    }

    this.menuOpen = false;
  }
  
}
