import { Injectable } from '@angular/core';
import { ReplaySubject, take } from 'rxjs';
import { Message } from '../features/message/message.entity';
import { User } from '../features/user/user.entity';
import { StoreType } from '../model/enum/storeType';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private user: ReplaySubject<User | null> = new ReplaySubject(1);
  private users: ReplaySubject<User[] | null> = new ReplaySubject(1);

  private selectedMessage: ReplaySubject<string | null> = new ReplaySubject(1);
  private rawMessages: ReplaySubject<Message[] | null> = new ReplaySubject(1);

  constructor() {}

  watchUser() {
    return this.user.asObservable();
  }

  watchUsers() {
    return this.users.asObservable();
  }

  usersAreLoaded(): boolean {
    let loaded: boolean = false;
    this.users
      .pipe(take(1))
      .subscribe((u) => (loaded = u != null && u.length > 0));
    return loaded;
  }

  messageIsLoaded(): boolean {
    let loaded: boolean = false;
    this.selectedMessage.pipe(take(1)).subscribe((m) => (loaded = m != null));
    return loaded;
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
