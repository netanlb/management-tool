import { Component, input } from '@angular/core';
import { ManagementItem } from '../../models/management-tool-item.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-management-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './management-item.component.html',
  styleUrl: './management-item.component.scss',
})
export class ManagementItemComponent {
  public item = input.required<ManagementItem>();
}
