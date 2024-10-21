import { Component, inject, input, output } from '@angular/core';
import { ManagementItemComponent } from '../management-item/management-item.component';
import { ManagementItem } from '../../models/management-tool-item.model';
import { AddManagementItemFormComponent } from '../add-management-item-form/add-management-item-form.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ManagementItemTileComponent } from '../management-item-tile/management-item-tile.component';

@Component({
  selector: 'app-management-list',
  standalone: true,
  imports: [
    ManagementItemComponent,
    MatIconModule,
    CommonModule,
    ManagementItemTileComponent,
  ],
  templateUrl: './management-list.component.html',
  styleUrl: './management-list.component.scss',
})
export class ManagementListComponent {
  public items = input<ManagementItem[]>([]);
  public display = input.required<'tiles' | 'list'>();
  public loading = input<boolean>();
  public onItemEdited = output<ManagementItem>();

  private dialog = inject(MatDialog);

  public onEditItem(item: ManagementItem) {
    const { name, color, description } = item;
    const dialogRef = this.dialog.open(AddManagementItemFormComponent, {
      width: '600px',
      data: {
        title: 'Edit Instance',
        action: 'edit',
        inputs: { name, color, description },
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => !!value),
        tap((value) => {
          const newItem: ManagementItem = { ...item, ...value };
          this.onItemEdited.emit(newItem);
        })
      )
      .subscribe();
  }
}
