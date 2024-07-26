import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import {
  addMessage,
  deleteMessage,
  editMessage,
  loadMessages,
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
  rawMessages$;
  message$;

  // Derived
  messages$;

  messageService: MessageService = inject(MessageService);
  store: StoreService = inject(StoreService);
  userFacade: UserFacade = inject(UserFacade);

  constructor(private ngrxStore: Store) {
    this.user$ = this.userFacade.watchUser();
    this.users$ = this.userFacade.watchUsers();
    this.message$ = this.store.watchMessage();
    this.rawMessages$ = this.store.watchRawMessages();

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

  openMessage(message: Message | null) {
    this.store.pushMessage(message);
  }

  unloadMessage() {
    this.store.pushMessage(null);
  }

  unloadMessages() {
    this.store.pushRawMessages(null);
  }

  loadMessages() {
    this.ngrxStore.dispatch(loadMessages());
    this.userFacade.loadUsers();
  }

  loadMessage(uuid: string) {
    this.userFacade.loadUsers();

    this.message$.pipe(take(1)).subscribe((message) => {
      if (message) {
        return;
      } else {
        const rawMessage$ = this.messageService.loadMessage(uuid);

        combineLatest(this.user$, this.users$, rawMessage$)
          .pipe(
            take(1),
            map(([user, users, messages]) => {
              console.log(messages);
              if (messages.length > 0) {
                // Loaded message successfully
                const message = messages[0];
                if (users) {
                  return this.enableButtons(
                    user,
                    this.linkUserInfo(message, users)
                  );
                }
              }
              return null;
            })
          )
          .subscribe((message) => {
            this.store.pushMessage(message);
          });
      }
    });
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
        (user.id === message.author || user!.permission.toString() == 'ADMIN')
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
