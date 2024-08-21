import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
import {
  addComment,
  addLike,
  addMessage,
  addRetwat,
  confirmDeleteMessage,
  editMessage,
  loadHttpMessage,
  loadMessages,
  loadMessageSuccess,
  removeLike,
  removeRetwat,
  unloadMessage,
  unloadMessages,
} from './message.actions';
import { Message } from './message.entity';
import {
  selectAllMessages,
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
  allMessages$;
  message$;
  messages$;
  comments$;

  messageService: MessageService = inject(MessageService);
  localStorage: StoreService = inject(StoreService);

  constructor(private store: Store) {
    this.allMessages$ = this.store.select(selectAllMessages);
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

  confirmDeleteMessage(message: Message) {
    this.store.dispatch(confirmDeleteMessage({ message }));
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

  addLike(user: User, message: Message) {
    this.store.dispatch(addLike({ user, message }));
  }

  removeLike(user: User, message: Message) {
    this.store.dispatch(removeLike({ user, message }));
  }

  addRetwat(user: User, message: Message) {
    this.store.dispatch(addRetwat({ user, message }));
  }

  removeRetwat(user: User, message: Message) {
    this.store.dispatch(removeRetwat({ user, message }));
  }
}
