import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParcelTrackingEntry } from '../../../interfaces/parcel-tracking-entry';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ParceltrackingService } from '../../../services/parceltracking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parcel-tracking',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './parcel-tracking.component.html',
  styleUrl: './parcel-tracking.component.css'
})
export class ParcelTrackingComponent implements OnInit {
  trackingHistory: ParcelTrackingEntry[] = [];
  loading = false;
  parcelId = '';

  displayedColumns: string[] = ['status', 'location', 'note', 'timestamp'];

  constructor(
    private route: ActivatedRoute,
    private trackingService: ParceltrackingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.parcelId = this.route.snapshot.paramMap.get('parcelId') || '';
    if (this.parcelId) {
      this.fetchTrackingHistory();
    }
  }

  fetchTrackingHistory(): void {
    this.loading = true;
    this.trackingService.getTrackingByParcel(this.parcelId).subscribe({
      next: (res) => {
        this.trackingHistory = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to fetch tracking history for this parcel');
      }
    });
  }
}
