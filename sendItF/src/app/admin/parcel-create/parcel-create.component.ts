import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ParcelService } from '../../services/parce.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-parcel-create',
  templateUrl: './parcel-create.component.html',
})
export class ParcelCreateComponent {
  parcelForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private parcelService: ParcelService,
    private toastr: ToastrService
  ) {
    this.parcelForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      weightKg: [null, [Validators.required, Validators.min(0.1)]],
      pickupAddress: ['', Validators.required],
      destination: ['', Validators.required],
      senderName: ['', Validators.required],
      senderEmail: ['', [Validators.required, Validators.email]],
      receiverName: ['', Validators.required],
      receiverEmail: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.parcelForm.invalid) {
      this.parcelForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.parcelForm.value;

    const payload = {
      title: formValue.title,
      description: formValue.description,
      weightKg: formValue.weightKg,
      pickupAddress: formValue.pickupAddress,
      destination: formValue.destination,
      senderName: formValue.senderName,
      senderEmail: formValue.senderEmail,
      receiverName: formValue.receiverName,
      receiverEmail: formValue.receiverEmail,
    };
    

    this.parcelService.createParcel(payload).subscribe({
      next: () => {
        this.toastr.success('Parcel created successfully');
        this.parcelForm.reset();
      },
      error: () => {
        this.toastr.error('Failed to create parcel');
      },
      complete: () => (this.isSubmitting = false),
    });
  }
}
