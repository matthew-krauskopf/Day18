import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
import { UserFacade } from '../user/user.facade';
import {
  addMessage,
  deleteMessage,
  editMessage,
  loadMessage,
  loadMessages,
  loadMessageSuccess,
  unloadMessage,
  unloadMessages,
} from './message.actions';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageUtils } from './message.utils';

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
  utils: MessageUtils = inject(MessageUtils);

  constructor(private ngrxStore: Store) {
    this.user$ = this.userFacade.watchUser();
    this.users$ = this.userFacade.watchUsers();
    this.rawMessage$ = this.store.watchRawMessage();
    this.rawMessages$ = this.store.watchRawMessages();

    this.message$ = combineLatest([
      this.user$,
      this.users$,
      this.rawMessage$,
    ]).pipe(
      map(([user, users, message]) =>
        this.utils.linkMessageData(user, users, message)
      )
    );

    this.messages$ = combineLatest([
      this.user$,
      this.users$,
      this.rawMessages$,
    ]).pipe(
      map(([user, users, messages]) =>
        this.utils.linkMessagesData(user, users, messages)
      )
    );
  }

  watchMessage() {
    return this.message$;
  }

  watchMessages() {
    return this.messages$;
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
    this.ngrxStore.dispatch(unloadMessage());
  }

  unloadMessages() {
    this.ngrxStore.dispatch(unloadMessages());
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
}
