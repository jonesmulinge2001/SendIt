import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Parcel } from '../../interfaces/parcel';
import { DriverService } from '../../services/driver.service';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type StatusValue = 'IN_TRANSIT' | 'DELIVERED';

@Component({
  selector: 'app-status-update',
  templateUrl: './statusupdate.component.html',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
})
export class StatusUpdateComponent {
  selectedParcel: Parcel | null = null;
  isUpdating = false;
  notes = '';

  statusFlow: { value: StatusValue; label: string; icon: string }[] = [
    { value: 'IN_TRANSIT', label: 'In Transit', icon: 'local_shipping' },
    { value: 'DELIVERED', label: 'Delivered', icon: 'check_circle' }
  ];

  constructor(
    private driverService: DriverService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const parcelId = this.route.snapshot.paramMap.get('id');
    if (parcelId) {
      this.driverService.getParcelById(parcelId).subscribe({
        next: (parcel) => this.selectedParcel = parcel,
        error: (err) => console.error('Parcel fetch error:', err)
      });
    }
  }

  get currentStatusIndex(): number {
    return this.selectedParcel
      ? this.statusFlow.findIndex((s) => s.value === this.selectedParcel!.status)
      : -1;
  }

  get nextStatus() {
    if (!this.selectedParcel) return null;
    const currentIndex = this.statusFlow.findIndex(s => s.value === this.selectedParcel!.status);
    return currentIndex < this.statusFlow.length - 1 ? this.statusFlow[currentIndex + 1] : null;
  }

  handleStatusUpdate(newStatus: 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED') {
    if (!this.selectedParcel) return;
    this.isUpdating = true;

    this.driverService.updateParcelStatus(this.selectedParcel.id, newStatus).subscribe({
      next: () => {
        this.selectedParcel!.status = newStatus;
        this.notes = '';
        this.isUpdating = false;
      },
      error: () => {
        this.isUpdating = false;
      }
    });
  }
}
