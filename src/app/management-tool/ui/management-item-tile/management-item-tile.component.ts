import { Component, input } from '@angular/core';
import { ManagementItem } from '../../models/management-tool-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-management-item-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './management-item-tile.component.html',
  styleUrl: './management-item-tile.component.scss',
})
export class ManagementItemTileComponent {
  public item = input.required<ManagementItem>();
}
