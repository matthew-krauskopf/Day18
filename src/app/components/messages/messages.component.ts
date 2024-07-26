import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { MessageFacade } from '../../services/facades/message.facade';
import { UserFacade } from '../../services/facades/user.facade';
import { ConfirmActionComponent } from '../dialog/confirm-action/confirm-action.component';
import { EditMessageComponent } from '../dialog/edit-message/edit-message.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  user$: Observable<User | null>;
  messages$: Observable<Message[] | undefined>;
  usersFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  router: Router = inject(Router);
  dialog: MatDialog = inject(MatDialog);

  newMessageForm = new FormGroup({
    message: new FormControl('', Validators.maxLength(280)),
  });

  constructor() {
    this.user$ = this.usersFacade.watchUser();
    this.messages$ = this.messageFacade.watchMessages().pipe(
      map((messages) => {
        return messages?.sort((a, b) => {
          return b.tmstp - a.tmstp;
        });
      })
    );
  }

  openThread(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'thread', message.uuid]);
  }

  addMessage(user: User) {
    this.messages$.pipe(take(1)).subscribe((messages) => {
      if (messages) {
        this.messageFacade.addMessage(
          messages,
          this.newMessageForm.value.message ?? '',
          user
        );
      }
      this.newMessageForm.patchValue({ message: '' });
    });
  }

  addComment($event: Event) {
    $event.stopPropagation();
  }

  addRepost($event: Event) {
    $event.stopPropagation();
  }

  addLike($event: Event) {
    $event.stopPropagation();
  }

  editMessage($event: Event, message: Message) {
    $event.stopPropagation();

    const dialogRef = this.dialog.open(EditMessageComponent, {
      data: {
        text: message.text,
      },
    });

    dialogRef.afterClosed().subscribe((form) => {
      if (form) {
        this.messages$.pipe(take(1)).subscribe((messages) => {
          if (messages) {
            this.messageFacade.editMessage(messages, {
              ...message,
              text: form.value.text,
            });
          }
        });
      }
    });
  }

  deleteMessage($event: Event, message: Message) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmActionComponent);

    dialogRef.afterClosed().subscribe((action) => {
      if (action && action == true) {
        this.messages$.pipe(take(1)).subscribe((messages) => {
          if (messages) {
            this.messageFacade.deleteMessage(messages, message);
          }
        });
      }
    });
  }
}
