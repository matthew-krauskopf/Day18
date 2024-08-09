import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, exhaustMap, map, of } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
import {
  addLike,
  addLikeToMessage,
  addRetwat,
  loadHttpMessage,
  loadMessage,
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
import { Message } from './message.entity';
import { MessageService } from './message.service';
import {
  addNewRetwat,
  markRetwatted,
  markUntwatted,
  popTwat,
  replaceMessage,
} from './message.utils';
import { addLikeToUser } from '../user/user.actions';

@Injectable()
export class MessageEffects {
  messageService: MessageService = inject(MessageService);
  storeService: StoreService = inject(StoreService);

  constructor(private actions$: Actions) {}

  loadMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMessage),
      map((payload) => {
        const rawMessages = this.storeService.getRawMessages();
        const message = rawMessages.filter((rm) => rm == payload.uuid);
        return message.length > 0
          ? loadMessageSuccess({ message: message[0] })
          : loadHttpMessage({ uuid: payload.uuid });
      })
    )
  );

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
        const user: User | null = this.storeService.getUser();
        if (user != null) {
          console.log(payload.message);
          if (user.likedMessages.includes(payload.message.uuid)) {
            return removeLike({ user, message: payload.message });
          } else {
            return addLike({ user, message: payload.message });
          }
        } else {
          return toggleLikeFailed();
        }
      })
    )
  );

  removeLike$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeLike),
        map((payload) => {
          const likedByArr = payload.message.likedBy.filter(
            (lb) => lb != payload.user.id
          );
          const newMessage: Message = {
            ...payload.message,
            likedBy: likedByArr,
          };
          this.storeService.pushRawMessages(
            replaceMessage(this.storeService.getRawMessages(), newMessage)
          );

          const likedMessagesArr = payload.user.likedMessages.filter(
            (lm) => lm != payload.message.uuid
          );
          const newUser: User = {
            ...payload.user,
            likedMessages: likedMessagesArr,
          };
          this.storeService.pushUser(newUser);
        })
      ),
    { dispatch: false }
  );

  toggleRetwat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleRetwat),
      map((payload) => {
        const user: User | null = this.storeService.getUser();
        if (user) {
          if (user.retwats.includes(payload.message.uuid)) {
            return removeRetwat({ user, message: payload.message });
          } else {
            return addRetwat({ user, message: payload.message });
          }
        } else {
          return toggleLikeFailed();
        }
      })
    )
  );

  addRetwat$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addRetwat),
        map((payload) => {
          // Update message with new retwat user
          this.storeService.pushRawMessages(
            markRetwatted(
              this.storeService.getRawMessages(),
              payload.message,
              payload.user
            )
          );

          this.storeService.pushRawMessages(
            addNewRetwat(
              this.storeService.getRawMessages(),
              payload.message,
              payload.user
            )
          );

          const retwats = payload.user.retwats.slice();
          retwats.push(payload.message.uuid);
          const newUser: User = {
            ...payload.user,
            retwats: retwats,
          };
          this.storeService.pushUser(newUser);
        })
      ),
    { dispatch: false }
  );

  removeRetwat$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeRetwat),
        map((payload) => {
          // Update message with new retwat user
          this.storeService.pushRawMessages(
            markUntwatted(
              this.storeService.getRawMessages(),
              payload.message,
              payload.user
            )
          );

          this.storeService.pushRawMessages(
            popTwat(
              this.storeService.getRawMessages(),
              payload.message,
              payload.user
            )
          );

          const newUser: User = {
            ...payload.user,
            retwats: payload.user.retwats.filter(
              (rt) => rt != payload.message.uuid
            ),
          };
          this.storeService.pushUser(newUser);
        })
      ),
    { dispatch: false }
  );
}
