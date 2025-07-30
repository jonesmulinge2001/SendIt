import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sendItF';
  currentUrl = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  shouldShowNavbar(): boolean {
    const url = this.router.url;
    return !url.startsWith('/admin') && !url.startsWith('/driver');
  }

  isAdmin(): boolean {
    return this.currentUrl.startsWith('/admin');
  }
}

