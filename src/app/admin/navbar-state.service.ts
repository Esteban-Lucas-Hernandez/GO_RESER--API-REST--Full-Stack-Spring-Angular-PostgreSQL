import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarStateService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  collapsed$ = this.collapsedSubject.asObservable();

  setCollapsed(collapsed: boolean): void {
    this.collapsedSubject.next(collapsed);
  }

  toggleCollapsed(): void {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }
}
