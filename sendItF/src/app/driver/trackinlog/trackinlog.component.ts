import { Component, Input, OnInit } from '@angular/core';
import { ParcelTrackingEntry } from '../../interfaces/parcel-tracking-entry';
import { ParcelService } from '../../services/parce.service';
import { DriverService } from '../../services/driver.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tracking-log',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './trackinlog.component.html',
})
export class TrackingLogComponent implements OnInit {
  @Input() selectedParcel: { id: string; title: string } | null = null;

  newEntry = '';
  newLocation = '';
  isAdding = false;

  parcelId: string = '';

  trackingEntries: ParcelTrackingEntry[] = [];

  constructor(
    private parcelService: ParcelService,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    //this.parcelId = this.route.snapshot.paramMap.get('id') || '';
  }

  handleAddEntry(): void {
    if (!this.newEntry.trim() || !this.selectedParcel) return;

    this.isAdding = true;

    const data = {
      note: this.newEntry,
      location: this.newLocation,
    };

    this.driverService.addTrackingEntry(this.selectedParcel.id, data).subscribe({
      next: (newEntry) => {
        this.trackingEntries = [newEntry, ...this.trackingEntries].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.newEntry = '';
        this.newLocation = '';
        this.isAdding = false;
      },
      error: () => {
        this.isAdding = false;
      },
    });
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'PICKED_UP':
        return 'border-blue-200 bg-blue-50';
      case 'AT_FACILITY':
        return 'border-yellow-200 bg-yellow-50';
      case 'OUT_FOR_DELIVERY':
        return 'border-orange-200 bg-orange-50';
      case 'DELIVERED':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  }

  getStatusIcon(status?: string): string {
    switch (status) {
      case 'PICKED_UP':
        return 'location_on';
      case 'AT_FACILITY':
        return 'schedule';
      case 'OUT_FOR_DELIVERY':
        return 'local_shipping';
      case 'DELIVERED':
        return 'check_circle';
      default:
        return 'chat';
    }
  }
}
