import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
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
  private messages: ReplaySubject<Message[] | null> = new ReplaySubject(1);

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

  watchMessages() {
    return this.messages.asObservable();
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

  pushMessages(messages: Message[] | null) {
    this.messages.next(messages);
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
