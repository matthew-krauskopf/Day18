import { createAction, props } from '@ngrx/store';
import { Message } from '../../models/message';
import { User } from '../../models/user';

export const loadMessages = createAction('[Home] Load Messages');
export const loadMessagesSuccess = createAction(
  '[Home] Load Messages Success',
  props<{ messages: Message[] }>()
);
export const loadMessagesFail = createAction('[Home] Load Messages Fail');

export const addMessage = createAction(
  '[Home] Add Message',
  props<{ messages: Message[]; messageText: string; user: User }>()
);

export const editMessage = createAction(
  '[Home] Edit Message',
  props<{ messages: Message[]; message: Message }>()
);

export const deleteMessage = createAction(
  '[Home] Delete Message',
  props<{ messages: Message[]; message: Message }>()
);
