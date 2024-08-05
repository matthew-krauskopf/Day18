import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { User } from '../user/user.entity';
import {
  addComment,
  addLike,
  addMessage,
  deleteComment,
  deleteMessage,
  editComment,
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

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addComment),
      exhaustMap((payload) => {
        let newMessage = this.utils.addNewComment(
          payload.message,
          payload.user,
          payload.messageText
        );
        this.storeService.pushRawMessage(newMessage);
        return of(
          editMessage({
            messages: this.storeService.getRawMessages(),
            message: newMessage,
          })
        );
      })
    )
  );

  editComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editComment),
      exhaustMap((payload) => {
        let newMessage: Message = this.utils.replaceComment(
          payload.message,
          payload.comment
        );
        this.storeService.pushRawMessage(newMessage);
        return of(
          editMessage({
            messages: this.storeService.getRawMessages(),
            message: newMessage,
          })
        );
      })
    )
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteComment),
      exhaustMap((payload) => {
        let newMessage = this.utils.popComment(
          payload.message,
          payload.comment
        );
        this.storeService.pushRawMessage(newMessage);
        return of(
          editMessage({
            messages: this.storeService.getRawMessages(),
            message: newMessage,
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
          this.storeService.pushRawMessage(newMessage);

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
          this.storeService.pushRawMessage(newMessage);

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
