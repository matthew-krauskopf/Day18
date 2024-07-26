import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import {
  addMessage,
  deleteMessage,
  editMessage,
  loadMessage,
  loadMessages,
  loadMessageSuccess,
} from '../actions/message.actions';
import { MessageService } from '../http/message.service';
import { StoreService } from '../store.service';
import { UserFacade } from './user.facade';

@Injectable({
  providedIn: 'root',
})
export class MessageFacade {
  // Explicit
  user$;
  users$;
  rawMessage$;
  rawMessages$;

  // Derived
  message$;
  messages$;

  messageService: MessageService = inject(MessageService);
  store: StoreService = inject(StoreService);
  userFacade: UserFacade = inject(UserFacade);

  constructor(private ngrxStore: Store) {
    this.user$ = this.userFacade.watchUser();
    this.users$ = this.userFacade.watchUsers();
    this.rawMessage$ = this.store.watchRawMessage();
    this.rawMessages$ = this.store.watchRawMessages();

    this.message$ = combineLatest(
      this.user$,
      this.users$,
      this.rawMessage$
    ).pipe(
      map(([user, users, message]) => {
        if (message != null && users) {
          return this.enableButtons(user, this.linkUserInfo(message, users));
        }
        return null;
      })
    );

    this.messages$ = combineLatest(
      this.user$,
      this.users$,
      this.rawMessages$
    ).pipe(
      map(([user, users, messages]) => {
        const fullMessages: Message[] = [];
        messages?.forEach((m) => {
          if (users) {
            const author: User = users.filter((u) => u.id == m.author)[0];
            if (author) {
              fullMessages.push(
                this.enableButtons(user, this.linkUserInfo(m, users))
              );
            }
          }
        });
        return fullMessages.sort((a, b) => b.tmstp - a.tmstp);
      })
    );
  }

  addMessage(messageText: string, user: User) {
    this.ngrxStore.dispatch(
      addMessage({ messages: this.store.getRawMessages(), messageText, user })
    );
  }

  deleteMessage(message: Message) {
    this.ngrxStore.dispatch(
      deleteMessage({ messages: this.store.getRawMessages(), message: message })
    );
  }

  editMessage(message: Message) {
    this.ngrxStore.dispatch(
      editMessage({ messages: this.store.getRawMessages(), message })
    );
  }

  openMessage(message: Message) {
    this.ngrxStore.dispatch(loadMessageSuccess({ message: message }));
  }

  unloadMessage() {
    this.store.pushRawMessage(null);
  }

  unloadMessages() {
    this.store.pushRawMessages(null);
  }

  loadMessages() {
    this.userFacade.loadUsers();
    this.ngrxStore.dispatch(loadMessages());
  }

  loadMessage(uuid: string) {
    if (!this.store.messageIsLoaded()) {
      this.userFacade.loadUsers();
      this.ngrxStore.dispatch(loadMessage({ uuid }));
    }
  }

  watchMessage() {
    return this.message$;
  }

  watchMessages() {
    return this.messages$;
  }

  private enableButtons(user: User | null, message: Message): Message {
    return {
      ...message,
      editable: user && user.id === message.author ? true : false,
      deletable:
        user &&
        (user.id === message.author || user.permission.toString() == 'ADMIN')
          ? true
          : false,
    };
  }

  private linkUserInfo(message: Message, users: User[]): Message {
    const user: User = users.filter((u) => u.id == message.author)[0];
    return {
      ...message,
      comments: message.comments
        ? message.comments.map((c) => this.linkUserInfo(c, users))
        : [],
      username: user.username ?? '',
      pic: user.pic ?? '',
      editable: false,
      deletable: false,
    };
  }
}
