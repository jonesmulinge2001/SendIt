import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Parcel } from '../../interfaces/parcel';
import { ParcelService } from '../../services/parce.service';

@Component({
  selector: 'app-edit-parcel',
  templateUrl: './edit-parcel.component.html',
  styleUrl: './edit-parcel.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class EditParcelComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public parcel: Parcel,
    private dialogRef: MatDialogRef<EditParcelComponent>,
    private fb: FormBuilder,
    private parcelService: ParcelService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      title: [parcel.title, Validators.required],
      description: [parcel.description, Validators.required],
      weightKg: [parcel.weightKg, [Validators.required, Validators.min(0.1)]],
      pickupAddress: [parcel.pickupAddress, Validators.required],
      destination: [parcel.destination, Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const updates = this.form.value;
    this.parcelService.updateParcel(this.parcel.id, updates).subscribe({
      next: () => {
        this.toastr.success('Parcel updated successfully');
        this.dialogRef.close(true); // Close and return success
      },
      error: () => this.toastr.error('Failed to update parcel'),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
