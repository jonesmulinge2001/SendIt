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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to fetch tracking history');
      }
    });
  }
}
