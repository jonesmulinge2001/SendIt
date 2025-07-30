import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Home, Package, User, LogOut, Menu, X } from 'lucide-angular';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
})
export class NavigationComponent {
  @Input() activeSection: string = 'dashboard';
  @Output() activeSectionChange = new EventEmitter<string>();

  @Input() isMobileMenuOpen: boolean = false;
  @Output() isMobileMenuOpenChange = new EventEmitter<boolean>();

  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/driver/dashboard' },
    { id: 'parcels', label: 'Parcels', icon: 'inventory_2', route: '/driver/parcels' },
    { id: 'login', label: 'Logout', icon: 'person', route: '/login' } 
  ];
  
  

  onSelectSection(section: string) {
    this.activeSectionChange.emit(section);

  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpenChange.emit(!this.isMobileMenuOpen);
  }

  closeMobileMenu() {
    this.isMobileMenuOpenChange.emit(false);
  }

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
