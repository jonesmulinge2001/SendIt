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
        this.loading = false;
      }
    });
  }

  viewDetails(email: EmailLog): void {
    this.dialog.open(EmailLogDetailsComponent, {
      width: '600px',
      data: email,
    });
  }
}
