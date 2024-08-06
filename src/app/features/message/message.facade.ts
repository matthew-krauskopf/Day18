import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
import { UserFacade } from '../user/user.facade';
import {
  addComment,
  addMessage,
  deleteMessage,
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
  selectedMessaged$;
  rawMessages$;

  // Derived
  message$;
  messages$;
  comments$;

  messageService: MessageService = inject(MessageService);
  store: StoreService = inject(StoreService);
  userFacade: UserFacade = inject(UserFacade);
  utils: MessageUtils = inject(MessageUtils);

  constructor(private ngrxStore: Store) {
    this.user$ = this.userFacade.user$;
    this.users$ = this.userFacade.users$;
    this.selectedMessaged$ = this.store.watchSelectedMessage();
    this.rawMessages$ = this.store.watchRawMessages();

    this.message$ = combineLatest([
      this.user$,
      this.users$,
      this.rawMessages$,
      this.selectedMessaged$,
    ]).pipe(
      map(([user, users, messages, selectedMessaged]) =>
        this.utils.linkMessageData(
          user,
          users,
          messages && selectedMessaged
            ? messages.find(
                (m) => m.uuid == selectedMessaged && !m.retwatAuthor
              ) ?? null
            : null
        )
      )
    );

    this.messages$ = combineLatest([
      this.user$,
      this.users$,
      this.rawMessages$,
    ]).pipe(
      map(([user, users, messages]) =>
        this.utils
          .linkMessagesData(user, users, messages)
          .filter((m) => m.parent == undefined)
      )
    );

    this.comments$ = combineLatest([
      this.user$,
      this.users$,
      this.rawMessages$,
      this.message$,
    ]).pipe(
      map(([user, users, messages, message]) =>
        this.utils.linkMessagesData(
          user,
          users,
          message && messages
            ? messages.filter((m) => m.parent == message.uuid)
            : messages
        )
      )
    );
  }

  addMessage(messageText: string, user: User) {
    this.ngrxStore.dispatch(
      addMessage({ messages: this.store.getRawMessages(), messageText, user })
    );
  }

  addComment(message: Message, messageText: string, user: User) {
    this.ngrxStore.dispatch(addComment({ message, messageText, user }));
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

  toggleLike(message: Message) {
    this.ngrxStore.dispatch(toggleLike({ message: message }));
  }
}
