import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { StoreService } from '../../services/store.service';
import {
  addComment,
  addMessage,
  deleteMessage,
  editMessage,
  loadHttpMessage,
  loadMessage,
  loadMessageFail,
  loadMessages,
  loadMessagesFail,
  loadMessagesSuccess,
  loadMessageSuccess,
  unloadMessage,
  unloadMessages,
} from './message.actions';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageUtils } from './message.utils';

@Injectable()
export class MessageEffects {
  messageService: MessageService = inject(MessageService);
  storeService: StoreService = inject(StoreService);
  utils: MessageUtils = inject(MessageUtils);

  constructor(private actions$: Actions) {}

  loadMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMessage),
      map((payload) => {
        const rawMessages = this.storeService.getRawMessages();
        const message = rawMessages.filter((rm) => rm == payload.uuid);
        return message.length > 0
          ? loadMessageSuccess(message[0])
          : loadHttpMessage({ uuid: payload.uuid });
      })
    )
  );

  unloadMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(unloadMessage),
        map(() => {
          this.storeService.pushRawMessage(null);
        })
      ),
    { dispatch: false }
  );

  unloadMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(unloadMessages),
        map(() => {
          this.storeService.pushRawMessages(null);
        })
      ),
    { dispatch: false }
  );

  loadMessageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadMessageSuccess),
        tap((payload) => {
          this.storeService.pushRawMessage(payload.message);
        })
      ),
    { dispatch: false }
  );

  loadHttpMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHttpMessage),
      exhaustMap((payload) =>
        this.messageService.loadMessage(payload.uuid).pipe(
          map((message: Message[]) => {
            return message.length > 0
              ? loadMessageSuccess({ message: message[0] })
              : loadMessageFail();
          }),
          catchError(() => of(loadMessageFail()))
        )
      )
    )
  );

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
          this.storeService.pushRawMessages(
            this.utils.addNewMessage(
              payload.messages,
              payload.user,
              payload.messageText
            )
          );
        })
      ),
    { dispatch: false }
  );

  editMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(editMessage),
        tap((payload) => {
          this.storeService.pushRawMessages(
            this.utils.replaceMessage(payload.messages, payload.message)
          );
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
            this.utils.popMessage(payload.messages, payload.message)
          );
        })
      ),
    { dispatch: false }
  );

  addComment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addComment),
        tap((payload) => {
          this.storeService.pushRawMessage(
            this.utils.addNewComment(
              payload.message,
              payload.user,
              payload.messageText
            )
          );
        })
      ),
    { dispatch: false }
  );
}
