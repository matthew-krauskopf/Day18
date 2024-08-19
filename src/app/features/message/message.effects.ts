import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ConfirmActionComponent } from '../../components/dialog/confirm-action/confirm-action.component';
import { EditMessageComponent } from '../../components/dialog/edit-message/edit-message.component';
import {
  confirmDeleteMessage,
  deleteMessage,
  editMessage,
  loadHttpMessage,
  loadMessageFail,
  loadMessages,
  loadMessagesFail,
  loadMessagesSuccess,
  loadMessageSuccess,
  noAction,
  saveEdittedMessage,
} from './message.actions';
import { MessageService } from './message.service';

@Injectable()
export class MessageEffects {
  messageService: MessageService = inject(MessageService);
  dialog: MatDialog = inject(MatDialog);

  constructor(private actions$: Actions) {}

  loadHttpMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHttpMessage),
      exhaustMap((payload) =>
        this.messageService.loadMessage(payload.uuid).pipe(
          map((messages) =>
            messages.length > 0
              ? loadMessageSuccess({ message: messages[0] })
              : loadMessageFail()
          ),
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

  editMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editMessage),
      exhaustMap((payload) =>
        this.dialog
          .open(EditMessageComponent, {
            data: {
              text: payload.message.text,
            },
          })
          .afterClosed()
          .pipe(
            map((form) =>
              form
                ? saveEdittedMessage({
                    message: {
                      ...payload.message,
                      text: form.value.text,
                    },
                  })
                : noAction()
            )
          )
      )
    )
  );

  confirmDeleteMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmDeleteMessage),
      exhaustMap((payload) =>
        this.dialog
          .open(ConfirmActionComponent)
          .afterClosed()
          .pipe(
            map((action) =>
              action == true
                ? deleteMessage({ message: payload.message })
                : noAction()
            )
          )
      )
    )
  );
}
