import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddManagementItemFormComponent } from '../add-management-item-form/add-management-item-form.component';
import { filter, tap } from 'rxjs';
import { ManagementItem } from '../../models/management-tool-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-management-toolbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './management-toolbar.component.html',
  styleUrl: './management-toolbar.component.scss',
})
export class ManagementToolbarComponent {
  public display = input.required<'tiles' | 'list'>();
  public onItemAdded = output<Partial<ManagementItem>>();
  public displayChange = output<'tiles' | 'list'>();

  private dialog = inject(MatDialog);

  public onAddItem(): void {
    const dialogRef = this.dialog.open(AddManagementItemFormComponent, {
      width: '600px',
      data: { title: 'Create New', action: 'add' },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value: Partial<ManagementItem>) => !!value),
        tap((value: Partial<ManagementItem>) => {
          this.onItemAdded.emit(value);
        })
      )
      .subscribe();
  }

  public onDisplayChange(display: 'tiles' | 'list'): void {
    this.displayChange.emit(display);
  }
}
