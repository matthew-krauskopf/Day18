import { createAction, props } from '@ngrx/store';
import { User } from '../user/user.entity';
import { Message } from './message.entity';

export const loadMessage = createAction(
  '[Thread] Load Message',
  props<{ uuid: string }>()
);

export const unloadMessage = createAction('[Thread] Unload Message');

export const unloadMessages = createAction('[Thread] Unload Messages');

export const loadMessageSuccess = createAction(
  '[Thread] Load Message Success',
  props<{ message: Message }>()
);

export const loadMessageFail = createAction('[Thread] Load Message Fail');

export const loadHttpMessage = createAction(
  '[Thread] Load Http Message',
  props<{ uuid: string }>()
);

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
