import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import {
  addMessage,
  deleteMessage,
  editMessage,
  loadMessages,
  loadMessagesFail,
  loadMessagesSuccess,
} from '../actions/message.actions';
import { MessageService } from '../http/message.service';
import { StoreService } from '../store.service';

@Injectable()
export class MessageEffects {
  messageService: MessageService = inject(MessageService);
  storeService: StoreService = inject(StoreService);

  constructor(private actions$: Actions) {}

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMessages),
      exhaustMap(() =>
        this.messageService.getMessages().pipe(
          map((messages) => loadMessagesSuccess({ messages: messages })),
          catchError(() => of(loadMessagesFail()))
        )
      )
    )
  );

  loadMessagesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadMessagesSuccess),
        tap((payload) => {
          this.storeService.pushRawMessages(payload.messages);
        })
      ),
    { dispatch: false }
  );

  addMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addMessage),
        tap((payload) => {
          const newMessage = {
            author: payload.user.id,
            uuid: crypto.randomUUID(),
            text: payload.messageText,
            comments: [],
            username: payload.user.username,
            pic: payload.user.pic,
            deletable: false,
            editable: false,
            tmstp: Date.now(),
          };

          const newMsgArr = payload.messages.slice();
          newMsgArr.push(newMessage);
          this.storeService.pushRawMessages(newMsgArr);
        })
      ),
    { dispatch: false }
  );

  editMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(editMessage),
        tap((payload) => {
          const newMessages = payload.messages.filter(
            (m) => m.uuid != payload.message.uuid
          );
          newMessages.push(payload.message);
          this.storeService.pushRawMessages(newMessages);
        })
      ),
    { dispatch: false }
  );

  deleteMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteMessage),
        tap((payload) => {
          this.storeService.pushRawMessages(
            payload.messages.filter((m) => m.uuid != payload.message.uuid)
          );
        })
      ),
    { dispatch: false }
  );
}
