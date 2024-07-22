import { Component, inject, OnInit } from '@angular/core';
import { MessageFacade } from '../../services/message.facade';
import { map, Observable, take } from 'rxjs';
import { Message } from '../../models/message';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserFacade } from '../../services/user.facade';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Permission } from '../../models/permission';
import { MatDialog } from '@angular/material/dialog';
import { EditMessageComponent } from '../dialog/edit-message/edit-message.component';
import { ConfirmActionComponent } from '../dialog/confirm-action/confirm-action.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
export class MessagesComponent implements OnInit {
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

  ngOnInit(): void {
    this.messageFacade.loadMessages();
  }

  openThread(message: Message) {
    this.router.navigate(['home', 'thread', message.uuid]);
  }

  userIsAuthor(user: User | null, message: Message) {
    return user && user.id === message.author;
  }

  userIsAdmin(user: User | null) {
    console.log(user);
    return user && user.permission === Permission.ADMIN;
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
      console.log('here!');
      this.newMessageForm.reset();
    });
  }

  editMessage(message: Message) {
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

  deleteMessage(message: Message) {
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
