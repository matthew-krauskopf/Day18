import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { StoreType } from '../models/storeType';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  user = new BehaviorSubject(null);
  users = new BehaviorSubject([]);
  messages = new BehaviorSubject([]);

  constructor() {}

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
