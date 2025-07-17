import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ParceltrackingService } from '../services/parceltracking.service';

@Component({
  selector: 'app-add-tracking-entry',
  templateUrl: './parceltrackingentry.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
})
export class AddTrackingEntryComponent {
  trackingForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private parcelService: ParceltrackingService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddTrackingEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parcelId: string }
  ) {
    this.trackingForm = this.fb.group({
      location: ['', [Validators.required, Validators.maxLength(100)]],
      note: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  submit(): void {
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.trackingForm.value;

    this.parcelService.addTrackingEntry(this.data.parcelId, payload).subscribe({
      next: () => {
        this.toastr.success('Tracking entry added!');
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.error('Failed to add tracking');
      },
      complete: () => (this.loading = false),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
