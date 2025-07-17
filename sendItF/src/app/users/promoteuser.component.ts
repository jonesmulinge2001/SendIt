import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../services/users.service';

@Component({
  selector: 'app-promote-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span class="material-icons text-blue-600 text-3xl">supervisor_account</span>
        Change Role
      </h2>
      <p class="mb-4 text-gray-600">Select new role for <strong>{{ data.user.name }}</strong></p>

      <select [(ngModel)]="selectedRole" class="w-full p-3 border rounded-lg mb-4">
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <div class="flex justify-end gap-2">
        <button (click)="cancel()" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button (click)="confirm()" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          <span class="material-icons text-sm mr-1">done</span> Update
        </button>
      </div>
    </div>
  `
})
export class PromoteUserDialogComponent {
  selectedRole: 'USER' | 'ADMIN';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<PromoteUserDialogComponent>
  ) {
    this.selectedRole = data.user.role;
  }

  confirm() {
    this.dialogRef.close(this.selectedRole);
  }

  cancel() {
    this.dialogRef.close();
  }
}
