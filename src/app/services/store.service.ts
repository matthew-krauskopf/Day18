import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/user';
import { StoreType } from '../models/storeType';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private user: ReplaySubject<User | null> = new ReplaySubject(1);
  private users = new BehaviorSubject([]);
  private messages = new BehaviorSubject([]);

  constructor() {}

  watchUser() {
    return this.user.asObservable();
  }

  pushUser(user: User | null) {
    this.user.next(user);
  }

  storeItem(type: StoreType, val: string) {
    localStorage.setItem(type.toString(), val);
  }

  getItem(type: StoreType): string | null {
    return localStorage.getItem(type.toString());
  }

  removeItem(type: StoreType) {
    localStorage.removeItem(type.toString());
  }
}
