import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Parcel } from '../../../interfaces/parcel';
import { ParcelService } from '../../../services/parce.service';
import { TimeagoModule } from 'ngx-timeago';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditParcelComponent } from '../edit-parcel.component';
import { DeleteParcelComponent } from '../delete-parcel.component';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AddTrackingEntryComponent } from '../../parceltrackingentry.component';


@Component({
  selector: 'app-parcel-list',
  templateUrl: './parcels.component.html',
  standalone: true,
  imports: [
    TimeagoModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule
  ],
})
export class ParcelListComponent implements OnInit {
  parcels: Parcel[] = [];
  filteredParcels: Parcel[] = [];
  loading = true;
  filterForm!: FormGroup;
  statusUpdating: { [key: string]: boolean } = {};
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number[] = [];


  constructor(
    private fb: FormBuilder,
    private parcelService: ParcelService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      sender: [''],
      receiver: [''],
      status: [''],
    });

    this.loadParcels();
  }

  loadParcels(): void {
    this.loading = true;
    this.parcelService.getParcels().subscribe({
      next: (data) => {
        this.parcels = data;
        this.updatepaginatedParcels();
        this.filteredParcels = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load parcels');
        this.loading = false;
      },
    });
  }

  updatepaginatedParcels(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredParcels = this.parcels.slice(start, end);

    const total = Math.ceil(this.parcels.length / this.itemsPerPage);
    this.totalPages = Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatepaginatedParcels();
  }

  applyFilters(): void {
    const { startDate, endDate, sender, receiver, status } =
      this.filterForm.value;

    this.filteredParcels = this.parcels.filter((parcel) => {
      const createdDate = new Date(parcel.createdAt);
      // Zero out the time for consistent comparison
      createdDate.setHours(0, 0, 0, 0);

      const matchesStartDate = startDate
        ? createdDate >= this.normalizeDate(startDate)
        : true;

      const matchesEndDate = endDate
        ? createdDate <= this.normalizeDate(endDate)
        : true;

      const matchesSender = sender
        ? parcel.senderName.toLowerCase().includes(sender.toLowerCase().trim())
        : true;

      const matchesReceiver = receiver
        ? parcel.receiverName
            .toLowerCase()
            .includes(receiver.toLowerCase().trim())
        : true;

      const matchesStatus = status
        ? parcel.status.toUpperCase() === status.toUpperCase().trim()
        : true;

      return (
        matchesStartDate &&
        matchesEndDate &&
        matchesSender &&
        matchesReceiver &&
        matchesStatus
      );
    });
  }

  normalizeDate(inputDate: string): Date {
    const date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filteredParcels = this.parcels;
  }

  onEdit(parcel: Parcel) {
    const dialogRef = this.dialog.open(EditParcelComponent, {
      data: parcel,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toastr.success('Parcel updated');
        this.loadParcels();
      }
    });
  }

  onDelete(parcel: Parcel) {
    const dialogRef = this.dialog.open(DeleteParcelComponent, {
      width: '400px',
      data: parcel,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.toastr.success('Parcel deleted');
        this.loadParcels();
      }
    });
  }

  onStatusChange(parcelId: string, newStatus: string) {
    this.statusUpdating[parcelId] = true;
    this.parcelService
      .updateParcelStatus(parcelId, newStatus as Parcel['status'])
      .subscribe({
        next: () => {
          this.toastr.success(`Status updated to ${newStatus}`);
          this.loadParcels();
        },
        error: () => {
          this.toastr.error('Failed to update status');
        },
        complete: () => {
          this.statusUpdating[parcelId] = false;
        },
      });
  }
  onAddTracking(parcel: Parcel) {
    const dialogRef = this.dialog.open(AddTrackingEntryComponent, {
      width: '500px',
      data: { parcelId: parcel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toastr.success('Tracking entry added!');
        this.loadParcels(); // Refresh the list if needed
      }
    });
  }
}
