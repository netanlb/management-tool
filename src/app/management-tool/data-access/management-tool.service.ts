import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ManagementItem } from '../models/management-tool-item.model';
import { BehaviorSubject, delay, map, Observable, of, tap } from 'rxjs';

//  This service is simulating an external API access(CRUD operations)
//  It simulates backend operations as well, such as creating a unique ID, updating the update/creation date
//  I assume the backend would identify the user using Integrated Windows Authentication and fill the createdBy based on the domain login
@Injectable({ providedIn: 'root' })
export class ManagementToolService {
  private httpClient = inject(HttpClient);
  private url = '/mock-data.json';
  private items$ = new BehaviorSubject<ManagementItem[]>([]);

  public getItems(
    page: number,
    pageSize: number
  ): Observable<{ items: ManagementItem[]; allItemsLoaded: boolean }> {
    return this.httpClient.get<ManagementItem[]>(this.url).pipe(
      map((data: ManagementItem[]) => {
        data.sort(
          (a, b) =>
            new Date(b.lastUpdateDate).getTime() -
            new Date(a.lastUpdateDate).getTime()
        );

        const start: number = (page - 1) * pageSize;
        const end: number = start + pageSize;
        const allItemsLoaded: boolean = end >= data.length;

        return { items: data.slice(start, end), allItemsLoaded };
      }),
      tap((data: { items: ManagementItem[]; allItemsLoaded: boolean }) =>
        this.items$.next(data.items)
      ),
      delay(1000)
    );
  }

  public addItem(item: Partial<ManagementItem>): Observable<ManagementItem> {
    const currentItems = this.items$.value;

    // simulate item creation in the BE
    const id = '' + new Date().getTime();
    const newItem = {
      ...item,
      id,
      createDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
      createdBy: 'Nate Bar',
    } as ManagementItem;

    this.items$.next([...currentItems, newItem]);
    return of(newItem).pipe(delay(500));
  }

  public deleteItem(id: string) {
    const currentItems: ManagementItem[] = this.items$.value;
    const filteredItems: ManagementItem[] = currentItems.filter(
      (item: ManagementItem) => item.id !== id
    );
    this.items$.next(filteredItems);
    return of().pipe(delay(500));
  }

  public editItem(updatedItem: ManagementItem) {
    const currentItems = this.items$.value;
    const lastUpdateDate = new Date().toISOString();
    const newItem = { ...updatedItem, lastUpdateDate };

    const updatedItems = currentItems.map((item) =>
      item.id === updatedItem.id ? newItem : item
    );

    this.items$.next(updatedItems);

    return of(newItem).pipe(delay(500));
  }
}
