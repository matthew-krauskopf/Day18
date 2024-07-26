import { Injectable } from '@angular/core';
import { ReplaySubject, take } from 'rxjs';
import { Message } from '../models/message';
import { StoreType } from '../models/storeType';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private user: ReplaySubject<User | null> = new ReplaySubject(1);
  private users: ReplaySubject<User[] | null> = new ReplaySubject(1);

  private message: ReplaySubject<Message | null> = new ReplaySubject(1);
  private rawMessages: ReplaySubject<Message[] | null> = new ReplaySubject(1);

  private loginSuccess: ReplaySubject<boolean | null> = new ReplaySubject(1);

  constructor() {}

  watchUser() {
    return this.user.asObservable();
  }

  watchUsers() {
    return this.users.asObservable();
  }

  watchMessage() {
    return this.message.asObservable();
  }

  watchRawMessages() {
    return this.rawMessages.asObservable();
  }

  getRawMessages() {
    let rawMessages: any[] | null = [];
    this.rawMessages.pipe(take(1)).subscribe((r) => (rawMessages = r));
    return rawMessages;
  }

  watchLoginSuccess() {
    return this.loginSuccess.asObservable();
  }

  pushUser(user: User | null) {
    this.user.next(user);
  }

  pushUsers(users: User[] | null) {
    this.users.next(users);
  }

  pushMessage(message: Message | null) {
    this.message.next(message);
  }

  pushRawMessages(messages: Message[] | null) {
    this.rawMessages.next(messages);
  }

  pushLoginSuccess(loginSuccess: boolean | null) {
    this.loginSuccess.next(loginSuccess);
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
