import { inject, Injectable } from '@angular/core';
import { MessageService } from './http/message.service';
import { StoreService } from './store.service';
import { combineLatest, map } from 'rxjs';
import { UserFacade } from './user.facade';
import { User } from '../models/user';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageFacade {
  user$;
  users$;
  rawMessages$;
  message$;
  messages$;

  messageService: MessageService = inject(MessageService);
  store: StoreService = inject(StoreService);
  userFacade: UserFacade = inject(UserFacade);

  constructor() {
    this.user$ = this.userFacade.watchUser();
    this.users$ = this.userFacade.watchUsers();
    this.message$ = this.store.watchMessage();
    this.messages$ = this.store.watchMessages();
    this.rawMessages$ = this.messageService.loadMessages();
  }

  deleteMessage(messages: Message[], message: Message) {
    this.store.pushMessages(messages.filter((m) => m.uuid != message.uuid));
  }

  editMessage(messages: Message[], message: Message) {
    const newMessages = messages.filter((m) => m.uuid != message.uuid);
    newMessages.push(message);
    this.store.pushMessages(newMessages);
  }

  loadMessages() {
    this.userFacade.loadUsers();
    combineLatest(this.user$, this.users$, this.rawMessages$)
      .pipe(
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
          return fullMessages;
        })
      )
      .subscribe((messages) => {
        this.store.pushMessages(messages);
      });
  }

  unloadMessage() {
    this.store.pushMessage(null);
  }

  loadMessage(uuid: string) {
    this.userFacade.loadUsers();
    const rawMessage$ = this.messageService.loadMessage(uuid);

    combineLatest(this.user$, this.users$, rawMessage$)
      .pipe(
        map(([user, users, messages]) => {
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

  watchMessage() {
    return this.message$;
  }

  watchMessages() {
    return this.messages$;
  }

  enableButtons(user: User | null, message: Message): Message {
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

  linkUserInfo(message: Message, users: User[]): Message {
    const user: User = users.filter((u) => u.id == message.author)[0];
    return {
      ...message,
      comments: message.comments
        ? message.comments.map((c) => this.linkUserInfo(c, users))
        : [],
      username: user.username ?? '',
      pic: user.pic ?? '',
    };
  }
}
