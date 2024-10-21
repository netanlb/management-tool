import { Component, HostListener, inject } from '@angular/core';
import { ManagementToolStore } from '../store/management-tool.store';
import { ManagementItem } from './models/management-tool-item.model';
import { JsonPipe } from '@angular/common';
import { ManagementListComponent } from './ui/management-list/management-list.component';
import { ManagementToolbarComponent } from './ui/management-toolbar/management-toolbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchInputComponent } from '../shared/ui/search-input/search-input.component';

@Component({
  selector: 'app-management-tool',
  standalone: true,
  imports: [
    JsonPipe,
    ManagementListComponent,
    ManagementToolbarComponent,
    MatProgressSpinnerModule,
    SearchInputComponent,
  ],
  templateUrl: './management-tool.component.html',
  styleUrl: './management-tool.component.scss',
})
export default class ManagementToolComponent {
  public managementItems: ManagementItem[] = [];

  public store = inject(ManagementToolStore);

  public ngOnInit(): void {
    this.initialLoad();
  }

  public onAddedItem(item: Partial<ManagementItem>): void {
    this.store.addItem(item);
  }

  public onEditedItem(item: ManagementItem): void {
    this.store.editItem(item);
  }

  public onSearchChange(term: string | null): void {
    this.store.updateFilter(term ?? '');
  }

  public onDisplayChange(display: 'tiles' | 'list'): void {
    this.store.updateDisplay(display);
  }

  @HostListener('window:scroll', [])
  private onScroll(): void {
    if (this.store.loading() || this.store.allItemsLoaded()) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 100;

    if (scrollPosition >= threshold) {
      this.store.lazyLoad();
    }
  }

  private initialLoad(): void {
    this.store.lazyLoad();

    setTimeout(() => {
      if (this.isMoreDataNeeded()) {
        this.initialLoad();
      }
    }, 1200);
  }

  private isMoreDataNeeded(): boolean {
    // If the content height is less than the viewport height, load more items

    const contentHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;

    return (
      contentHeight <= viewportHeight &&
      !this.store.loading() &&
      !this.store.allItemsLoaded()
    );
  }
}
