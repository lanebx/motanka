import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  @Input() submittedstr?: string; // text message
  @Input() isSubmitted: boolean = false; // start message togler
  @Input() isRejected?: boolean = false; // start message togler
  @Input() link?: string;
}
