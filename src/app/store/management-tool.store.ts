import { computed, inject } from '@angular/core';
import { ManagementToolService } from '../management-tool/data-access/management-tool.service';
import { ManagementItem } from '../management-tool/models/management-tool-item.model';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { catchError, finalize, of, tap } from 'rxjs';

type ManagementToolState = {
  items: ManagementItem[];
  loading: boolean;
  filter: string;
  display: 'tiles' | 'list';
};

const initialState: ManagementToolState = {
  items: [],
  loading: false,
  filter: '',
  display: 'list',
};

export const ManagementToolStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, managementToolService = inject(ManagementToolService)) => ({
      loadAll() {
        patchState(store, { loading: true });

        managementToolService
          .getItems()
          .pipe(
            tap((items) => {
              patchState(store, { items });
            }),
            catchError((error) => {
              console.error('Failed to load items:', error);
              return of(null);
            }),
            finalize(() => {
              patchState(store, { loading: false });
            })
          )
          .subscribe();
      },
      addItem(item: Partial<ManagementItem>) {
        patchState(store, { loading: true });

        managementToolService
          .addItem(item)
          .pipe(
            tap((item: ManagementItem) => {
              patchState(store, { items: [item, ...store.items()] });
            }),
            catchError((error) => {
              console.error('Failed to add item:', error);
              return of(null);
            }),
            finalize(() => {
              patchState(store, { loading: false });
            })
          )
          .subscribe();
      },
      editItem(item: ManagementItem) {
        patchState(store, { loading: true });

        managementToolService
          .editItem(item)
          .pipe(
            tap((item: ManagementItem) => {
              patchState(store, {
                items: [
                  item,
                  ...store.items().filter((curr) => curr.id !== item.id),
                ],
              });
            }),
            catchError((error) => {
              console.error('Failed to edit item:', error);
              return of(null);
            }),
            finalize(() => {
              patchState(store, { loading: false });
            })
          )
          .subscribe();
      },
      updateFilter(term: string) {
        patchState(store, { filter: term });
      },
      updateDisplay(display: 'tiles' | 'list') {
        patchState(store, { display });
      },
    })
  ),
  withComputed((state) => ({
    filteredItems: computed(() => {
      return state
        .items()
        .filter((item) =>
          item.name.toLowerCase().includes(state.filter().toLowerCase())
        );
    }),
  }))
);
