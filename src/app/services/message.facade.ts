import { inject, Injectable } from '@angular/core';
import { MessageService } from './http/message.service';
import { StoreService } from './store.service';
import { combineLatest, map, take } from 'rxjs';
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

  addMessage(messages: Message[], messageText: string, user: User) {
    const newMessage: Message = this.enableButtons(user, {
      author: user.id,
      uuid: crypto.randomUUID(),
      text: messageText,
      comments: [],
      username: user.username,
      pic: user.pic,
      deletable: false,
      editable: false,
      tmstp: Date.now(),
    });
    const newMsgArr: Message[] = messages.slice();
    newMsgArr.push(newMessage);
    this.store.pushMessages(newMsgArr);
  }

  deleteMessage(messages: Message[], message: Message) {
    this.store.pushMessages(messages.filter((m) => m.uuid != message.uuid));
  }

  editMessage(messages: Message[], message: Message) {
    const newMessages = messages.filter((m) => m.uuid != message.uuid);
    newMessages.push(message);
    this.store.pushMessages(newMessages);
  }

  openMessage(message: Message | null) {
    this.store.pushMessage(message);
  }

  unloadMessage() {
    this.store.pushMessage(null);
  }

  unloadMessages() {
    this.store.pushMessages(null);
  }

  loadMessages() {
    this.userFacade.loadUsers();
    combineLatest(this.user$, this.users$, this.rawMessages$)
      .pipe(
        take(1),
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
