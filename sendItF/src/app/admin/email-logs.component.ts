import { Component, OnInit } from '@angular/core';
import { EmailLog, EmailLogsService } from '../services/email-logs.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EmailLogDetailsComponent } from './email-logs/email-log-details/email-log-details.component';

@Component({
  selector: 'app-email-logs',
  imports: [CommonModule, MatIconModule],
  templateUrl: './email-logs.component.html',
  styleUrl: './email-logs.component.css'
})
export class EmailLogsComponent implements OnInit{
  emailLogs: EmailLog[] = [];
  paginatedEmails: EmailLog[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number[] = [];
  loading = false;

  constructor(
    private emailLogsService: EmailLogsService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
   this.getEmailLogs();
  }

  getEmailLogs(): void {
    this.loading = true;
    this.emailLogsService.getAllEmailLogs().subscribe({
      next: (res) => {
        this.emailLogs = res.data;
        this.updatePaginatedEmails();
        this.loading = false;
      }
    });
  }

  updatePaginatedEmails(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEmails = this.emailLogs.slice(start, end);

    const total = Math.ceil(this.emailLogs.length / this.itemsPerPage);
    this.totalPages = Array.from({ length: total}, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedEmails();
  }

  viewDetails(email: EmailLog): void {
    this.dialog.open(EmailLogDetailsComponent, {
      width: '600px',
      data: email,
    });
  }
}
