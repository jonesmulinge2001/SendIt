import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User, UsersService } from '../../../services/users.service';
import { PromoteUserDialogComponent } from '../../../users/promoteuser.component';
import { DeleteUserDialogComponent } from '../../../users/deleteuser.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrl:'./users.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchTerm = '';

  constructor(
    private userService: UsersService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data;
        this.filteredUsers = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.toastr.error('Failed to load users', 'Error');
        this.loading = false;
      },
    });
  }

  onSearch(term: string): void {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
  }

  openPromoteDialog(user: User): void {
    const dialogRef = this.dialog.open(PromoteUserDialogComponent, {
      data: { user },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUserRole(user.id, result).subscribe(() => {
          this.toastr.success(`${user.name} promoted to ${result}`, 'Role Updated');
          this.loadUsers();
        });
      }
    });
  }

  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: { user },
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deleteUser(user.id).subscribe(() => {
          this.toastr.error(`${user.name} deleted`, 'User Removed');
          this.loadUsers();
        });
      }
    });
  }
}
