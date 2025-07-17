import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { EmailLog } from '../../../services/email-logs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-log-details',
  imports: [CommonModule, MatDialogActions, MatDialogModule],
  templateUrl: './email-log-details.component.html',
  styleUrl: './email-log-details.component.css'
})
export class EmailLogDetailsComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public email: EmailLog){}

}
