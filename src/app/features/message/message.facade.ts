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
  loadHttpMessage,
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
  // Derived
  message$;
  messages$;
  comments$;

  messageService: MessageService = inject(MessageService);
  store: StoreService = inject(StoreService);

  constructor(private ngrxStore: Store) {
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
    this.ngrxStore.dispatch(deleteMessage({ message: message }));
  }

  editMessage(message: Message) {
    this.ngrxStore.dispatch(editMessage({ message }));
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
    this.ngrxStore.dispatch(loadMessages());
  }

  loadMessage(uuid: string) {
    if (!this.store.messageIsLoaded()) {
      this.ngrxStore.dispatch(loadHttpMessage({ uuid }));
    }
  }

  toggleLike(user: User, message: Message) {
    this.ngrxStore.dispatch(toggleLike({ user, message }));
  }

  toggleRetwat(user: User, message: Message) {
    this.ngrxStore.dispatch(toggleRetwat({ user, message }));
  }
}
