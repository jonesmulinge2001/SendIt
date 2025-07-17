import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Parcel } from '../../interfaces/parcel';
import { ParcelService } from '../../services/parce.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-parcel',
  templateUrl: './delete-parcel.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class DeleteParcelComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public parcel: Parcel,
    private dialogRef: MatDialogRef<DeleteParcelComponent>,
    private parcelService: ParcelService,
    private toastr: ToastrService
  ) {}

  confirmDelete(): void {
    this.parcelService.deleteParcel(this.parcel.id).subscribe({
      next: () => {
        this.toastr.success('Parcel deleted successfully');
        this.dialogRef.close(true); // close and indicate success
      },
      error: () => {
        this.toastr.error('Failed to delete parcel');
      },
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
