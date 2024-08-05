import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
import { UserFacade } from '../user/user.facade';
import {
  addComment,
  addMessage,
  deleteComment,
  deleteMessage,
  editComment,
  editMessage,
  loadMessage,
  loadMessages,
  loadMessageSuccess,
  toggleLike,
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
    this.user$ = this.userFacade.user$;
    this.users$ = this.userFacade.users$;
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

  addMessage(messageText: string, user: User) {
    this.ngrxStore.dispatch(
      addMessage({ messages: this.store.getRawMessages(), messageText, user })
    );
  }

  addComment(messageText: string, user: User) {
    this.ngrxStore.dispatch(
      addComment({ message: this.store.getRawMessage(), messageText, user })
    );
  }

  deleteMessage(message: Message) {
    this.ngrxStore.dispatch(
      deleteMessage({ messages: this.store.getRawMessages(), message: message })
    );
  }

  deleteComment(message: Message, comment: Message) {
    this.ngrxStore.dispatch(
      deleteComment({ message: message, comment: comment })
    );
  }

  editMessage(message: Message) {
    this.ngrxStore.dispatch(
      editMessage({ messages: this.store.getRawMessages(), message })
    );
  }

  editComment(message: Message, comment: Message) {
    this.ngrxStore.dispatch(
      editComment({ message: message, comment: comment })
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

  toggleLike(message: Message) {
    this.ngrxStore.dispatch(toggleLike({ message: message }));
  }
}
