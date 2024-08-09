import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
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
  toggleRetwat,
  unloadMessage,
  unloadMessages,
} from './message.actions';
import { Message } from './message.entity';
import {
  selectComments,
  selectMessage,
  selectMessages,
} from './message.selectors';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class MessageFacade {
  // Explicit
  user$;
  users$;
  rawMessages$;

  // Derived
  message$;
  messages$;
  comments$;

  messageService: MessageService = inject(MessageService);
  store: StoreService = inject(StoreService);
  userFacade: UserFacade = inject(UserFacade);

  constructor(private ngrxStore: Store) {
    this.user$ = this.userFacade.user$;
    this.users$ = this.userFacade.users$;
    this.rawMessages$ = this.store.watchRawMessages();

    this.message$ = this.ngrxStore.select(selectMessage);
    this.messages$ = this.ngrxStore.select(selectMessages);
    this.comments$ = this.ngrxStore.select(selectComments);
  }

  addMessage(messageText: string, user: User) {
    this.ngrxStore.dispatch(addMessage({ messageText, user }));
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

  toggleRetwat(message: Message) {
    this.ngrxStore.dispatch(toggleRetwat({ message }));
  }
}
