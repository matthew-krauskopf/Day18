import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
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
  localStorage: StoreService = inject(StoreService);

  constructor(private store: Store) {
    this.message$ = this.store.select(selectMessage);
    this.messages$ = this.store.select(selectMessages);
    this.comments$ = this.store.select(selectComments);
  }

  addMessage(messageText: string, user: User) {
    this.store.dispatch(addMessage({ messageText, user }));
  }

  addComment(message: Message, messageText: string, user: User) {
    this.store.dispatch(addComment({ message, messageText, user }));
  }

  deleteMessage(message: Message) {
    this.store.dispatch(deleteMessage({ message: message }));
  }

  editMessage(message: Message) {
    this.store.dispatch(editMessage({ message }));
  }

  openMessage(message: Message) {
    this.store.dispatch(loadMessageSuccess({ message: message }));
  }

  unloadMessage() {
    this.store.dispatch(unloadMessage());
  }

  unloadMessages() {
    this.store.dispatch(unloadMessages());
  }

  loadMessages() {
    this.store.dispatch(loadMessages());
  }

  loadMessage(uuid: string) {
    this.store.dispatch(loadHttpMessage({ uuid }));
  }

  toggleLike(user: User, message: Message) {
    this.store.dispatch(toggleLike({ user, message }));
  }

  toggleRetwat(user: User, message: Message) {
    this.store.dispatch(toggleRetwat({ user, message }));
  }
}
