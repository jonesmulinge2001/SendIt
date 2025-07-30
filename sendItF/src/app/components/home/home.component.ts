import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent, RouterLink, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  private scrollInterval: any;

  ngAfterViewInit(): void {
    const carousel = document.getElementById('features-carousel');
    let scrollAmount = 0;

    this.scrollInterval = setInterval(() => {
      if (carousel) {
        scrollAmount += 300;
        if (scrollAmount >= (carousel.scrollWidth - carousel.clientWidth)) {
          scrollAmount = 0;
        }
        carousel.scrollTo({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.scrollInterval);
  }
}
