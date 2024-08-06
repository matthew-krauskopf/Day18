import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, exhaustMap, map, of, tap } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
import {
  addComment,
  addLike,
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
  removeLike,
  toggleLike,
  toggleLikeFailed,
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
          ? loadMessageSuccess({ message: message[0] })
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
          this.storeService.pushRawMessage(payload.message.uuid);
        })
      ),
    { dispatch: false }
  );

  loadHttpMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHttpMessage),
      exhaustMap((payload) =>
        combineLatest([
          this.messageService.loadMessage(payload.uuid),
          this.messageService.loadComments(payload.uuid),
        ]).pipe(
          map(([message, comments]) => {
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

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addComment),
      exhaustMap((payload) => {
        let comment = this.utils.addNewComment(
          payload.message,
          payload.user,
          payload.messageText
        );
        this.storeService.pushRawMessages(
          this.utils.replaceMessage(this.storeService.getRawMessages(), comment)
        );
        let updatedMessage = this.utils.attachComment(payload.message, comment);
        return of(
          editMessage({
            messages: this.storeService.getRawMessages(),
            message: updatedMessage,
          })
        );
      })
    )
  );

  toggleLike$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleLike),
      map((payload) => {
        const user: User | null = this.storeService.getUser();
        if (user != null) {
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

  addLike$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addLike),
        map((payload) => {
          const likedByArr = payload.message.likedBy.slice();
          likedByArr.push(payload.user.id);
          const newMessage: Message = {
            ...payload.message,
            likedBy: likedByArr,
          };
          this.storeService.pushRawMessages(
            this.utils.replaceMessage(
              this.storeService.getRawMessages(),
              newMessage
            )
          );

          const likedMessagesArr = payload.user.likedMessages.slice();
          likedMessagesArr.push(payload.message.uuid);
          const newUser: User = {
            ...payload.user,
            likedMessages: likedMessagesArr,
          };
          this.storeService.pushUser(newUser);
        })
      ),
    { dispatch: false }
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
            this.utils.replaceMessage(
              this.storeService.getRawMessages(),
              newMessage
            )
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
}
