import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { User } from '../services/users.service';

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
        <span class="material-icons text-red-600 text-3xl">warning</span>
        Delete User
      </h2>
      <p class="text-gray-700 mb-4">Are you sure you want to delete <strong>{{ data.user.name }}</strong>?</p>

      <div class="flex justify-end gap-2">
        <button (click)="cancel()" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button (click)="confirm()" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
          <span class="material-icons text-sm mr-1">delete</span> Delete
        </button>
      </div>
    </div>
  `
})
export class DeleteUserDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
