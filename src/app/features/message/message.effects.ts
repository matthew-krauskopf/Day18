import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, exhaustMap, map, of } from 'rxjs';
import {
  addLike,
  addRetwat,
  loadHttpMessage,
  loadMessageFail,
  loadMessages,
  loadMessagesFail,
  loadMessagesSuccess,
  loadMessageSuccess,
  removeLike,
  removeRetwat,
  toggleLike,
  toggleLikeFailed,
  toggleRetwat,
} from './message.actions';
import { MessageService } from './message.service';

@Injectable()
export class MessageEffects {
  messageService: MessageService = inject(MessageService);

  constructor(private actions$: Actions) {}

  loadHttpMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHttpMessage),
      exhaustMap((payload) =>
        combineLatest([this.messageService.loadMessage(payload.uuid)]).pipe(
          map(([message]) => {
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

  toggleLike$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleLike),
      map((payload) => {
        if (payload.user != null) {
          console.log(payload.message);
          if (payload.user.likedMessages.includes(payload.message.uuid)) {
            return removeLike({ user: payload.user, message: payload.message });
          } else {
            return addLike({ user: payload.user, message: payload.message });
          }
        } else {
          return toggleLikeFailed();
        }
      })
    )
  );

  toggleRetwat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleRetwat),
      map((payload) => {
        if (payload.user) {
          if (payload.user.retwats.includes(payload.message.uuid)) {
            return removeRetwat({
              user: payload.user,
              message: payload.message,
            });
          } else {
            return addRetwat({ user: payload.user, message: payload.message });
          }
        } else {
          return toggleLikeFailed();
        }
      })
    )
  );
}
