import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ParcelTrackingEntry } from '../interfaces/parcel-tracking-entry';
import { ParceltrackingService } from '../services/parceltracking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tracking-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './tracking-history.component.html',
  styleUrl: './tracking-history.component.css'
})
export class TrackingHistoryComponent implements OnInit {
  trackingEntries: ParcelTrackingEntry[] = [];
  loading: boolean = false;
  paginatedEntries: ParcelTrackingEntry[] = [];
  currentPage: number = 1;
  itemsPerpage: number = 12;
  totalPages: number[] = []

  displayedColumns: string[] = ['parcelId', 'location', 'note', 'timestamp'];

  constructor(
    private trackingService: ParceltrackingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchTrackingHistory();
  }

  fetchTrackingHistory(): void {
    this.loading = true;
    this.trackingService.getAllTracking().subscribe({
      next: (res) => {
        this.trackingEntries = res.data;
        this.updatePaginatedEntries();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to fetch tracking history');
      }
    });
  }

  updatePaginatedEntries(): void {
    const start = (this.currentPage - 1) * this.itemsPerpage;
    const end = start + this.itemsPerpage;
    this.paginatedEntries = this.trackingEntries.slice(start, end);

    const total = Math.ceil(this.trackingEntries.length / this.itemsPerpage);
    this.totalPages = Array.from({ length: total}, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedEntries();
  }
}
