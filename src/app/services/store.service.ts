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

  private rawMessage: ReplaySubject<Message | null> = new ReplaySubject(1);
  private rawMessages: ReplaySubject<Message[] | null> = new ReplaySubject(1);

  private loginSuccess: ReplaySubject<boolean | null> = new ReplaySubject(1);

  constructor() {}

  watchUser() {
    return this.user.asObservable();
  }

  watchUsers() {
    return this.users.asObservable();
  }

  watchRawMessage() {
    return this.rawMessage.asObservable();
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
    this.rawMessage.pipe(take(1)).subscribe((m) => (loaded = m != null));
    return loaded;
  }

  getRawMessage() {
    let rawMessage: any | null = null;
    this.rawMessage.pipe(take(1)).subscribe((r) => (rawMessage = r));
    return rawMessage;
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

  pushRawMessage(message: Message | null) {
    this.rawMessage.next(message);
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
