import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogComponent } from '../../../shared/ui/dialog/dialog.component';
import { NgxColorsModule } from 'ngx-colors';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ManagementFormData } from '../../models/management-form-data.model';

@Component({
  selector: 'app-add-management-item-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    NgxColorsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-management-item-form.component.html',
  styleUrl: './add-management-item-form.component.scss',
})
export class AddManagementItemFormComponent {
  public fb = inject(FormBuilder);
  public form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    color: ['', Validators.required],
    description: ['', Validators.required],
  });
  public submitted = false;

  public data: ManagementFormData = inject(DIALOG_DATA);
  public dialog = inject(MatDialogRef<AddManagementItemFormComponent>);

  ngOnInit(): void {
    if (this.data.inputs) {
      this.form.patchValue(this.data.inputs);
    }
  }

  public handleSubmit(): void {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }

    this.dialog.close(this.form.value);
  }

  public onClose(): void {
    this.form.reset();
    this.dialog.close();
  }
}
