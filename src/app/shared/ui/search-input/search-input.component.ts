import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  fb = inject(FormBuilder);
  public form = this.fb.group({
    search: [''],
  });

  public searchTermChange = output<string | null>();

  constructor() {
    this.form
      .get('search')
      ?.valueChanges.pipe(debounceTime(400))
      .subscribe((value) => {
        this.searchTermChange.emit(value);
      });
  }
}
