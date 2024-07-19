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
  users$;
  rawMessages$;
  messages$;
  messageService: MessageService = inject(MessageService);
  store: StoreService = inject(StoreService);
  userFacade: UserFacade = inject(UserFacade);

  constructor() {
    this.users$ = this.userFacade.watchUsers();
    this.messages$ = this.store.watchMessages();
    this.rawMessages$ = this.messageService.loadMessages();
  }

  loadMessages() {
    this.userFacade.loadUsers();
    combineLatest(this.users$, this.rawMessages$)
      .pipe(
        map(([users, messages]) => {
          const fullMessages: Message[] = [];
          messages?.forEach((m) => {
            if (users) {
              const user: User = users.filter((u) => u.id == m.author)[0];
              if (user) {
                fullMessages.push({
                  ...m,
                  username: user.username,
                  pic: user.pic,
                });
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

  watchMessages() {
    return this.messages$;
  }
}
