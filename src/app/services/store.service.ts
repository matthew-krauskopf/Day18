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

  watchSelectedMessage() {
    return this.selectedMessage.asObservable();
  }

  watchRawMessages() {
    return this.rawMessages.asObservable();
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

  getUser(): User | null {
    let user: User | null = null;
    this.user.pipe(take(1)).subscribe((u) => (user = u));
    return user;
  }

  getSelectedMessage(): string | null {
    let selectedMessage: any | null = null;
    this.selectedMessage
      .pipe(take(1))
      .subscribe((sm) => (selectedMessage = sm));
    return selectedMessage;
  }

  getRawMessages() {
    let rawMessages: any[] | null = [];
    this.rawMessages.pipe(take(1)).subscribe((r) => (rawMessages = r));
    return rawMessages;
  }

  pushUser(user: User | null) {
    this.user.next(user);
  }

  pushUsers(users: User[] | null) {
    this.users.next(users);
  }

  pushRawMessage(uuid: string | null) {
    this.selectedMessage.next(uuid);
  }

  pushRawMessages(messages: Message[] | null) {
    this.rawMessages.next(messages);
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
