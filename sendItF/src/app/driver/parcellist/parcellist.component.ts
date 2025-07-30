import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { Parcel } from '../../interfaces/parcel';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports:[CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-parcels-list',
  standalone: true,
  templateUrl: './parcellist.component.html',
  styleUrls: ['./parcellist.component.css'],
})
export class ParcelsListComponent implements OnInit {
  @Input() selectedParcel: Parcel | null = null;
  @Output() parcelSelect = new EventEmitter<Parcel>();

  parcels: Parcel[] = [];
  loading = false;
  error: string | null = null;

  searchTerm = '';
  statusFilter: 'all' | 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' = 'all';

  constructor(private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchParcels();
  }

  fetchParcels() {
    this.loading = true;
    this.error = null;
    this.driverService.getMyParcels().subscribe({
      next: (res) => {
        this.parcels = res as Parcel[];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load parcels.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  selectParcel(p: Parcel) {
    this.parcelSelect.emit(p);
  }

  getStatusColor(status: Parcel['status']): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  formatTime(timeString: string | Date): string {
    if (!timeString) return '';
    const d = new Date(timeString);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  get filteredParcels(): Parcel[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.parcels.filter((p) => {
      const matchesSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.senderName.toLowerCase().includes(term) ||
        p.receiverName.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term);

      const matchesStatus = this.statusFilter === 'all' ? true : p.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  goToTracking(id: string) {
    this.router.navigate(['/driver/tracking', id]);
  }
  
}
