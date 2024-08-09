import { Injectable } from '@angular/core';
import { StoreType } from '../model/enum/storeType';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
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
